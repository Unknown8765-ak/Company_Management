import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getSingleEmployeeAPI } from "../features/users/usersAPI.js"
import { getEmployeeTasksAPI ,addTaskUpdateAPI ,addCommentAPI} from "../features/tasks/tasksAPI.js"
import {getMyRequirementsAPI,createRequirementAPI} from "../features/requirements/requirementsAPI.js"
import { getNotifications, markAsRead } from "../features/notification/notificationsAPI.js";

export default function EmployeePanel() {
  
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [commentText, setCommentText] = useState("")
  const [notifications, setNotifications] = useState([]);
  const [active, setActive] = useState("dashboard")
  const [employee, setEmployee] = useState(null)
  const [tasks, setTasks] = useState([])
  const [requirements, setRequirements] = useState([])

  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    title: "",
    description: ""
  })


  const fetchEmployee = async () => {
    try {

      const res = await getSingleEmployeeAPI(user._id)
      setEmployee(res.data)
    } catch (err) {
      console.log(err.message)

    }
  }
  const fetchNotifications = async () => {
  try {
    const res = await getNotifications();
    console.log(res.data)
    setNotifications(res.data);
  } catch (err) {
    console.log(err.message);
  }
};

  const fetchTasks = async () => {
    try {

      const res = await getEmployeeTasksAPI()
      setTasks(res.data)
    } catch (err) {

      console.log(err.message)

    }
  }


  const fetchRequirements = async () => {
    try {

      const res = await getMyRequirementsAPI()
      console.log(res.data)
      setRequirements(res.data)
    } catch (err) {
      console.log(err.message)

    }
  }

const handleAddComment = async () => {
  try {
    if (!selectedTask) return alert("No task selected")

    await addCommentAPI(selectedTask._id, commentText)

    setCommentText("")
    fetchTasks()

  } catch (error) {
    alert(error.message)
    }
  }

 const handleTaskUpdate = async () => {

  if (!selectedTask) {
    alert("No task selected ❌")
    return
  }
  console.log(selectedTask._id);
  try {
    await addTaskUpdateAPI(
      selectedTask._id,
      {
        progress,
        message
      }
    )

    alert("Task updated 🔥")

    setSelectedTask(null)
    setMessage("")
    fetchTasks()

  } catch (err) {
    console.log(err.message)
  }
}

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {
      const res = await createRequirementAPI(form)
      setRequirements(prev => [...prev, res.data])
      setForm({
        title: "",
        description: ""
      })
      alert("requirement request done : ")
    } catch (err) {

      console.log(err.message)

    }

  }

  useEffect(() => {

    const loadData = async () => {

      await fetchEmployee()
      await fetchTasks()
      await fetchRequirements()
      setLoading(false)
    }

    loadData()

  }, [])
 
  
useEffect(() => {
  fetchRequirements()

  const interval = setInterval(() => {
    fetchRequirements()
  }, 5000)

  return () => clearInterval(interval)
}, [])

useEffect(() => {
  fetchNotifications();

  const interval = setInterval(() => {
    fetchNotifications();
  }, 5000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const handleClick = () => setOpen(false);
  if (open) {
    window.addEventListener("click", handleClick);
  }
  return () => window.removeEventListener("click", handleClick);
}, [open]);



  const completed = tasks.filter(t => t.status === "completed").length
  const pending = tasks.filter(t => t.status !== "completed").length


  const renderContent = () => {
    if (loading) return <p>Loading...</p>
    if (active === "dashboard") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Tasks" value={tasks.length} />
            <StatCard title="Completed Tasks" value={completed} />
            <StatCard title="Pending Tasks" value={pending} />
            <StatCard title="My Requirements" value={requirements.length} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">
              Task Progress
            </h2>
            <Progress
              label="Completed"
              value={(completed / (tasks.length || 1)) * 100}
            />

            <Progress
              label="Pending"
              value={(pending / (tasks.length || 1)) * 100}
            />

          </div>
        </>
      )

    }

    if (active === "tasks") {

      return (
        <>
          <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
          <div className="bg-white rounded-2xl shadow p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Task</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Progress</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{new Date(task.deadline).toLocaleDateString("en-IN")}</td>
                    <td>{task.status}</td>
                    <td>{task.progress || 0}%</td>

                    <td>
                      <button
                        onClick={() => {
                          setSelectedTask(task)
                          setProgress(task.progress || 0)
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      {selectedTask && (
  <div className="mt-6 bg-white p-4 rounded shadow">

    <h3 className="font-bold mb-2">
      Update: {selectedTask.title}
    </h3>

    <p>Progress: {progress}%</p>

    {/* 📁 Attachments */}
    {selectedTask.attachments?.length > 0 && (
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Attachments 📎</h4>

        {selectedTask.attachments.map((file, index) => (
          <a
            key={index}
            href={file.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-blue-600 underline"
          >
            {file.fileName}
          </a>
        ))}
      </div>
    )}

    {/* 🔥 Slider */}
    <input
      type="range"
      min="0"
      max="100"
      value={progress}
      onChange={(e) => setProgress(Number(e.target.value))}
      className="w-full"
    />

    {/* 🔥 Message */}
    <textarea
      placeholder="Write update..."
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      className="w-full border p-2 mt-2"
    />

    {/* 🔥 Buttons */}
    <div className="mt-2 space-x-2">

      <button
        onClick={handleTaskUpdate}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Submit
      </button>

      <button
        onClick={() => setSelectedTask(null)}
        className="bg-gray-400 text-white px-3 py-1 rounded"
      >
        Cancel
      </button>

    </div>

    {/* 💬 Comments Section 🔥 YAHI LAGANA HAI */}
    <div className="mt-6">
      <h3 className="font-bold mb-2">Comments 💬</h3>

      <div className="max-h-40 overflow-y-auto space-y-2 mb-2">

        {selectedTask.comments?.length === 0 && (
          <p className="text-gray-500 text-sm">No comments yet</p>
        )}

        {selectedTask.comments?.map((c, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded">

            <p className="text-sm font-semibold">
              {c.user?.name || "User"}
            </p>

            <p className="text-sm">{c.message}</p>

            <p className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString("en-IN")}
            </p>

          </div>
        ))}

      </div>

      {/* ✍️ Add Comment */}
      <div className="flex gap-2">

        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border p-2 rounded"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddComment()
          }}
        />

        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-3 rounded"
        >
          Send
        </button>

      </div>
    </div>

  </div>
)}
                </div>
              </>
      )

    }

    // ---------------- Raise Requirement
    if (active === "raise") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Raise Requirement
          </h1>

          <div className="bg-white p-6 rounded-2xl shadow max-w-xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <input
                type="text"
                placeholder="Requirement Title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                className="w-full border p-2 rounded"
                required
              />

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Submit Requirement
              </button>

            </form>

          </div>
        </>
      )

    }

    // ---------------- My Requirements

    if (active === "requirements") {

      return (
        <>
          <h1 className="text-2xl font-bold mb-6">
            My Requirements
          </h1>

          <div className="bg-white p-6 rounded-2xl shadow max-w-xl">

            <ul className="space-y-3">

              {requirements.map(req => (

                <li
                  key={req._id}
                  className="flex justify-between border p-3 rounded"
                >

                  <span>{req.title}</span>

                  <span className="font-semibold">
                    {req.status}
                  </span>

                </li>

              ))}

            </ul>

          </div>
        </>
      )

    }

    // ---------------- Profile

    if (active === "profile") {

      return (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Profile
          </h1>

          <div className="bg-white shadow rounded-2xl p-6 max-w-md">

            <ProfileField
              label="Name"
              value={employee?.name}
            />

            <ProfileField
              label="Email"
              value={employee?.email}
            />

            <ProfileField
              label="Department"
              value={employee?.department?.name}
            />

            <ProfileField
              label="Role"
              value={employee?.role}
            />

            <ProfileField
              label="Date of Birth"
              value={new Date(employee?.dob).toLocaleDateString("en-IN")}
            />

          </div>
        </>
      )

    }

  }

  return (

    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}

      <div className="w-64 bg-white shadow-lg p-5">

        <h2 className="text-xl font-bold mb-6">
          Employee Panel
        </h2>

        <nav className="space-y-2">

          <SidebarItem
            label="Dashboard"
            id="dashboard"
            setActive={setActive}
          />

          <SidebarItem
            label="My Tasks"
            id="tasks"
            setActive={setActive}
          />

          <SidebarItem
            label="Raise Requirement"
            id="raise"
            setActive={setActive}
          />

          <SidebarItem
            label="My Requirements"
            id="requirements"
            setActive={setActive}
          />

          <SidebarItem
            label="Profile"
            id="profile"
            setActive={setActive}
          />

        </nav>

      </div>

      {/* Content */}

     <div className="flex-1 p-8">

  {/* 🔔 Notification Bell (TOP RIGHT) */}
  <div className="flex justify-end mb-4 relative">

    <div className="relative cursor-pointer"
     onClick={(e) => {
  e.stopPropagation();
  setOpen(!open);
}}
     >

      <span className="text-2xl">🔔</span>

      {/* 🔴 Unread count */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
          {notifications.filter(n => !n.isRead).length}
        </span>
      )}

      {/* Dropdown */}
      {open &&(
      <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">

        {notifications.length === 0 && (
          <p className="p-3 text-gray-500">No notifications</p>
        )}

        {notifications.map(n => (

          <div
            key={n._id}
            onClick={async (e) => {
             e.stopPropagation();
              await markAsRead(n._id);
              setNotifications(prev =>
                prev.map(item =>
                  item._id === n._id
                    ? { ...item, isRead: true }
                    : item
                )
              );
              if (n.type === "task_assigned") {
                setActive("tasks");
              }
              if (n.type.includes("requirement")) {
                setActive("requirements");
                }
            }}
            className={`p-3 border-b cursor-pointer ${
              n.isRead ? "bg-gray-100" : "bg-white"
            }`}
          >
            <p className="font-semibold text-sm">{n.title}</p>
            <p className="text-xs text-gray-600">{n.message}</p>
          </div>

        ))}

      </div>
      )}

    </div>

  </div>

  {/* 🔽 Existing Content */}
  {renderContent()}

</div>

    </div>

  )

}


// UI components

function SidebarItem({ label, id, setActive }) {

  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left px-3 py-2 rounded hover:bg-gray-200"
    >
      {label}
    </button>
  )

}


function StatCard({ title, value }) {

  return (
    <div className="bg-white p-4 rounded-2xl shadow">

      <p className="text-gray-500">{title}</p>

      <p className="text-2xl font-bold">{value}</p>

    </div>
  )

}


function Progress({ label, value }) {

  return (
    <div className="mb-4">

      <p className="text-sm mb-1">{label}</p>

      <div className="w-full bg-gray-200 h-3 rounded-full">

        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  )

}


function ProfileField({ label, value }) {

  return (
    <div className="mb-3">

      <p className="text-gray-500 text-sm">{label}</p>

      <p className="font-semibold">{value}</p>

    </div>
  )

}
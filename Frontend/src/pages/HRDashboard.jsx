import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { createTaskAPI } from "../features/tasks/tasksAPI.js"

import { getDepartmentsAPI } from "../features/departments/departmentAPI.js"
import {
  getAllEmployeesAPI,
  deleteEmployeeAPI,
  getSingleEmployeeAPI,
  createEmployeeAPI
} from "../features/users/usersAPI";
import { getAllTasksAPI,deleteTaskAPI,addCommentAPI} from "../features/tasks/tasksAPI";
import {
  getAllRequirementsAPI,
  sendToAdminAPI
} from "../features/requirements/requirementsAPI";
import { getNotifications , markAsRead } from "../features/notification/notificationsAPI.js"

export default function HRDashboard() {

  const { user } = useSelector(state => state.auth)
  const [search, setSearch] = useState("")
const [statusFilter, setStatusFilter] = useState("")
const [dateFilter, setDateFilter] = useState("")
const [employeeSearch, setEmployeeSearch] = useState("")
  const [active, setActive] = useState("dashboard")
  const [profile, setProfile] = useState(null)
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [requirements, setRequirements] = useState([])
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const filteredTasks = tasks.filter(task => {

  const matchSearch =
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.assignedTo?.name?.toLowerCase().includes(search.toLowerCase())

  const matchStatus =
    statusFilter ? task.status === statusFilter : true

  const matchDate =
    dateFilter
      ? new Date(task.deadline).toLocaleDateString("en-IN") ===
        new Date(dateFilter).toLocaleDateString("en-IN")
      : true

  return matchSearch && matchStatus && matchDate
})

const filteredRequirements = requirements.filter(req => {

  const matchSearch =
    req.title.toLowerCase().includes(search.toLowerCase())

  const matchStatus =
    statusFilter ? req.status === statusFilter : true

  return matchSearch && matchStatus
})

const filteredEmployees = employees.filter(emp =>
  emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
  emp.email.toLowerCase().includes(employeeSearch.toLowerCase())
)
  
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  department: "",
  dob: ""
})

const [taskData, setTaskData] = useState({
  title: "",
  description: "",
  assignedTo: "",
  deadline: "",
  file: null
})
useEffect(() => {
  fetchEmployees()
  fetchDepartments()
}, [])

const fetchDepartments = async () => {
  try {
    const res = await getDepartmentsAPI()
    setDepartments(res.data || [])
  } catch (err) {
    console.error(err)
  }
}

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
const handleTaskChange = (e) => {
  setTaskData({
    ...taskData,
    [e.target.name]: e.target.value
  })
}

const handleCreateTask = async () => {
  try {
    const formData = new FormData()

    formData.append("title", taskData.title)
    formData.append("description", taskData.description)
    formData.append("assignedTo", taskData.assignedTo)
    formData.append("deadline", taskData.deadline)

    if (taskData.file) {
      formData.append("file", taskData.file)
    }
    console.log(formData)

    await createTaskAPI(formData)

    alert("Task Created & Assigned")

    setShowTaskModal(false)

    setTaskData({
      title: "",
      description: "",
      assignedTo: "",
      deadline: "",
      file: null
    })

    const res = await getAllTasksAPI()
    setTasks(res.data || [])

  } catch (err) {
    alert(err.message)
  }
}

const handleCreateEmployee = async () => {
  try {
    await createEmployeeAPI(formData)

    alert("Employee Created ✅")

    setShowModal(false)

    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      dob: ""
    })

    fetchEmployees() // refresh list

  } catch (err) {
    alert(err.message)
  }
} 

const fetchEmployees = async () => {
  try {
    const res = await getAllEmployeesAPI()
    console.log("reponse : ",res);
    
    const filteredEmployees = res.data.filter(
  (emp) => emp.department?._id === profile?.department?._id
);
    setEmployees(filteredEmployees);
  } catch (err) {
    console.error(err)
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
const handleAddComment = async () => {
  try {
    await addCommentAPI(selectedTask._id, commentText)

    setCommentText("")
    alert("message send succesfully")

    // 🔥 refresh selected task
    const res = await getAllTasksAPI()
    setTasks(res.data)

    const updated = res.data.find(t => t._id === selectedTask._id)
    setSelectedTask(updated)

  } catch (err) {
    alert(err.message)
  }
}
  // ---------------- Load Data ----------------
  useEffect(() => {

    const loadData = async () => {
      try {
        console.log(user._id)
        const profileRes = await getSingleEmployeeAPI(user._id);
      
        const taskRes = await getAllTasksAPI()
        const reqRes = await getAllRequirementsAPI()
        
        setProfile(profileRes.data)
        setTasks(taskRes.data)
        setRequirements(reqRes.data)

      } catch (err) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()

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

  // ---------------- Stats ----------------
  const completedTasks = tasks.filter(t => t.status === "completed").length
  const pendingTasks = tasks.length - completedTasks

  const handleDelete = async (id) => {
    await deleteEmployeeAPI(id)
    setEmployees(prev => prev.filter(emp => emp._id !== id))
    alert("employee deleted successfully")
  }

  const handleDeleteTask = async (id) => {
    await deleteTaskAPI(id)
    setTasks(prev => prev.filter(tsk => tsk._id !== id))
    alert("tasks deleted successfully")
  }

  const handleSend = async (id) => {
    const res = await sendToAdminAPI(id)
    console.log("send",res)
    alert("request send succesfully");
    setRequirements(prev =>
      prev.map(r => r._id === id ? res.data : r)
    )
  }


  useEffect(() => {
  if (profile) {
    fetchEmployees(); // ✅ ab safe hai
  }
}, [profile]);


  if (loading) return <p>Loading...</p>

  // ---------------- Render ----------------
  const renderContent = () => {

    if (active === "dashboard") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <Stat title="Employees" value={employees.length} />
            <Stat title="Total Tasks" value={tasks.length} />
            <Stat title="Completed" value={completedTasks} color="green" />
            <Stat title="Pending" value={pendingTasks} color="red" />
          </div>
        </>
      )
    }

    if (active === "employees") {
  return (
    <>
      {/* 🔥 TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>
      <div className="flex justify-items-center items-center mb-4">

  <input
    type="text"
    placeholder="Search employee by name/email..."
    value={employeeSearch}
    onChange={(e) => setEmployeeSearch(e.target.value)}
    className="border p-2 m-3.5 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    onClick={() => {
      setEmployeeSearch("")
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Reset
  </button>

</div>
    
      {/* 🔥 TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white shadow-sm hover:shadow-md transition rounded-lg">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Join Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp._id} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">{new Date(emp.createdAt).toLocaleDateString("en-IN")}</td>
                <td className="p-2">
                  <button className="bg-red-500 text-white px-2 py-1 rounded" 
                  onClick={()=>handleDelete(emp._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
        {filteredEmployees.length === 0 && employeeSearch && (
  <p className="text-center text-gray-500 mt-4">
    No employees found 😕
  </p>
)}
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          
<div className="bg-white p-6 rounded-2xl w-96 shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>

            <input
              name="name"
              placeholder="Name"
              className="w-full border p-2 mb-3"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              className="w-full border p-2 mb-3"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border p-2 mb-3"
              value={formData.password}
              onChange={handleChange}
            />

            <select
              name="department"
              className="w-full border p-2 mb-3"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map(dep => (
                <option key={dep._id} value={dep.name}>
                  {dep.name}
                </option>
              ))}
            </select>

            <input
              name="dob"
              type="date"
              className="w-full border p-2 mb-3"
              value={formData.dob}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateEmployee}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}


if (active === "tasks") {
  return (
    <>
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">

  <input
    type="text"
    placeholder="Search task..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <button
    onClick={() => {
      setSearch("")
      setStatusFilter("")
      setDateFilter("")
    }}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

  >
    Reset
  </button>

</div>

      {/* 🔥 Table */}
      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2">Task</th>
              <th className="p-2">Assigned</th>
              <th className="p-2">Deadline</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map(task => (
              <tr key={task._id} className="border-b hover:bg-gray-50 transition">

                <td className="p-2 font-medium">{task.title}</td>

                <td className="p-2">
                  {task.assignedTo?.name || "—"}
                </td>

                <td className="p-2">
                  {new Date(task.deadline).toLocaleDateString("en-IN")}
                </td>

                <td className={`p-2 font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "in_progress"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {task.status}
                </td>

                <td className="p-2 space-x-2">

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setSelectedTask(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>

                </td>

              </tr>
            ))}
          </tbody>
        </table>
            {filteredTasks.length === 0 && (
  <p className="text-center text-gray-500 mt-4">
    No tasks found 😕
  </p>
)}
        {/* 🔥 Selected Task Panel */}
        {selectedTask && (
          <div className="mt-6 bg-gray-50 p-5 rounded-2xl border shadow">

            <h3 className="font-bold mb-2">
              Task: {selectedTask.title}
            </h3>

            <p className="mb-2">Progress: {progress}%</p>

            {/* 📁 Attachments */}
            {selectedTask.attachments?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Attachments 📎</h4>

                {selectedTask.attachments.map((file, i) => (
                  <a
                    key={i}
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

            {/* 🔥 Progress Slider */}
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
              className="w-full border p-2 mt-3 rounded"
            />

            {/* 🔥 Buttons */}
            <div className="mt-3 space-x-2">

              <button
                onClick={handleTaskUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
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

            {/* 💬 Comments */}
            <div className="mt-6">
              <h3 className="font-bold mb-2">Comments 💬</h3>

              <div className="max-h-40 overflow-y-auto space-y-2 mb-2">

                {selectedTask.comments?.length === 0 && (
                  <p className="text-gray-500 text-sm">No comments yet</p>
                )}

                {selectedTask.comments?.map((c, i) => (
                  <div key={i} className="bg-white p-3 rounded shadow-sm">

                    <p className="text-sm font-semibold text-indigo-600">
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

      {/* 🔥 Modal (UNCHANGED LOGIC) */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4">Create Task</h2>

            <input
              name="title"
              placeholder="Title"
              className="w-full border p-2 mb-2"
              value={taskData.title}
              onChange={handleTaskChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              className="w-full border p-2 mb-2"
              value={taskData.description}
              onChange={handleTaskChange}
            />

            <select
              name="assignedTo"
              className="w-full border p-2 mb-2"
              value={taskData.assignedTo}
              onChange={handleTaskChange}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="deadline"
              className="w-full border p-2 mb-2"
              value={taskData.deadline}
              onChange={handleTaskChange}
            />

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  file: e.target.files[0]
                })
              }
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowTaskModal(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTask}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}
    if (active === "reports") {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Requirement</h1>
      </div>
      <div className="flex gap-3 mb-4">

  <input
    type="text"
    placeholder="Search requirement..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>

</div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Title</th>
              <th className="p-3">RaisedBy</th>
              <th className="p-3">Status</th>
              <th className="p-3">Raised Date</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequirements.map(req => (
              <tr
                key={req._id}
                className="border-b hover:bg-gray-50 transition"
              >
                
                <td className="p-3 font-medium">
                  {req.title}
                </td>
                <td className="p-3 font-medium">
                  {req.raisedBy?.name || "—"}
                </td>
                

                <td className={`p-3 font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {req.status}
                </td>
                 <td className="p-3 font-medium">
                  {new Date(req.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="p-3">
                  <button
                    disabled={req.sentToAdmin}
                    onClick={() => handleSend(req._id)}
                    className={`px-4 py-1 rounded-lg transition ${
                      req.sentToAdmin
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    {req.sentToAdmin ? "Sent" : "Send"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>


        {/* 🔥 EMPTY STATE */}
        {filteredRequirements.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No reports available
          </div>
        )}

      </div>

    </div>
  );
}

    if (active === "profile") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <div className="bg-white p-6 rounded-xl shadow max-w-md">
            <Field label="Name" value={profile?.name} />
            <Field label="Email" value={profile?.email} />
            <Field label="Department" value={profile?.department?.name} />
            <Field label="Role" value={profile?.role} />
            <Field label="Company" value={profile?.company} />
            <Field label="DOB" value={new Date(profile?.dob).toLocaleDateString("en-IN")}/>
          </div>
        </>
      )
    }
  }

  return (
   <div className="flex min-h-screen bg-linear-to-br from-gray-100 to-gray-200">

      <div className="w-64 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 
text-white p-5 shadow-2xl">

        <h2 className="text-2xl font-bold mb-8 tracking-wide">
  🚀 HR Panel
</h2>

        <SidebarItem label="Dashboard" id="dashboard" setActive={setActive} />
        <SidebarItem label="Employees" id="employees" setActive={setActive} />
        <SidebarItem label="Tasks" id="tasks" setActive={setActive} />
        <SidebarItem label="Requirement" id="reports" setActive={setActive} />
        <SidebarItem label="Profile" id="profile" setActive={setActive} />

      </div>

      {/* Content */}
      <div className="flex-1 p-8">

  {/* 🔔 Notification Bell */}
  <div className="flex justify-end mb-4 relative">

    <div
      className="relative cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >

      <div className="text-2xl bg-white shadow-md p-2 rounded-full hover:scale-110 transition">
  🔔
</div>

      {/* 🔴 Unread count */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
          {notifications.filter(n => !n.isRead).length}
        </span>
      )}

      {/* Dropdown */}
      {open && (
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

                // 🔥 HR redirect logic
                if (n.type === "requirement_raised") {
                  setActive("reports");
                }

                if (n.type === "requirement_rejected") {
                  setActive("reports");
                }
                if (n.type === "requirement_forwarded") {
                    setActive("reports");
                }

              }}
              className={`p-3 border-b cursor-pointer ${
                n.isRead ? "bg-gray-100" : "bg-blue-50 font-semibold"
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

    {selectedTask && (
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

        <div className="bg-white w-125 p-5 rounded-xl shadow-xl">

          <h2 className="text-xl font-bold mb-3">
            {selectedTask.title}
          </h2>

          {/* 🔥 COMMENTS LIST */}
          <div className="h-60 overflow-y-auto border p-2 mb-3">

            {selectedTask.comments?.length === 0 && (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}

            {selectedTask.comments?.map((c, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm font-semibold">
                  {c.user?.name || "User"}
                </p>
                <p className="text-sm">{c.message}</p>
              </div>
            ))}

          </div>

          {/* 🔥 ADD COMMENT */}
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border p-2 rounded"
            />

            <button
              onClick={handleAddComment}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Send
            </button>
          </div>

          <button
            onClick={() => setSelectedTask(null)}
            className="mt-3 text-red-500"
          >
            Close
          </button>

        </div>
      </div>
    )}

    </div>
  )
}

// ---------------- UI Components ----------------

function SidebarItem({ label, id, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left px-3 py-2 rounded-lg 
hover:bg-white/10 hover:translate-x-1 transition-all duration-200"
    >
      {label}
    </button>
  )
}

function Stat({ title, value, color }) {
  return (
    <div className="bg-linear-to-r from-white to-gray-100 
p-5 rounded-2xl shadow-lg hover:scale-105 transition">
      <h3 className="text-gray-500 flex items-center gap-2">
  📊 {title}
</h3>
      <p className={`text-2xl font-bold ${
        color === "green"
          ? "text-green-600"
          : color === "red"
          ? "text-red-500"
          : ""
      }`}>
        {value}
      </p>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="mb-3">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  )
}
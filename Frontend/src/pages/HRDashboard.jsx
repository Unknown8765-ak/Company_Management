import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { createTaskAPI } from "../features/tasks/tasksAPI.js"

import { getDepartmentsAPI } from "../features/departments/departmentAPI.js"
import {
  getAllEmployeesAPI,
  deleteEmployeeAPI,
  getSingleEmployeeAPI,
  createEmployeeAPI
} from "../features/users/usersAPI"

import { getAllTasksAPI,deleteTaskAPI } from "../features/tasks/tasksAPI"

import {
  getAllRequirementsAPI,
  sendToAdminAPI
} from "../features/requirements/requirementsAPI"

export default function HRDashboard() {

  const { user } = useSelector(state => state.auth)
  const [active, setActive] = useState("dashboard")

  const [profile, setProfile] = useState(null)
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [requirements, setRequirements] = useState([])
  const [departments, setDepartments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [loading, setLoading] = useState(true)
  
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
  deadline: ""
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
    await createTaskAPI(taskData)
    console.log("taskData : ",taskData)
    alert("Task Created & Assigned ")

    setShowTaskModal(false)

    setTaskData({
      title: "",
      description: "",
      assignedTo: "",
      deadline: ""
    })

    // refresh tasks
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
    // console.log("reponse : ",res);
    
    const filteredEmployees = res.data.filter(
  (emp) => emp.department?._id === profile?.department?._id
);
    setEmployees(filteredEmployees);
  } catch (err) {
    console.error(err)
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
        // console.log("profile : ",profileRes);
        
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

      {/* 🔥 TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
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
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96">

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
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          onClick={() => setShowTaskModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map(task => (
              <tr key={task._id} className="border-b hover:bg-gray-50 transition">

                <td className="p-3 font-medium">{task.title}</td>

                <td className={`p-3 font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "in_progress"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}>
                  {task.status}
                </td>

                <td className="p-3">
                  {task.assignedTo?.name || "—"}
                </td>

                <td className="p-3">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* 🔥 MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4">Create Task</h2>

            <input
              name="title"
              placeholder="Title"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={taskData.title}
              onChange={handleTaskChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={taskData.description}
              onChange={handleTaskChange}
            />

            <select
              name="assignedTo"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={taskData.deadline}
              onChange={handleTaskChange}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowTaskModal(false)}
                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTask}
                className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
    if (active === "reports") {
  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {requirements.map(req => (
              <tr
                key={req._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">
                  {req.title}
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
        {requirements.length === 0 && (
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
            <Field label="DOB" value={profile?.dob} />
          </div>
        </>
      )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5">

        <h2 className="text-2xl font-bold mb-8">HR Panel</h2>

        <SidebarItem label="Dashboard" id="dashboard" setActive={setActive} />
        <SidebarItem label="Employees" id="employees" setActive={setActive} />
        <SidebarItem label="Tasks" id="tasks" setActive={setActive} />
        <SidebarItem label="Reports" id="reports" setActive={setActive} />
        <SidebarItem label="Profile" id="profile" setActive={setActive} />

      </div>

      {/* Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>

    </div>
  )
}

// ---------------- UI Components ----------------

function SidebarItem({ label, id, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left mb-3 hover:text-gray-300"
    >
      {label}
    </button>
  )
}

function Stat({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="text-gray-500">{title}</h3>
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
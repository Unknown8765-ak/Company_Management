import { useEffect, useState } from "react"

import { getDepartmentsAPI ,deleteDepartmentAPI ,createDepartmentAPI} from "../features/departments/departmentAPI.js"
import { getAllEmployeesAPI ,getAllHRAPI ,createEmployeeAPI,createHRAPI,deleteEmployeeAPI} from "../features/users/usersAPI.js"
import { getAllRequirementsAPI ,updateRequirementStatusAPI} from "../features/requirements/requirementsAPI.js"
import { getAllTasksAPI ,deleteTaskAPI} from "../features/tasks/tasksAPI.js"
import { getNotifications, markAsRead } from "../features/notification/notificationsAPI.js"


export default function SuperAdminPanel() {

  const [active, setActive] = useState("dashboard")
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [requirements, setRequirements] = useState([])
  const [tasks, setTasks] = useState([])
  const [hrs, setHrs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showDeptModal, setShowDeptModal] = useState(false)
  const [showHRModal, setShowHRModal] = useState(false)

  const [loading, setLoading] = useState(false)

const [deptForm, setDeptForm] = useState({
  name: "",
  description: "",
})

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  department: "",
  dob: ""
})

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })
}
const handleDeptChange = (e) => {
  setDeptForm({
    ...deptForm,
    [e.target.name]: e.target.value
  })
}

const handleCreateDepartment = async () => {
  try {
    await createDepartmentAPI(deptForm)

    alert("Department Created ✅")

    setShowDeptModal(false)

    setDeptForm({
      name: "",
      description: "",
    })

    await fetchData() // refresh list

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

    await fetchData()

  } catch (err) {
    alert(err.message)
  }
} 

const handleCreateHR = async () => {
  try {
    await createHRAPI(formData)

    alert("HR Created ✅")

    setShowHRModal(false)

    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      dob: ""
    })

    await fetchData()

  } catch (err) {
    alert(err.message)
    }
  }
const handleStatusUpdate = async (id, status) => {
  try {
    console.log("clicked")
    await updateRequirementStatusAPI({
      requirementId: id,
      status: status
    })
    setRequirements(prev =>
      prev.map(req =>
        req._id === id ? { ...req, status } : req
      )
    )
    alert("edit requirement succsessfully")
  } catch (err) {
    alert(err.message)
  }
}

  const fetchData = async () => {
    try {
      setLoading(true)

      const deptRes = await getDepartmentsAPI()
      const empRes = await getAllEmployeesAPI()
      const empResHR = await getAllHRAPI()
      const reqRes = await getAllRequirementsAPI()
      const taskRes = await getAllTasksAPI()

      const deptData = deptRes.data || []
      const empData = empRes.data || []
      const empDataHR = empResHR.data || []
      const reqData = reqRes.data || []
      const taskData = taskRes.data || []

      setDepartments(deptData)
      console.log(deptData)
      console.log("emp",empData)
      setEmployees(empData)
      setRequirements(reqData)
      setTasks(taskData)
      setHrs(empDataHR)

    } catch (err) {
      console.error("Super Admin Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
  try {
    const res = await getNotifications();
    setNotifications(res.data);
  } catch (err) {
    console.log(err.message);
  }
};

  const handleDeleteEmp = async (id) => {
    await deleteEmployeeAPI(id)
    setEmployees(prev => prev.filter(emp => emp._id !== id))
  }
  
  const handleDeleteHR = async (id) => {
    await deleteEmployeeAPI(id)
    setHrs(prev => prev.filter(hr => hr._id !== id))
  }

  const handleDeleteDep = async (id) => {
    await deleteDepartmentAPI(id)
    alert("Department Delete successfull")
    setDepartments(prev => prev.filter(dept => dept._id !== id))
  }
  const handleDeleteTask = async (id) => {
    await deleteTaskAPI(id)
    alert("Task Delete successfull")
    setTasks(prev => prev.filter(task => task._id !== id))
  }

  useEffect(() => {
    fetchData()
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

  
  const renderContent = () => {

    if (loading) return <p>Loading...</p>

    if (active === "dashboard") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Departments" value={departments.length} />
            <StatCard title="HR" value={hrs.length} />
            <StatCard title="Employees" value={employees.length} />
            <StatCard title="Tasks" value={tasks.length} />
          </div>
        </>
      )
    }

   if (active === "departments") {
  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Departments</h1>

        <button
          onClick={() => setShowDeptModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Department
        </button>
      </div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Department</th>
              <th className="p-3">HR</th>
              <th className="p-3">Employees</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">
                  {dept.name}
                </td>

                <td className="p-3">
                  {dept.manager?.name || "—"}
                </td>

                <td className="p-3">
                  {dept.totalEmployees || 0}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteDep(dept._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {departments.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No departments available
          </div>
        )}

      </div>

      
      {showDeptModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4 text-center">
              Create Department
            </h2>

            <input
              name="name"
              placeholder="Department Name"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={deptForm.name}
              onChange={handleDeptChange}
            />

            <input
              name="description"
              placeholder="Description"
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={deptForm.description}
              onChange={handleDeptChange}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeptModal(false)}
                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateDepartment}
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

 if (active === "hr") {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">HR Management</h1>

        <button
          onClick={() => setShowHRModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add HR
        </button>
      </div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">Join Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {hrs.map((hr) => (
              <tr
                key={hr._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">{hr.name}</td>

                <td className="p-3">{hr.email}</td>

                <td className="p-3">
                  {hr.department?.name || "—"}
                </td>
                <td className="p-3">
                  {new Date(hr.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteHR(hr._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {hrs.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No HRs available
          </div>
        )}

      </div>

     
      {showHRModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-4 text-center">
              Add HR
            </h2>

            <input
              name="name"
              placeholder="Name"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
            />

            <select
              name="department"
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.dob}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowHRModal(false)}
                className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateHR}
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
        <th className="p-2">Department</th>
        <th className="p-2">Join Date</th>
        <th className="p-2">Action</th>
      </tr>
    </thead>

    <tbody>
      {employees.map((emp) => (
        <tr key={emp._id} className="border-b">
          
          <td className="p-2">{emp.name}</td>
          
          <td className="p-2">{emp.role}</td>
          
          <td className="p-2">
            {emp.department?.name || "N/A"}
          </td>
          <td className="p-2">
            {new Date(emp.createdAt).toLocaleDateString("en-IN")}
          </td>

          <td className="p-2">
            <button
              onClick={() => handleDeleteEmp(emp._id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
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
    if (active === "requirements") {
  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Requirement Board</h1>
      </div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Title</th>
              <th className="p-3">Raised By</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {requirements.map((req) => (
              <tr
                key={req._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">{req.title}</td>

                <td className="p-3">
                  {req.raisedBy?.name || "—"}
                </td>

                <td className={`p-3 font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}>
                  {req.status}
                </td>

                <td className="p-3 flex justify-center gap-2">

                  {/* APPROVE */}
<div className="flex gap-3">
  <button
    onClick={() => handleStatusUpdate(req._id, "approved")}
    className={`px-4 py-2 rounded-full font-medium transition-all duration-300
      ${
        req.status === "approved"
          ? "bg-green-500 text-white shadow-lg shadow-green-300 scale-105"
          : "bg-gray-200 text-gray-700 hover:bg-green-100"
      }`}
  >
    ✅ Approve
  </button>

  <button
    onClick={() => handleStatusUpdate(req._id, "rejected")}
    className={`px-4 py-2 rounded-full font-medium transition-all duration-300
      ${
        req.status === "rejected"
          ? "bg-red-500 text-white shadow-lg shadow-red-300 scale-105"
          : "bg-gray-200 text-gray-700 hover:bg-red-100"
      }`}
  >
    ❌ Reject
  </button>
</div>

                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {/* 🔥 EMPTY STATE */}
        {requirements.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No requirements available
          </div>
        )}

      </div>

    </div>
  );
}

 if (active === "tasks") {
  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks Overview</h1>
      </div>

      {/* 🔥 TABLE CONTAINER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Task</th>
              <th className="p-3">Assigned To</th>
              <th className="p-3">Status</th>
              <th className="p-3">Deadline</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">
                  {task.title}
                </td>

                <td className="p-3">
                  {task.assignedTo?.name || "—"}
                </td>

                {/* 🔥 STATUS COLOR */}
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
                  {new Date(task.deadline).toLocaleDateString("en-IN")}
                </td>

                {/* 🔥 ONLY DELETE BUTTON */}
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {/* 🔥 EMPTY STATE */}
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No tasks available
          </div>
        )}

      </div>

    </div>
  );
}

    if (active === "reports") {
      return (
        <>
          <h1 className="text-2xl font-bold mb-6">Reports</h1>

          <div className="bg-white p-6 rounded-2xl shadow space-y-2">
            <p>Total Departments: {departments.length}</p>
            <p>Total HR: {hrs.length}</p>
            <p>Total Employees: {employees.length}</p>
            <p>Total Requirements: {requirements.length}</p>
            <p>Total Tasks: {tasks.length}</p>
          </div>
        </>
      )
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-xl font-bold mb-6">Super Admin</h2>

        <nav className="space-y-2">
          <SidebarItem label="Dashboard" id="dashboard" setActive={setActive} />
          <SidebarItem label="Departments" id="departments" setActive={setActive} />
          <SidebarItem label="HR Management" id="hr" setActive={setActive} />
          <SidebarItem label="Employees" id="employees" setActive={setActive} />
          <SidebarItem label="Requirement Board" id="requirements" setActive={setActive} />
          <SidebarItem label="Tasks Overview" id="tasks" setActive={setActive} />
          <SidebarItem label="Reports" id="reports" setActive={setActive} />
        </nav>
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
      <span className="text-2xl">🔔</span>

      {/* 🔴 unread count */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
          {notifications.filter(n => !n.isRead).length}
        </span>
      )}

      {/* dropdown */}
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

                // 🔥 navigation logic
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

  {renderContent()}

</div>
    </div>
  )
}

// ----------------------------
// Components
// ----------------------------
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
import { useEffect, useState } from "react"

import { getDepartmentsAPI ,deleteDepartmentAPI ,createDepartmentAPI} from "../features/departments/departmentAPI.js"
import { getAllEmployeesAPI ,getAllHRAPI ,createEmployeeAPI,createHRAPI,deleteEmployeeAPI} from "../features/users/usersAPI.js"
import { getAllRequirementsAPI ,updateRequirementStatusAPI} from "../features/requirements/requirementsAPI.js"
import { getAllTasksAPI ,deleteTaskAPI} from "../features/tasks/tasksAPI.js"
import { getNotifications, markAsRead } from "../features/notification/notificationsAPI.js"


export default function AdminPanel() {

  const [active, setActive] = useState("dashboard")
  const [open, setOpen] = useState(false);
  const [empSearch, setEmpSearch] = useState("")
  const [reqSearch, setReqSearch] = useState("")
  const [reqStatus, setReqStatus] = useState("")
  const [taskSearch, setTaskSearch] = useState("")
  const [taskStatus, setTaskStatus] = useState("")
  const [taskDate, setTaskDate] = useState("")
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
  const [plan, setPlan] = useState("free") // default
const [showPlanModal, setShowPlanModal] = useState(false)

  const filteredEmployees = employees.filter(emp => {
  if (!empSearch.trim()) return true

  return (
    emp.name.toLowerCase().includes(empSearch.toLowerCase()) ||
    emp.email.toLowerCase().includes(empSearch.toLowerCase())
  )
})


const filteredRequirements = requirements.filter(req => {
  const matchSearch = req.title.toLowerCase().includes(reqSearch.toLowerCase())

  const matchStatus =
    reqStatus ? req.status === reqStatus : true

  return matchSearch && matchStatus
})

const filteredTasks = tasks.filter(task => {
  const matchSearch =
    task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
    task.assignedTo?.name?.toLowerCase().includes(taskSearch.toLowerCase())

  const matchStatus =
    taskStatus ? task.status === taskStatus : true

  const matchDate =
    taskDate
      ? new Date(task.deadline).toLocaleDateString("en-IN") ===
        new Date(taskDate).toLocaleDateString("en-IN")
      : true

  return matchSearch && matchStatus && matchDate
})

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

const handleUpgrade = (type) => {

  if (type === "monthly") {
    alert("Redirect to Razorpay Monthly 💳")
  }

  if (type === "yearly") {
    alert("Redirect to Razorpay Yearly 💳")
  }

  // later:
  // call payment API
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
  setEmpSearch("")
  setReqSearch("")
  setReqStatus("")
  setTaskSearch("")
  setTaskStatus("")
  setTaskDate("")
}, [active])

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
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

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
<div className="bg-white p-6 rounded-3xl w-96 shadow-2xl border border-gray-100">
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

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

                <td className="p-4 font-medium">{hr.name}</td>

                <td className="p-4">{hr.email}</td>

                <td className="p-4">
                  {hr.department?.name || "—"}
                </td>
                <td className="p-4">
                  {new Date(hr.createdAt).toLocaleDateString("en-IN")}
                </td>

                <td className="p-4 text-center">
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
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Employees</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>

      <div className="flex gap-3 mb-4">
  <input
    type="text"
    placeholder="Search employee..."
   value={empSearch}
onChange={(e) => setEmpSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <button
    onClick={() => setEmpSearch("")}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
  >
    Reset
  </button>

</div>
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
      {filteredEmployees.map((emp) => (
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
  {filteredEmployees.length === 0 && (
  <p className="text-center text-gray-500 mt-4">
    No employees found 😕
  </p>
)}
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
    <>
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Requirement Board</h1>
      </div>
    <div className="flex gap-3 mb-4">
  <input
    type="text"
    placeholder="Search requirement..."
    value={reqSearch}
onChange={(e) => setReqSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <select
    value={reqStatus}
onChange={(e) => setReqStatus(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>

  <button
    onClick={() => {
      setReqSearch("")
      setReqStatus("")
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
  >
    Reset
  </button>
</div>
      {/* 🔥 Table */}
      <div className="bg-white rounded-2xl shadow p-6">

        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-2">Title</th>
              <th className="p-2">Raised By</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequirements.map((req) => (
              <tr
                key={req._id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="p-2 font-medium">{req.title}</td>

                <td className="p-2">
                  {req.raisedBy?.name || "—"}
                </td>

                <td className={`p-2 font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}>
                  {req.status}
                </td>

                <td className="p-2">
                  <div className="flex justify-center gap-2">

                    {/* ✅ APPROVE */}
                    <button
                      onClick={() => handleStatusUpdate(req._id, "approved")}
                      className={`px-3 py-1 rounded transition ${
                        req.status === "approved"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 hover:bg-green-100"
                      }`}
                    >
                      Approve
                    </button>

                    {/* ❌ REJECT */}
                    <button
                      onClick={() => handleStatusUpdate(req._id, "rejected")}
                      className={`px-3 py-1 rounded transition ${
                        req.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 hover:bg-red-100"
                      }`}
                    >
                      Reject
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequirements.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No requirements available
          </div>
        )}

      </div>
    </>
  )
}

 if (active === "tasks") {
  return (
    <div className="space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks Overview</h1>
      </div>
      <div className="flex gap-3 mb-4">
  <input
    type="text"
    placeholder="Search task..."
   value={taskSearch}
onChange={(e) => setTaskSearch(e.target.value)}
    className="border p-2 rounded-lg"
  />

  <select
    value={taskStatus}
onChange={(e) => setTaskStatus(e.target.value)}
    className="border p-2 rounded-lg"
  >
    <option value="">All Status</option>
    <option value="pending">Pending</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <input
    type="date"
    value={taskDate}
onChange={(e) => setTaskDate(e.target.value)}
    className="border p-2 rounded-lg"
  />
  <button
    onClick={() => {
      setTaskSearch("")
      setTaskStatus("")
      setTaskDate("")
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
  >
    Reset
  </button>
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
            {filteredTasks.map((task) => (
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
        {filteredTasks.length === 0 && (
  <p className="text-center text-gray-500 mt-4">
    No employees found 😕
  </p>
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
      <div className="w-64 bg-linear-to-b from-gray-900 to-gray-800 text-white p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-6">Admin</h2>

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
<div className="flex-1 p-8 bg-gray-50 min-h-screen">

  {/* TOP BAR (ONLY THIS) */}
  <div className="flex justify-end items-center gap-4 mb-4">

    {/* Upgrade Button */}
    {showPlanModal && (
  <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

    <div className="bg-gray-900 text-white p-8 rounded-2xl w-225">

      <h2 className="text-3xl font-bold text-center mb-8">
        Upgrade Your Plan 🚀
      </h2>

      <div className="grid grid-cols-3 gap-6">

        {/* FREE */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-bold mb-2">Free</h3>
          <p className="text-3xl font-bold mb-4">₹0</p>

          <ul className="text-sm space-y-2 text-gray-300">
            <li>✔ Limited access</li>
            <li>✔ Basic dashboard</li>
            <li>✔ Limited notifications</li>
          </ul>

          <button
            disabled
            className="mt-5 w-full bg-gray-600 py-2 rounded-lg"
          >
            Current Plan
          </button>
        </div>

        {/* MONTHLY */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-xl font-bold mb-2">Monthly</h3>
          <p className="text-3xl font-bold mb-4">₹399</p>

          <ul className="text-sm space-y-2 text-gray-300">
            <li>✔ Unlimited employees</li>
            <li>✔ Advanced dashboard</li>
            <li>✔ Priority notifications</li>
            <li>✔ Task analytics</li>
          </ul>

          <button
            onClick={() => handleUpgrade("monthly")}
            className="mt-5 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700"
          >
            Choose Plan
          </button>
        </div>

        {/* YEARLY (HIGHLIGHTED) */}
        <div className="bg-linear-to-br from-purple-700 to-indigo-700 p-6 rounded-2xl border border-purple-500 scale-105">

          <p className="text-xs bg-purple-500 px-2 py-1 rounded w-fit mb-2">
            BEST VALUE
          </p>

          <h3 className="text-xl font-bold mb-2">Yearly</h3>
          <p className="text-3xl font-bold mb-4">₹3999</p>

          <ul className="text-sm space-y-2">
            <li>✔ Everything in Monthly</li>
            <li>✔ Faster performance</li>
            <li>✔ Premium support</li>
            <li>✔ Future features access</li>
          </ul>

          <button
            onClick={() => handleUpgrade("yearly")}
            className="mt-5 w-full bg-white text-black py-2 rounded-lg font-semibold"
          >
            Choose Plan
          </button>
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setShowPlanModal(false)}
          className="bg-gray-600 px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
    <button
      onClick={() => setShowPlanModal(true)}
      className={`px-4 py-2 rounded-lg text-white ${
        plan === "free" ? "bg-red-500" : "bg-green-600"
      }`}
    >
      {plan === "free" ? "Upgrade Plan 🚀" : "Pro Plan ✅"}
    </button>

    {/* Bell Icon */}
    <div
      className="relative cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >
      <span className="text-2xl">🔔</span>

      {/* badge */}
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

                if (n.type === "task_assigned") setActive("tasks");
                if (n.type.includes("requirement")) setActive("requirements");
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

  {/* MAIN CONTENT */}
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
      className="block w-full text-left px-3 py-2 rounded-xl hover:bg-gray-700 transition"
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
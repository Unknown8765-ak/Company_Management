import { useEffect, useState } from "react"

import { getDepartmentsAPI ,deleteDepartmentAPI ,createDepartmentAPI} from "../features/departments/departmentAPI.js"
import { getAllEmployeesAPI ,getAllHRAPI ,createEmployeeAPI,createHRAPI,deleteEmployeeAPI} from "../features/users/usersAPI.js"
import { getAllRequirementsAPI ,updateRequirementStatusAPI} from "../features/requirements/requirementsAPI.js"
import { getAllTasksAPI ,deleteTaskAPI} from "../features/tasks/tasksAPI.js"


export default function SuperAdminPanel() {

  const [active, setActive] = useState("dashboard")

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

    await updateRequirementStatusAPI({
      requirementId: id,
      status: status
    })

    // UI update
    setRequirements(prev =>
      prev.map(req =>
        req._id === id ? { ...req, status } : req
      )
    )

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

  const handleDeleteEmp = async (id) => {
    await deleteEmployeeAPI(id)
    setEmployees(prev => prev.filter(emp => emp._id !== id))
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

        {/* 🔥 EMPTY STATE */}
        {departments.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No departments available
          </div>
        )}

      </div>

      {/* 🔥 MODAL */}
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

      {/* 🔥 HEADER */}
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

        {/* 🔥 EMPTY STATE */}
        {hrs.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No HRs available
          </div>
        )}

      </div>

      {/* 🔥 MODAL */}
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

                {/* 🔥 STATUS COLOR */}
                <td className={`p-3 font-semibold ${
                  req.status === "approved"
                    ? "text-green-600"
                    : req.status === "rejected"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}>
                  {req.status}
                </td>

                {/* 🔥 ACTION BUTTONS */}
                <td className="p-3 flex justify-center gap-2">

                  {/* APPROVE */}
                  <button
                    onClick={() => handleStatusUpdate(req._id, "approved")}
                    disabled={req.status !== "pending"}
                    className={`px-3 py-1 rounded-lg text-white transition
                      ${
                        req.status === "approved"
                          ? "bg-green-600"
                          : req.status === "rejected"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                  >
                    Approve
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => handleStatusUpdate(req._id, "rejected")}
                    disabled={req.status !== "pending"}
                    className={`px-3 py-1 rounded-lg text-white transition
                      ${
                        req.status === "rejected"
                          ? "bg-red-600"
                          : req.status === "approved"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                  >
                    Reject
                  </button>

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
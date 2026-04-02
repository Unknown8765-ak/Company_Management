import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

import { getSingleEmployeeAPI } from "../features/users/usersAPI.js"
import { getEmployeeTasksAPI } from "../features/tasks/tasksAPI.js"

import {
  getMyRequirementsAPI,
  createRequirementAPI
} from "../features/requirements/requirementsAPI.js"

export default function EmployeePanel() {

  const { user } = useSelector((state) => state.auth)

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
      setRequirements(res.data)
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
  // --------------------------
  // Dashboard Stats
  // --------------------------
  const completed = tasks.filter(t => t.status === "completed").length

  const pending = tasks.filter(t => t.status !== "completed").length

  // --------------------------
  // UI Renderer
  // --------------------------

  const renderContent = () => {

    if (loading) return <p>Loading...</p>

    // ---------------- Dashboard
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

    // ---------------- Tasks

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
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} className="border-b">
                    <td className="p-2">{task.title}</td>
                    <td className="p-2">{task.deadline}</td>
                    <td className="p-2">{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              value={employee?.dob}
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
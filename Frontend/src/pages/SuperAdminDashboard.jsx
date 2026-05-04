import { useEffect, useState } from "react";
import {
  getCompanies,
  createCompany,
  deleteCompany,
  updateCompany
} from "../features/company/companyAPI";

export default function SuperAdminDashboard() {

  const [active, setActive] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    plan: "free",
    adminName: "",
    adminEmail: "",
    adminPassword: ""
  });

  // 🔥 FETCH
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await getCompanies();
      setCompanies(res.data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateCompany(editId, form);
        alert("Updated ✅");
      } else {
        await createCompany(form);
        alert("Created ✅");
      }

      setShowModal(false);
      setEditId(null);
      fetchCompanies();

    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await deleteCompany(id);
    fetchCompanies();
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setShowModal(true);
    setForm({
      name: c.name,
      email: c.email,
      plan: c.plan,
      adminName: "",
      adminEmail: "",
      adminPassword: ""
    });
  };

  // 🔥 CONTENT
  const renderContent = () => {

    // DASHBOARD
    if (active === "dashboard") {
      return (
        <div className="grid grid-cols-3 gap-6">
          <StatCard title="Total Companies" value={companies.length} />
          <StatCard title="Active" value={companies.filter(c => c.isActive).length} />
          <StatCard title="Inactive" value={companies.filter(c => !c.isActive).length} />
        </div>
      );
    }

    // COMPANIES
    if (active === "companies") {
      return (
        <div className="max-w-6xl mx-auto">

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Companies</h1>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                + Create
              </button>
            </div>

            {/* TABLE */}
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden">

                <thead className="bg-gray-100">
                  <tr className="text-gray-700 text-sm">
                    <th className="p-3 border-b text-left">Name</th>
                    <th className="p-3 border-b text-left">Email</th>
                    <th className="p-3 border-b text-left">Plan</th>
                    <th className="p-3 border-b text-left">Status</th>
                    <th className="p-3 border-b text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {companies.map((c, index) => (
                    <tr
                      key={c._id}
                      className={`text-sm ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >

                      <td className="p-3 border-b font-medium">
                        {c.name}
                      </td>

                      <td className="p-3 border-b">
                        {c.email}
                      </td>

                      <td className="p-3 border-b capitalize">
                        {c.plan}
                      </td>

                      <td className="p-3 border-b">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            c.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-3 border-b space-x-2">

                        <button
                          onClick={() => handleEdit(c)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-linear-to-b from-gray-900 to-gray-800 text-white p-6 shadow-xl">

        <h2 className="text-2xl font-bold mb-8">🚀 Super Admin</h2>

        <SidebarItem label="Dashboard" id="dashboard" setActive={setActive} />
        <SidebarItem label="Companies" id="companies" setActive={setActive} />

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10">
        {renderContent()}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h2 className="text-lg font-bold mb-4">
              {editId ? "Edit Company" : "Create Company"}
            </h2>

            <input name="name" placeholder="Name"
              className="w-full border p-2 mb-2 rounded"
              value={form.name} onChange={handleChange} />

            <input name="email" placeholder="Email"
              className="w-full border p-2 mb-2 rounded"
              value={form.email} onChange={handleChange} />

            <select name="plan"
              className="w-full border p-2 mb-2 rounded"
              value={form.plan} onChange={handleChange}>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>

            {!editId && (
              <>
                <input name="adminName" placeholder="Admin Name"
                  className="w-full border p-2 mb-2 rounded"
                  value={form.adminName} onChange={handleChange} />

                <input name="adminEmail" placeholder="Admin Email"
                  className="w-full border p-2 mb-2 rounded"
                  value={form.adminEmail} onChange={handleChange} />

                <input name="adminPassword" type="password" placeholder="Password"
                  className="w-full border p-2 mb-2 rounded"
                  value={form.adminPassword} onChange={handleChange} />
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// 🔥 COMPONENTS

function SidebarItem({ label, id, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className="block w-full text-left px-4 py-2 mb-2 rounded-lg hover:bg-gray-700 transition"
    >
      {label}
    </button>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}
const API_BASE_URL = "https://company-management-5yta.onrender.com"

// ----------------------------
// Apply Leave
// ----------------------------
const createLeaveAPI = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/leaves/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to apply leave")
    }

    return await res.json()
  } catch (err) {
    console.error("Create Leave Error:", err)
    throw err
  }
}


// ----------------------------
// Get My Leaves (Employee)
// ----------------------------
const getMyLeavesAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/leaves/my`, {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to fetch leaves")
    }

    return await res.json()
  } catch (err) {
    console.error("Get My Leaves Error:", err)
    throw err
  }
}


// ----------------------------
// Get All Leaves (Admin/HR)
// ----------------------------
const getAllLeavesAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/leaves/all`, {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to fetch all leaves")
    }

    return await res.json()
  } catch (err) {
    console.error("Get All Leaves Error:", err)
    throw err
  }
}


// ----------------------------
// Update Leave Status
// ----------------------------
const updateLeaveStatusAPI = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/leaves/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ status })
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to update leave")
    }

    return await res.json()
  } catch (err) {
    console.error("Update Leave Error:", err)
    throw err
  }
}


export {
  createLeaveAPI,
  getMyLeavesAPI,
  getAllLeavesAPI,
  updateLeaveStatusAPI,
}
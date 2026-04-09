const API_BASE_URL = "https://company-management-5yta.onrender.com"


// ----------------------------
// Create Department
// ----------------------------
export const createDepartmentAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/departments/create-department`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create department")
    }

    return await response.json()

  } catch (err) {
    console.error("Create Department API Error:", err)
    throw err
  }
}


// ----------------------------
// Get All Departments
// ----------------------------
export const getDepartmentsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/departments/departments`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch departments")
    }

    return await response.json()

  } catch (err) {
    console.error("Get Departments API Error:", err)
    throw err
  }
}


// ----------------------------
// Update Department
// ----------------------------
export const updateDepartmentAPI = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/departments/department/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update department")
    }

    return await response.json()

  } catch (err) {
    console.error("Update Department API Error:", err)
    throw err
  }
}


// ----------------------------
// Delete Department
// ----------------------------
export const deleteDepartmentAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/departments/delete-department/${id}`, {
      method: "DELETE",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete department")
    }

    return await response.json()

  } catch (err) {
    console.error("Delete Department API Error:", err)
    throw err
  }
}


// ----------------------------
// Add Member to Department
// ----------------------------
export const addMemberToDepartmentAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/departments/department/add-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to add member")
    }

    return await response.json()

  } catch (err) {
    console.error("Add Member API Error:", err)
    throw err
  }
}


// ----------------------------
// Get Department Analytics
// ----------------------------
export const getDepartmentAnalyticsAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}api/v1/departments/department/analytics`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch analytics")
    }

    return await response.json()

  } catch (err) {
    console.error("Department Analytics API Error:", err)
    throw err
  }
}

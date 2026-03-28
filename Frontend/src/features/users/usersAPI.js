// src/features/users/userAPI.js

const API_BASE_URL = "http://localhost:8000/api/v1/users"


// ----------------------------
// Create HR
// ----------------------------
const createHRAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-hr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create HR")
    }

    return await response.json()

  } catch (err) {
    console.error("Create HR API Error:", err)
    throw err
  }
}


// ----------------------------
// Create Employee
// ----------------------------
const createEmployeeAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create employee")
    }

    return await response.json()

  } catch (err) {
    console.error("Create Employee API Error:", err)
    throw err
  }
}


// ----------------------------
// Get All Employees
// ----------------------------
const getAllEmployeesAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch employees")
    }

    return await response.json()

  } catch (err) {
    console.error("Get Employees API Error:", err)
    throw err
  }
}
const getAllHRAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hrs`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch employees")
    }

    return await response.json()

  } catch (err) {
    console.error("Get Employees API Error:", err)
    throw err
  }
}


// ----------------------------
// Get Single Employee
// ----------------------------
const getSingleEmployeeAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch employee")
    }

    return await response.json()

  } catch (err) {
    console.error("Get Employee API Error:", err)
    throw err
  }
}


// ----------------------------
// Update Employee
// ----------------------------
const updateEmployeeAPI = async (id, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update employee")
    }

    return await response.json()

  } catch (err) {
    console.error("Update Employee API Error:", err)
    throw err
  }
}


// ----------------------------
// Delete Employee
// ----------------------------
const deleteEmployeeAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete-employee/${id}`, {
      method: "DELETE",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete employee")
    }

    return await response.json()

  } catch (err) {
    console.error("Delete Employee API Error:", err)
    throw err
  }
}


export {
    createHRAPI,
    createEmployeeAPI,
    deleteEmployeeAPI,
    updateEmployeeAPI,
    getAllEmployeesAPI,
    getSingleEmployeeAPI,
    getAllHRAPI
}
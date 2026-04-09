// src/features/requirements/requirementAPI.js

const API_BASE_URL = "https://company-management-5yta.onrender.com"


// ----------------------------
// Create Requirement
// ----------------------------
export const createRequirementAPI = async (data) => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/v1/requirements/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create requirement")
    }

    return await response.json()

  } catch (err) {
    console.error("Create Requirement API Error:", err)
    throw err
  }
}


// ----------------------------
// Get All Requirements (HR / Admin)
// ----------------------------
export const getAllRequirementsAPI = async () => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/v1/requirements`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch requirements")
    }

    return await response.json()

  } catch (err) {
    console.error("Get Requirements API Error:", err)
    throw err
  }
}


// ----------------------------
// Get Logged Employee Requirements
// ----------------------------
export const getMyRequirementsAPI = async () => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/v1/requirements/my-requirements`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch my requirements")
    }

    return await response.json()

  } catch (err) {
    console.error("My Requirements API Error:", err)
    throw err
  }
}


// ----------------------------
// Update Requirement Status
// ----------------------------
export const updateRequirementStatusAPI = async (data) => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/v1/requirements/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update requirement status")
    }

    return await response.json()

  } catch (err) {
    console.error("Update Requirement API Error:", err)
    throw err
  }
}


// ----------------------------
// Delete Requirement
// ----------------------------
export const deleteRequirementAPI = async (id) => {
  try {

    const response = await fetch(`${API_BASE_URL}/api/v1/requirements/${id}`, {
      method: "DELETE",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete requirement")
    }

    return await response.json()

  } catch (err) {
    console.error("Delete Requirement API Error:", err)
    throw err
  }
}

export const sendToAdminAPI = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/requirements/send-to-admin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ id })
  })

  return await response.json()
}

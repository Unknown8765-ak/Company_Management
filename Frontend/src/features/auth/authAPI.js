// src/features/auth/authAPI.js

const API_BASE_URL = "http://localhost:8000/api/v1/auth" // backend ka base URL


const loginUserAPI = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const result =  await response.json()
    return result

  } catch (err) {
    console.error("Login API Error:", err)
    throw err
  }
}

const logoutUserAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Logout failed")
    }

   const result =  await response.json()
    return result
  } catch (err) {
    console.error("Logout API Error:", err)
    throw err
  }
}


const getCurrentUserAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch current user")
    }

    const result =  await response.json()
    return result
  } catch (err) {
    console.error("GetCurrentUser API Error:", err)
    throw err
  }
}


export {
  loginUserAPI,
  logoutUserAPI,
  getCurrentUserAPI
}
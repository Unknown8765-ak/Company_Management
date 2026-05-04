const API_BASE_URL = "https://company-management-5yta.onrender.com"


const generateSalaryAPI = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/salary/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to generate salary")
    }

    return await res.json()
  } catch (err) {
    console.error("Generate Salary Error:", err)
    throw err
  }
}

const getMySalaryAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/salary/my`, {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to fetch salary")
    }

    return await res.json()
  } catch (err) {
    console.error("Get My Salary Error:", err)
    throw err
  }
}

const getAllSalaryAPI = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/salary/all`, {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to fetch salaries")
    }

    return await res.json()
  } catch (err) {
    console.error("Get All Salary Error:", err)
    throw err
  }
}


const markSalaryPaidAPI = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/salary/pay/${id}`, {
      method: "PATCH",
      credentials: "include"
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || "Failed to mark as paid")
    }

    return await res.json()
  } catch (err) {
    console.error("Mark Paid Error:", err)
    throw err
  }
}

export {
  generateSalaryAPI,
  getMySalaryAPI,
  getAllSalaryAPI,
  markSalaryPaidAPI
}
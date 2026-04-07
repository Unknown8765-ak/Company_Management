// src/features/tasks/taskAPI.js

const API_BASE_URL = "http://localhost:8000/api/v1/tasks"


// ----------------------------
// Create Task
// ----------------------------
const createTaskAPI = async (data, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-task/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create task")
    }

    return await response.json()

  } catch (err) {
    console.error("Create Task API Error:", err)
    throw err
  }
}


// ----------------------------
// Assign Task
// ----------------------------
const assignTaskAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to assign task")
    }

    return await response.json()

  } catch (err) {
    console.error("Assign Task API Error:", err)
    throw err
  }
}


// ----------------------------
// Get All Tasks
// ----------------------------
const getAllTasksAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch tasks")
    }

    return await response.json()

  } catch (err) {
    console.error("Get Tasks API Error:", err)
    throw err
  }
}


// ----------------------------
// Get Logged Employee Tasks
// ----------------------------
const getEmployeeTasksAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/my-tasks`, {
      method: "GET",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch employee tasks")
    }

    return await response.json()

  } catch (err) {
    console.error("Employee Tasks API Error:", err)
    throw err
  }
}


// ----------------------------
// Update Task Status
// ----------------------------
const updateTaskStatusAPI = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update task status")
    }

    return await response.json()

  } catch (err) {
    console.error("Update Task Status API Error:", err)
    throw err
  }
}



const addTaskUpdateAPI = async (id,data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/task/update/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to add task update")
    }

    return await response.json()

  } catch (err) {
    console.error("Task Update API Error:", err)
    throw err
  }
}



// ----------------------------
// Delete Task
// ----------------------------
const deleteTaskAPI = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/task/delete/${id}`, {
      method: "DELETE",
      credentials: "include"
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete task")
    }

    return await response.json()

  } catch (err) {
    console.error("Delete Task API Error:", err)
    throw err
  }
}

export const addCommentAPI = async (taskId, message) => {
  try {
    const res = await fetch(`${API_BASE_URL}/task/${taskId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to add comment");
    }

    return data;

  } catch (error) {
    console.error("Add Comment API Error:", error.message);
    throw error; // taaki UI me handle kar sake
  }
};


export {
    createTaskAPI,
    deleteTaskAPI,
    addTaskUpdateAPI,
    updateTaskStatusAPI,
    getEmployeeTasksAPI,
    getAllTasksAPI,
    assignTaskAPI
}
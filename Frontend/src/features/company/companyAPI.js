

const API_BASE_URL = "https://company-management-5yta.onrender.com"

// 🔥 CREATE COMPANY
const createCompany = async (data) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/company/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw result;

    return result;

  } catch (error) {
    console.error("Create Company Error:", error);
    throw error?.message ? error : { message: "Failed to create company" };
  }
};


// 🔥 GET ALL COMPANIES
const getCompanies = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/company/`,{
       credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw result;

    return result;

  } catch (error) {
    console.error("Get Companies Error:", error);
    throw error?.message ? error : { message: "Failed to fetch companies" };
  }
};  


// 🔥 GET SINGLE COMPANY
 const getCompany = async (id) => {
  try {
    if (!id) throw { message: "Company ID is required" };

    const res = await fetch(`${API_BASE_URL}/api/v1/company/${id}`,{
       credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw result;

    return result;

  } catch (error) {
    console.error("Get Company Error:", error);
    throw error?.message ? error : { message: "Failed to fetch company" };
  }
};


// 🔥 UPDATE COMPANY
const updateCompany = async (id, data) => {
  try {
    if (!id) throw { message: "Company ID is required" };

    const res = await fetch(`${API_BASE_URL}/api/v1/company/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
       credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw result;

    return result;

  } catch (error) {
    console.error("Update Company Error:", error);
    throw error?.message ? error : { message: "Failed to update company" };
  }
};



// 🔥 DELETE COMPANY
const deleteCompany = async (id) => {
  try {
    if (!id) throw { message: "Company ID is required" };

    const res = await fetch(`${API_BASE_URL}/api/v1/company/${id}`, {
      method: "DELETE",
       credentials: "include"
    });

    const result = await res.json();

    if (!res.ok) throw result;

    return result;

  } catch (error) {
    console.error("Delete Company Error:", error);
    throw error?.message ? error : { message: "Failed to delete company" };
  }
};


const createContactRequestAPI = async (payload) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/company/demo-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "API Error");
    }

    return data; // ✅ MUST RETURN
  } catch (err) {
    throw err; // ✅ throw so handleSubmit catch kare
  }
};
export {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompany,
  updateCompany,
  createContactRequestAPI
}
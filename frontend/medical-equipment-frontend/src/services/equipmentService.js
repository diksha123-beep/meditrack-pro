import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000/api/equipment";

// Helper to get auth headers
function authHeaders() {
    const token = localStorage.getItem("meditrack_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get all equipment
export const getAllEquipment = async () => {
    const response = await axios.get(API_URL, { headers: authHeaders() });
    return response.data;
};

// Get equipment by ID
export const getEquipmentById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: authHeaders() });
    return response.data;
};

// Add new equipment
export const addEquipment = async (equipment) => {
    const response = await axios.post(API_URL, equipment, { headers: authHeaders() });
    return response.data;
};

// Update equipment
export const updateEquipment = async (id, equipment) => {
    const response = await axios.put(`${API_URL}/${id}`, equipment, { headers: authHeaders() });
    return response.data;
};

// Delete equipment
export const deleteEquipment = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });
    return response.data;
};
import apiClient from "../api/apiClient";


export const getUsers = () => apiClient.get("/users");
export const getUser = (id) => apiClient.get(`/users/${id}`);
export const createUser = (data) => apiClient.post("/users", data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

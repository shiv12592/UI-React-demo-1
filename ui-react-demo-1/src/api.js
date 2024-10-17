// api.js
import axios from 'axios';

export const apiCallToSearchDepartments = (searchTerm) => {
    return axios.get(`http://localhost:5000/departments?search=${searchTerm}`)
        .then(response => {
            console.log("Fetched Departments: ", response.data); // Add this
            return response.data;
        })
        .catch(error => {
            console.error("Error fetching departments:", error);
            throw error;
        });
};

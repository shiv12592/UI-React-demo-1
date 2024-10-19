// api.js
export const apiCallToSearchDepartments = (searchTerm) => {
    return fetch(`http://localhost:5005/departments?search=${searchTerm}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch departments');
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error in API call:", error);
            throw error;
        });
};

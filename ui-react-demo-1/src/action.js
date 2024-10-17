// action.js
import { apiCallToSearchDepartments } from './api';

export const SEARCH_DEPARTMENTS_REQUEST = "SEARCH_DEPARTMENTS_REQUEST";
export const SEARCH_DEPARTMENTS_SUCCESS = "SEARCH_DEPARTMENTS_SUCCESS";
export const SEARCH_DEPARTMENTS_FAILURE = "SEARCH_DEPARTMENTS_FAILURE";

export const searchDepartments = (searchTerm) => {
    return (dispatch) => {
        dispatch({ type: SEARCH_DEPARTMENTS_REQUEST });
        return apiCallToSearchDepartments(searchTerm)
            .then(response => {
                console.log("Action - API Response:", response);  // Log API response
                dispatch({
                    type: SEARCH_DEPARTMENTS_SUCCESS,
                    payload: response,  // Ensure the correct data is dispatched
                });
            })
            .catch(error => {
                dispatch({
                    type: SEARCH_DEPARTMENTS_FAILURE,
                    payload: error,
                });
            });
    };
};

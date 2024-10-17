// departmentReducer.js
import {
    SEARCH_DEPARTMENTS_REQUEST,
    SEARCH_DEPARTMENTS_SUCCESS,
    SEARCH_DEPARTMENTS_FAILURE,
} from './action';

const initialState = {
    data: [],  // Initialize data as an empty array
    loading: false,
    error: null,
};

const departmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_DEPARTMENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case SEARCH_DEPARTMENTS_SUCCESS:
            console.log("Reducer - SEARCH_DEPARTMENTS_SUCCESS payload:", action.payload);  // Add this log
            return {
                ...state,
                loading: false,
                data: action.payload, // Make sure action.payload is correctly holding the data
            };
        case SEARCH_DEPARTMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default departmentReducer;

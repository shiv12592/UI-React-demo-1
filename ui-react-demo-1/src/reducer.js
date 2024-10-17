//reducer.js
import {
    SEARCH_DEPARTMENTS_REQUEST,
    SEARCH_DEPARTMENTS_SUCCESS,
    SEARCH_DEPARTMENTS_FAILURE,
} from "./action";

const initialState = {
    loading: false,
    data: [],
    error: "",
};

const departmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_DEPARTMENTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case SEARCH_DEPARTMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
                error: "",
            };
        case SEARCH_DEPARTMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                data: [],
                error: action.payload,
            };
        default:
            return state;
    }
};

export default departmentReducer;

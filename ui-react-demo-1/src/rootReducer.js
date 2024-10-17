// rootReducer.js
import { combineReducers } from 'redux';
import departmentReducer from './departmentReducer'; // Adjust this import based on your file structure

const rootReducer = combineReducers({
    departments: departmentReducer, // Key should match how you access it in selectors
    // Add other reducers here if needed
});

export default rootReducer;

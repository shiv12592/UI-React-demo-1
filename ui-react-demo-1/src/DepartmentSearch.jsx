import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { searchDepartments } from "./action";
import { getSearchedDepartments } from "./selectors";

const DepartmentSearch = ({ handleDepartmentSuggestionClick, selectedDepartments, onRemoveDepartment }) => {
    const dispatch = useDispatch();
    const departmentList = useSelector(getSearchedDepartments);
    const [inputDepartmentText, setInputDepartmentText] = useState("");
    const [isDepartmentLoading, setIsDepartmentLoading] = useState(false);
    const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);

    const debounceInputChange = useCallback(
        debounce((value) => {
            if (value.trim()) {
                setIsDepartmentLoading(true);
                dispatch(searchDepartments(value)).then(() => {
                    setIsDepartmentLoading(false);
                    setShowDepartmentSuggestions(true);
                });
            } else {
                setShowDepartmentSuggestions(false);
            }
        }, 300),
        [dispatch]
    );

    const handleDepartmentInputChange = (e) => {
        const inputValue = e.target.value;
        setInputDepartmentText(inputValue);
        debounceInputChange(inputValue);
    };

    const handleDepartmentClick = (department) => {
        // Call the parent's function to handle department suggestion click with the department name
        handleDepartmentSuggestionClick(department.name); // Pass only the department name

        // Clear the input and hide the suggestions
        setInputDepartmentText(""); // Clear the input field
        setShowDepartmentSuggestions(false);
    };

    const handleRemoveDepartment = (department) => {
        // Call the parent's function to remove the department from selectedDepartments
        onRemoveDepartment(department);
    };

    return (
        <div>
            <input
                type="text"
                value={inputDepartmentText}
                onChange={handleDepartmentInputChange}
                placeholder="Search by Department"
                style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}
            />
            {showDepartmentSuggestions && departmentList.data && (
                <div className="suggestions">
                    {departmentList.data.length > 0 ? (
                        departmentList.data.map((department) => (
                            <div
                                key={department.id}
                                onClick={() => handleDepartmentClick(department)} // Update the click handler
                                style={{ cursor: "pointer", padding: "5px", borderBottom: "1px solid #ccc" }} // Optional styles
                            >
                                {department.name}
                            </div>
                        ))
                    ) : (
                        <div>No results found</div>
                    )}
                </div>
            )}
            {isDepartmentLoading && <div>Loading...</div>}

            {/* Display selected departments */}
            {selectedDepartments.length > 0 && (
                <div className="selected-departments" style={{ display: "flex", flexWrap: "wrap", marginTop: "5px" }}>
                    {selectedDepartments.map((departmentName, index) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", padding: "5px", border: "1px solid #ccc", borderRadius: "5px", marginRight: "5px", marginBottom: "5px" }}>
                            <span style={{ marginRight: "10px" }}>{departmentName}</span>
                            <button
                                onClick={() => handleRemoveDepartment(departmentName)}
                                style={{ backgroundColor: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DepartmentSearch;

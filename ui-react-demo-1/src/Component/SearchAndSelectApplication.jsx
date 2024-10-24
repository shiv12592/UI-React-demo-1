import React, { useState } from "react";
import PropTypes from "prop-types";

const SearchAndSelectApplication = ({ handleApplicationSuggestionClick, selectedApplications }) => {
    // Default data for application search suggestions
    const defaultData = [
        { DN: "Value1", authNamespace: "Namespace1", name: "app1" },
        { DN: "Value2", authNamespace: "Namespace2", name: "app2" },
        { DN: "Value3", authNamespace: "Namespace3", name: "app3" },
        { DN: "Value4", authNamespace: "Namespace4", name: "app4" },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(defaultData);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter the default data based on the search term
        const filtered = defaultData.filter((item) =>
            item.DN.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Handle suggestion click
    const handleSuggestionClick = (app) => {
        handleApplicationSuggestionClick(app);
        setSearchTerm(""); // Clear search input after selection
    };

    return (
        <div style={{ position: "relative" }}>
            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for an application..."
                className="form-control"
            />

            {/* Display suggestions if there is a search term */}
            {searchTerm && (
                <div
                    style={{
                        listStyleType: "none",
                        padding: "0",
                        margin: "0",
                        maxHeight: "150px",
                        overflowY: "auto",
                        position: "absolute",
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        zIndex: 1000,
                    }}
                >
                    {filteredData.map((app, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick({ location: app.authNamespace, value: app.DN, name: app.name })}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            {app.DN} ({app.authNamespace})
                        </div>
                    ))}
                </div>
            )}

            {/* Display selected applications */}
            <div style={{ marginTop: "10px" }}>
                {selectedApplications.map((app, index) => (
                    <div key={index} className="selected-value">
                        {app.value} ({app.location}){" "}
                        <button
                            onClick={() => handleApplicationSuggestionClick(app)}
                            className="btn btn-link"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

SearchAndSelectApplication.propTypes = {
    handleApplicationSuggestionClick: PropTypes.func.isRequired,
    selectedApplications: PropTypes.array.isRequired,
};

export default SearchAndSelectApplication;

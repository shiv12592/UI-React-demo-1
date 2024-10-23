import React, { useState } from "react";

const ValueSearch = ({ handleValueSuggestionClick, selectedEntlmArray }) => {
    // Default data for search suggestions
    const defaultData = [
        { entlmDN: "Value1", authNamespace: "Namespace1" },
        { entlmDN: "Value2", authNamespace: "Namespace2" },
        { entlmDN: "Value3", authNamespace: "Namespace3" },
        { entlmDN: "Value4", authNamespace: "Namespace4" },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(defaultData);

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Filter the default data based on the search term
        const filtered = defaultData.filter((item) =>
            item.entlmDN.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Handle suggestion click
    const handleSuggestionClick = (entlm) => {
        handleValueSuggestionClick(entlm);
        setSearchTerm(""); // Clear search input after selection
    };

    return (
        <div style={{ position: "relative" }}>
            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for a value..."
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
                    {filteredData.map((entlm, index) => (
                        <div
                            key={index}
                            onClick={() => handleSuggestionClick(entlm)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            {entlm.entlmDN} ({entlm.authNamespace})
                        </div>
                    ))}
                    {filteredData.length === 0 && (
                        <div style={{ padding: "8px", color: "#999" }}>
                            No matching values found.
                        </div>
                    )}
                </div>
            )}

            {/* Display selected values */}
            {selectedEntlmArray.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    <div>
                        {selectedEntlmArray.map((entlm, index) => (
                            <div key={index}>
                                {entlm.value} ({entlm.location})
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValueSearch;

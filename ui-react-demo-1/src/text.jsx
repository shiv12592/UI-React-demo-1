const renderConditionRow = ( condition,   index, i,  isGrouped = false,  level = 0 ) => {
    // Allow editing up to two levels deep
    const isDisabled = () => {
        return level > 2;
    };
    const isConditionDisabled = () => {
        return level > 1;
    }

    return condition.rows && condition.selectOperation ? (
        <table style={{  border: "1px solid red", margin: "10px", width: "100%"}}>
            <tbody>
            <tr style={{ border: "1px solid black" }}>
                {!isGrouped && (
                    <td>
                        <input
                            type="checkbox"
                            checked={isGrouped ? condition.checked : selectedRows.includes(index)}
                            onChange={() =>
                                isGrouped
                                    ? handleChangeInner(index, i, "checked", !condition.checked)
                                    : handleSelectRow(index)
                            }
                        />
                    </td>
                )}
                <td style={{ width: '10%' }}>
                    <select
                        value={condition.selectOperation}
                        onChange={(e) =>
                            isGrouped
                                ? handleChangeInner(index, i, "selectOperation", e.target.value)
                                : handleChange(index, "selectOperation", e.target.value)
                        }
                        disabled={isConditionDisabled()}
                    >
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                    </select>
                </td>
                <td style={{ width: '90%' }}>
                    {condition.rows.map((row, i) => (
                        <div key={i}>
                            {renderConditionRow(row, index, i, true, level + 1)} {/* Increment level */}
                        </div>
                    ))}
                </td>
            </tr>
            </tbody>
        </table>
    ) : (
        <div style={{ border: "1px solid black", margin: "10px", padding: "10px" }} >
            {!isGrouped && (
                <input
                    type="checkbox"
                    checked={isGrouped ? condition.checked : selectedRows.includes(index)}
                    onChange={() =>
                        isGrouped
                            ? handleChangeInner(index, i, "checked", !condition.checked)
                            : handleSelectRow(index)
                    }
                />
            )}
            <select
                value={condition.source}
                onChange={(e) =>
                    isGrouped
                        ? handleChangeInner(index, i, "source", e.target.value)
                        : handleChange(index, "source", e.target.value)
                }
                disabled={isDisabled()}
            >
                <option value="">Select Source</option>
                <option value="Request">Request</option>
                <option value="Identity">Identity</option>
                {/*<option value="Location">Location</option>*/}
            </select>
            {condition.source === "Request" && (
                <div>
                    <select
                        value={condition.requestAttribute}
                        onChange={(e) =>
                            isGrouped
                                ? handleChangeInner(index, i, "requestAttribute", e.target.value)
                                : handleChange(index, "requestAttribute", e.target.value)
                        }
                        disabled={isDisabled()}
                    >
                        <option value="">Select Request Attribute</option>
                        <option value="accountOperation">accountOperation</option>
                        <option value="band">band</option>
                    </select>
                    {condition.requestAttribute === "accountOperation" ? (
                        <div>
                            <select
                                value={condition.requestValue}
                                onChange={(e) => handleRequestValueChange(index, e.target.value)}
                                disabled={isDisabled()}
                            >
                                <option value="">Select</option>
                                <option value="add">add</option>
                                <option value="remove">remove</option>
                                <option value="reject">reject</option>
                                <option value="cancel">cancel</option>
                                <option value="update">update</option>
                            </select>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={condition.requestValue}
                            onChange={(e) =>
                                isGrouped
                                    ? handleChangeInner(index, i, "requestValue", e.target.value)
                                    : handleChange(index, "requestValue", e.target.value)
                            }
                            disabled={isDisabled()}
                        />
                    )}
                </div>
            )}

            {condition.source === "Identity" && (
                <div>
                    <select
                        value={condition.identityAttribute}
                        onChange={(e) =>
                            isGrouped
                                ? handleChangeInner(index, i, "identityAttribute", e.target.value)
                                : handleChange(index, "identityAttribute", e.target.value)
                        }
                        disabled={isDisabled()}
                    >
                        <option value="">Select Identity Attribute</option>
                        <option value="nationality">nationality</option>
                        <option value="department">department</option>
                    </select>
                    {
                        (condition.identityAttribute === 'department') ?
                            <DepartmentSearch
                                handleDepartmentSuggestionClick={(department) => handleDepartmentSuggestionClick(department, index, i)} // Pass the inner index
                                selectedDepartments={condition.identityValue || []}
                                onRemoveDepartment={(department) => handleRemoveDepartment(department, index, i)} // Pass the function
                            />
                            :
                            <input
                                type="text"
                                value={condition.identityValue}
                                onChange={(e) =>
                                    isGrouped
                                        ? handleChangeInner(index, i, "identityValue", e.target.value)
                                        : handleChange(index, "identityValue", e.target.value)
                                }
                                disabled={isDisabled()}
                            />

                    }

                </div>
            )}
        </div>
    );
};









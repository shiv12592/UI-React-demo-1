import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const ActionOnCondition = ({ action, onChange, ruleType }) => {
    // Handle input change for Allow/Deny action, updating the nested "message" field
    const handleInputChange = (key, value) => {
        const updatedAction = { [key]: { message: value } };
        onChange(updatedAction); // Update the object for Allow/Deny
    };

    // Handle input change for Auto Provision/Auto Revoke actions, updating rows in an array
    const handleArrayInputChange = (index, key, value) => {
        const updatedRows = [...action];
        updatedRows[index] = { ...updatedRows[index], [key]: value };
        onChange(updatedRows); // Update the array for Auto Provision/Auto Revoke
    };

    // Remove a row for Auto Provision/Auto Revoke actions
    const handleRemoveRow = (index) => {
        const updatedRows = action.filter((_, i) => i !== index);
        onChange(updatedRows); // Remove row from the array
    };

    // Render Allow fields (Condition Not Met)
    const renderAllowFields = () => (
        <Row style={{ marginBottom: "10px" }}>
            <Col md={5}>
                <label>Condition Not Met Message</label>
                <input
                    type="text"
                    className="form-control"
                    value={action.conditionNotMet?.message || ""}
                    onChange={(e) => handleInputChange("conditionNotMet", e.target.value)}
                />
            </Col>
        </Row>
    );

    // Render Deny fields (Condition Met)
    const renderDenyFields = () => (
        <Row style={{ marginBottom: "10px" }}>
            <Col md={5}>
                <label>Condition Met Message</label>
                <input
                    type="text"
                    className="form-control"
                    value={action.conditionMet?.message || ""}
                    onChange={(e) => handleInputChange("conditionMet", e.target.value)}
                />
            </Col>
        </Row>
    );

    // Render Auto Provision/Auto Revoke fields
    const renderAutoFields = () =>
        action.map((row, index) => (
            <Row key={index} style={{ marginBottom: "10px" }}>
                <Col md={2}>
                    <input
                        type="text"
                        placeholder="Application"
                        className="form-control"
                        value={row.application || ""}
                        onChange={(e) =>
                            handleArrayInputChange(index, "application", e.target.value)
                        }
                    />
                </Col>
                <Col md={2}>
                    <label>Days</label>
                </Col>
                <Col md={2}>
                    <select
                        className="form-control"
                        value={row.duration || ""}
                        onChange={(e) =>
                            handleArrayInputChange(index, "duration", e.target.value)
                        }
                    >
                        <option value="">Select</option>
                        {Array.from({ length: 180 }, (_, i) => i + 1).map((day) => (
                            <option key={day} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </Col>
                <Col md={2}>
                    <input
                        type="text"
                        placeholder="Value"
                        className="form-control"
                        value={row.value || ""}
                        onChange={(e) => handleArrayInputChange(index, "value", e.target.value)}
                    />
                </Col>
                <Col md={1}>
                    <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="btn btn-danger"
                    >
                        Remove
                    </button>
                </Col>
            </Row>
        ));

    return (
        <div className="row">
            <Col md={12}>
                {ruleType === "Allow"
                    ? renderAllowFields()
                    : ruleType === "Deny"
                        ? renderDenyFields()
                        : (ruleType === "Auto Provision" || ruleType === "Auto Revoke") && renderAutoFields()}
            </Col>
        </div>
    );
};

ActionOnCondition.propTypes = {
    action: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    onChange: PropTypes.func.isRequired,
    ruleType: PropTypes.string.isRequired,
};

export default ActionOnCondition;

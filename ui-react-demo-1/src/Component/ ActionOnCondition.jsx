import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";
import ValueSearch from "./ValueSearch";

const ActionOnCondition = ({ action, onChange, ruleType }) => {
    const handleInputChange = (conditionKey, index, key, value) => {
        const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
        if (regex.test(value) || value === "") {
            const updatedRows = [...action.conditionMet[conditionKey]];
            updatedRows[index] = { ...updatedRows[index], [key]: value };
            onChange({
                ...action,
                conditionMet: {
                    ...action.conditionMet,
                    [conditionKey]: updatedRows,
                },
            });
        }
    };

    const handleOperationChange = (conditionKey, index, value) => {
        const updatedRows = [...action.conditionMet[conditionKey]];
        updatedRows[index] = { ...updatedRows[index], operation: value };
        onChange({
            ...action,
            conditionMet: {
                ...action.conditionMet,
                [conditionKey]: updatedRows,
            },
        });
    };

    const handleRemoveRow = (conditionKey, index) => {
        const updatedRows = action.conditionMet[conditionKey].filter(
            (_, i) => i !== index
        );
        onChange({
            ...action,
            conditionMet: {
                ...action.conditionMet,
                [conditionKey]: updatedRows,
            },
        });
    };

    const handleMessageChange = (conditionKey, value) => {
        onChange({
            ...action,
            [conditionKey]: {
                ...action[conditionKey],
                message: value,
            },
        });
    };

    const handleValueSuggestionClick = (entlm, conditionKey, index) => {
        const updatedRows = [...action.conditionMet[conditionKey]];
        const entlmValues = updatedRows[index].value || [];
        const existsIndex = entlmValues.findIndex(
            (item) =>
                item.location === entlm.authNamespace && item.value === entlm.entlmDn
        );

        if (existsIndex !== -1) {
            entlmValues.splice(existsIndex, 1);
        } else {
            entlmValues.push({
                location: entlm.authNamespace,
                value: entlm.entlmDn,
                name: entlm.entlmName,
            });
        }

        updatedRows[index] = { ...updatedRows[index], value: entlmValues };

        // Extract distinct locations and store them in application
        const distinctLocations = [...new Set(entlmValues.map((item) => item.location))];
        updatedRows[index].application = distinctLocations;
        onChange({
            ...action,
            conditionMet: {
                ...action.conditionMet,
                [conditionKey]: updatedRows,
            },
        });
    };

    const autoResizeTextarea = (element) => {
        if (element) {
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
        }
    };

    const renderAutoFields = (conditionKey) =>
        action.conditionMet[conditionKey]?.map((row, index) => (
            <Row key={index} className="mb-3" style={{ display: "flex", alignItems: "center" }}>
                <Col md={3} xs={12} style={{ marginBottom: "10px" }}>
                    <h5>Value Search :</h5>
                    <ValueSearch
                        handleValueSuggestionClick={(entlm) =>
                            handleValueSuggestionClick(entlm, conditionKey, index)
                        }
                        selectedEntlmArray={row.value || []}
                    />
                </Col>

                <Col md={3} xs={12} style={{ marginBottom: "10px" }}>
                    <h5>Application:</h5>
                    <textarea
                        className="form-control"
                        value={Array.isArray(row.application) ? row.application.join("\n") : ""}
                        readOnly
                        style={{ resize: "vertical", width: "100%" }}
                    />
                </Col>

                <Col md={2} xs={12} style={{ marginBottom: "10px" }}>
                    <h5>Operation:</h5>
                    <select
                        value={row.operation || "ADD"}
                        onChange={(e) => handleOperationChange(conditionKey, index, e.target.value)}
                        className="form-control"
                    >
                        <option value="ADD">ADD</option>
                        <option value="REMOVE">REMOVE</option>
                    </select>
                </Col>

                <Col md={2} xs={12} style={{ marginBottom: "10px" }}>
                    <h5>Duration:</h5>
                    <input
                        type="text"
                        className="form-control"
                        value={row.duration || ""}
                        onChange={(e) =>
                            handleInputChange(conditionKey, index, "duration", e.target.value)
                        }
                    />
                </Col>

                <Col md={2} xs={12} style={{ marginBottom: "10px" }}>
                    <button
                        type="button"
                        onClick={() => handleRemoveRow(conditionKey, index)}
                        className="btn btn-danger"
                    >
                        Remove
                    </button>
                </Col>
            </Row>
        ));

    return (
        <div className="row" style={{ width: "100%" }}>
            <Col md={12}>
                {ruleType === "Allow" && (
                    <Row
                        key="conditionNotMet"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <Col md={2} xs={12} style={{ marginBottom: "10px" }}>
                            Return Message
                        </Col>
                        <Col md={10} xs={12}>
                            <textarea
                                placeholder="Return Message"
                                className="form-control"
                                value={action.conditionNotMet?.message || ""}
                                onChange={(e) => handleMessageChange("conditionNotMet", e.target.value)}
                                style={{ resize: "none", width: "100%" }}
                                rows={1}
                                onInput={(e) => autoResizeTextarea(e.target)}
                            />
                        </Col>
                    </Row>
                )}

                {ruleType === "Deny" && (
                    <Row
                        key="conditionMet"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <Col md={2} xs={12} style={{ marginBottom: "10px" }}>
                            Condition Met
                        </Col>
                        <Col md={10} xs={12}>
                            <textarea
                                placeholder="Return Message"
                                className="form-control"
                                value={action.conditionMet?.message || ""}
                                onChange={(e) => handleMessageChange("conditionMet", e.target.value)}
                                style={{ resize: "none", width: "100%" }}
                                rows={1}
                                onInput={(e) => autoResizeTextarea(e.target)}
                            />
                        </Col>
                    </Row>
                )}

                {ruleType === "Auto Provision" && renderAutoFields("provision")}
                {ruleType === "Auto Revoke" && renderAutoFields("revoke")}
            </Col>
        </div>
    );
};

ActionOnCondition.propTypes = {
    action: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    ruleType: PropTypes.string.isRequired,
};

export default ActionOnCondition;

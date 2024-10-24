import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ActionOnCondition from "./ ActionOnCondition";

export default function ActionPart() {
    const [ruleType, setRuleType] = useState("");
    const [action, setAction] = useState([]); // Initialize as an array for actions
    const [allowDenyAction, setAllowDenyAction] = useState({
        conditionMet: "",
    }); // State for Allow/Deny actions
    const [errors, setErrors] = useState([]);

    const handleRuleTypeChange = (e) => {
        const selectedRuleType = e.target.value;
        setRuleType(selectedRuleType);

        // Reset action or allowDenyAction based on selected ruleType
        if (selectedRuleType === "Allow" || selectedRuleType === "Deny") {
            setAllowDenyAction({ conditionMet: ""}); // Clear for Allow/Deny
            setAction([]); // Reset action array for other rule types
        } else {
            setAction([]); // Clear action for Auto Provision/Auto Revoke
        }
    };

    const handleActionChange = (newAction) => {
        if (ruleType === "Allow" || ruleType === "Deny") {
            setAllowDenyAction(newAction); // Update the object for Allow/Deny
        } else {
            setAction(newAction); // Update the array for Auto Provision/Auto Revoke
        }
    };

    const addRow = () => {
        const newRow = {
            application: "",
            duration: "",
            value: ""
        };
        setAction((prevState) => [...prevState, newRow]); // Add a new row to the array
    };

    const validateAction = () => {
        let validationErrors = [];

        if (ruleType === "Allow" || ruleType === "Deny") {
            if (!allowDenyAction.conditionMet) {
                validationErrors.push("Condition Met cannot be empty.");
            }
        } else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
            if (!action.length) {
                validationErrors.push(`At least one action is required for '${ruleType}'.`);
            }
            action.forEach((item, index) => {
                if (!item.application) {
                    validationErrors.push(`Action Row ${index + 1}, application field cannot be empty.`);
                }
                if (!item.duration) {
                    validationErrors.push(`Action Row ${index + 1}, duration field cannot be empty.`);
                }
                if (!item.value) {
                    validationErrors.push(`Action Row ${index + 1}, value field cannot be empty.`);
                }
            });
        }

        setErrors(validationErrors);
        return validationErrors.length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAction()) {
            if (ruleType === "Allow" || ruleType === "Deny") {
                console.log(JSON.stringify(allowDenyAction)); // Output for Allow/Deny
            } else {
                console.log(JSON.stringify(action)); // Output for Auto Provision/Auto Revoke
            }
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <Col md={12}>
                    <Row>
                        <Col md={6}>
                            <label>Select Rule Type</label>
                        </Col>
                        <Col md={6}>
                            <select value={ruleType} onChange={handleRuleTypeChange}>
                                <option value="">Select</option>
                                <option value="Allow">Allow</option>
                                <option value="Deny">Deny</option>
                                <option value="Auto Provision">Auto Provision</option>
                                <option value="Auto Revoke">Auto Revoke</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <ActionOnCondition
                            action={ruleType === "Allow" || ruleType === "Deny" ? allowDenyAction : action}
                            onChange={handleActionChange}
                            ruleType={ruleType}
                        />
                    </Row>
                    {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") && (
                        <Row>
                            <Col md={12}>
                                <button type="button" onClick={addRow}>
                                    Add Another Row
                                </button>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <Col md={12}>
                            <button type="submit">Submit</button>
                        </Col>
                    </Row>
                    {errors.length > 0 && (
                        <Row>
                            <Col md={12}>
                                <div className="text-danger">
                                    <ul>
                                        {errors.map((error, index) => (
                                            <li key={index} style={{ color: 'red' }}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                    )}
                    <Row>
                        <div>
                            <h3>JSON Output:</h3>
                            <pre>
                                {ruleType === "Allow" || ruleType === "Deny"
                                    ? JSON.stringify(allowDenyAction, null, 2)
                                    : JSON.stringify(action, null, 2)}
                            </pre>
                        </div>
                    </Row>
                </Col>
            </form>
        </div>
    );
}

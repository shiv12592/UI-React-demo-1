import './App.css';
import RuleConditionRows from "./RuleConditionRows";
import { useState, useEffect, useCallback } from "react";
import { DatePicker } from './Component/DatePicker';  // Import DatePicker component
import ActionOnCondition from "./Component/ ActionOnCondition";  // Import ActionOnCondition component

export default function App() {
    const [jsonData, setJsonData] = useState(null);
    const [conditionData, setConditionData] = useState(null);
    const [errorRequestMessages, setErrorMessages] = useState([]);
    const [ruleDetails, setRuleDetails] = useState(null);  // State to store fetched ruleDetails
    const [ruleType, setRuleType] = useState("");
    const [action, setAction] = useState({
        conditionMet: {
            provision: [],
            revoke: [],
        },
        conditionNotMet: {
            message: "",
        },
    });
    const [errors, setErrors] = useState([]);

    // Fetch ruleDetails from the backend
    useEffect(() => {
        fetch('http://localhost:5005/ruleDetails')  // Make a GET request to your server
            .then((response) => response.json())
            .then((data) => setRuleDetails(data))    // Store the fetched data in state
            .catch((error) => console.error('Error fetching rule details:', error));
    }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

    const handleConditionData = useCallback((data) => {
        if (JSON.stringify(data) !== JSON.stringify(conditionData)) {
            setConditionData(data);
        }
    }, [conditionData]);

    const handleSubmit = () => {
        const errorMessages = validateData(conditionData);
        if (errorMessages.length === 0) {
            const jsonString = JSON.stringify(conditionData, null, 2);
            setJsonData(jsonString);
            setErrorMessages([]);
        } else {
            setErrorMessages(errorMessages);
        }
    };

    const validateData = (data) => {
        if (!data) return [];

        let errors = [];
        const traverse = (obj, path = [], index = 0) => {
            for (const key in obj) {
                if (Array.isArray(obj[key]) && obj[key].length === 0) {
                    errors.push(
                        `Array for <${key}> under ${obj.Source ? `${obj.Source} Condition Row Number ${index + 1}` : "condition"} should not be empty.`
                    );
                } else if (typeof obj[key] === "object" && obj[key] !== null) {
                    traverse(obj[key], [...path, key], index);
                } else if (obj[key] === "") {
                    errors.push(
                        `Value for <${key}> under ${obj.Source ? `${obj.Source} Condition Row Number ${index + 1}` : "condition"} should not be empty.`
                    );
                }
            }
        };

        if (data.AND) {
            data.AND.forEach((condition, index) => traverse(condition, ["AND"], index));
        }
        if (data.OR) {
            data.OR.forEach((condition, index) => traverse(condition, ["OR"], index));
        }

        return errors;
    };

    // RuleType and ActionOnCondition integration
    const handleRuleTypeChange = (e) => {
        const selectedRuleType = e.target.value;
        setRuleType(selectedRuleType);

        // Reset action based on selected ruleType
        if (selectedRuleType === "Allow") {
            setAction({ conditionNotMet: { message: "" } });
        } else if (selectedRuleType === "Deny") {
            setAction({ conditionMet: { message: "" } });
        } else {
            setAction({
                conditionMet: {
                    provision: [],
                    revoke: [],
                },
            });
        }
    };

    const handleActionChange = (newAction) => {
        setAction(newAction);
    };

    const addRow = () => {
        const newRow = {
            application: "",
            duration: "",
            operation:"",
            value: "",
        };
        if (ruleType === "Auto Provision") {
            setAction((prevState) => ({
                ...prevState,
                conditionMet: {
                    ...prevState.conditionMet,
                    provision: [...prevState.conditionMet.provision, newRow],
                },
            }));
        } else if (ruleType === "Auto Revoke") {
            setAction((prevState) => ({
                ...prevState,
                conditionMet: {
                    ...prevState.conditionMet,
                    revoke: [...prevState.conditionMet.revoke, newRow],
                },
            }));
        }
    };

    const validateAction = () => {
        let validationErrors = [];

        if (ruleType === "Allow") {
            if (!action.conditionNotMet?.message) {
                validationErrors.push("Message field for 'Allow' is required.");
            }
        } else if (ruleType === "Deny") {
            if (!action.conditionMet?.message) {
                validationErrors.push("Message field for 'Deny' is required.");
            }
        } else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
            const conditionKey =
                ruleType === "Auto Provision" ? "provision" : "revoke";
            if (!action.conditionMet[conditionKey].length) {
                validationErrors.push(
                    `At least one action is required for '${ruleType}'.`
                );
            }
            action.conditionMet[conditionKey].forEach((item, index) => {
                if (!item.application) {
                    validationErrors.push(
                        `Action Row ${index + 1}, application field cannot be empty.`
                    );
                }
                if (!item.operation) {
                    validationErrors.push(
                        `Action Row ${index + 1}, operation field cannot be empty.`
                    );
                }
                if (!item.value) {
                    validationErrors.push(
                        `Action Row ${index + 1}, value field cannot be empty.`
                    );
                }
            });
        }

        setErrors(validationErrors);
        return validationErrors.length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateAction()) {
            console.log(JSON.stringify(action));
        }
    };

    return (
        <div className="container my-4" style={{ border: '1px solid black', padding: '20px' }}>
            <div className="mb-4" style={{ border: '1px solid black', padding: '20px' }}>
                <RuleConditionRows onData={handleConditionData} />
            </div>

            <div className="mb-4" style={{ border: '1px solid black', padding: '10px' }}>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>Select Rule Type</label>
                        <select value={ruleType} onChange={handleRuleTypeChange}>
                            <option value="">Select</option>
                            <option value="Allow">Allow</option>
                            <option value="Deny">Deny</option>
                            <option value="Auto Provision">Auto Provision</option>
                            <option value="Auto Revoke">Auto Revoke</option>
                        </select>
                    </div>
                    <ActionOnCondition
                        action={action}
                        onChange={handleActionChange}
                        ruleType={ruleType}
                    />
                    {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") && (
                        <button type="button" onClick={addRow}>Add Another Row</button>
                    )}
                    <button type="submit">Submit</button>
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index} style={{color: 'red'}}>{error}</li>
                            ))}
                        </ul>
                    )}
                    <div className="json-preview" style={{marginTop: '20px'}}>
                        <h5>Form Data (JSON Preview):</h5>
                        <pre style={{backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px'}}>
                {JSON.stringify(action, null, 2)}
            </pre>
                    </div>
                </form>
            </div>

            {errorRequestMessages.length > 0 && (
                <div className="alert alert-danger" style={{border: '1px solid red', padding: '20px'}}>
                    <h5>Error:</h5>
                    {errorRequestMessages.map((error, index) => (
                        <p style={{ color: 'red' }} key={index}>{`Error ${index + 1}: ${error}`}</p>
                    ))}
                </div>
            )}

            {jsonData && (
                <div style={{ border: '1px solid black', padding: '10px' }}>
                    <h5>JSON Data:</h5>
                    <pre>{jsonData}</pre>
                </div>
            )}
        </div>
    );
}

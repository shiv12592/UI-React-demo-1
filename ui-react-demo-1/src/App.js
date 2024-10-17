import './App.css';
import RuleConditionRows from "./RuleConditionRows";
import { useState, useEffect, useCallback } from "react";
import { DatePicker } from './Component/DatePicker';  // Import DatePicker component

export default function App() {
    const [jsonData, setJsonData] = useState(null);
    const [conditionData, setConditionData] = useState(null);
    const [errorRequestMessages, setErrorMessages] = useState([]);
    const [ruleDetails, setRuleDetails] = useState(null);  // State to store fetched ruleDetails

    // Fetch ruleDetails from the backend
    useEffect(() => {
        fetch('http://localhost:5000/ruleDetails')  // Make a GET request to your server
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

    return (
        <div className="container my-4" style={{ border: '1px solid black', padding: '20px' }}>
            <div>RuleName</div>
            <div>Rule No</div>
            <div className="mb-4" style={{ border: '1px solid black', padding: '20px' }}>
                <RuleConditionRows onData={handleConditionData} />
            </div>

            {/* Only render the DatePicker if ruleDetails has been fetched */}
            {/*{ruleDetails && <DatePicker ruleDetails={ruleDetails} />}*/}

            <div className="mb-4" style={{ border: '1px solid black', padding: '10px', textAlign: 'center' }}>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                </button>
            </div>

            {errorRequestMessages.length > 0 && (
                <div className="alert alert-danger" style={{border: '1px solid red', padding: '20px'}}>
                    <h5>Error:</h5>
                    {errorRequestMessages.map((error, index) => (
                        <p style={{color:'red'}} key={index}>{`Error ${index + 1}: ${error}`}</p>
                    ))}
                </div>
            )}

            {jsonData && (
                <div style={{border: '1px solid black', padding: '10px'}}>
                    <h5>JSON Data:</h5>
                    <pre>{jsonData}</pre>
                </div>
            )}
        </div>
    );
}

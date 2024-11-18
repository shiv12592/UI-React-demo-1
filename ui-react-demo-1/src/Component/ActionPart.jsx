import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import ActionOnCondition from "./ ActionOnCondition";

class ActionPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruleType: "Auto Provision", // Set to Auto Provision to test the provision rows
      action: {
        conditionMet: {
          provision: [
            {
              application: "hgjghk",
              duration: "6",
              value: "jghjhghjh",
            },
            {
              application: "",
              duration: "",
              value: "fgjghk",
            },
          ],
        },
      },
      errors: [],
    };
  }

  handleRuleTypeChange = (e) => {
    const selectedRuleType = e.target.value;
    this.setState({
      ruleType: selectedRuleType,
      action:
      selectedRuleType === "Allow"
            ? { conditionNotMet: { message: "" } }
            : selectedRuleType === "Deny"
            ? { conditionMet: { message: "" } }
            : selectedRuleType === "Approval"
            ? {
                approval: {
                    primary: "true",
                    secondary: "false",
                },
                }
            : {
                conditionMet: {
                    provision: [],
                },
                },
    });
  };

  handleActionChange = (newAction) => {
    this.setState({ action: newAction });
  };

  addRow = () => {
    const newRow = {
      application: "",
      duration: "",
      value: "",
    };
    this.setState((prevState) => ({
      action: {
        ...prevState.action,
        conditionMet: {
          ...prevState.action.conditionMet,
          provision: [...prevState.action.conditionMet.provision, newRow],
        },
      },
    }));
  };

  validateAction = () => {
    const { ruleType, action } = this.state;
    let validationErrors = [];

    if (ruleType === "Allow") {
      if (!action.conditionNotMet?.message) {
        validationErrors.push("Message field for 'Allow' is required.");
      }
    } else if (ruleType === "Deny") {
      if (!action.conditionMet?.message) {
        validationErrors.push("Message field for 'Deny' is required.");
      }
    } else if (ruleType === "Approval") {
        if (!action.approval?.primary || !action.approval?.secondary) {
        validationErrors.push("Both 'Primary' and 'Secondary' values are required for Approval.");
        } 
    }else if (ruleType === "Auto Provision" || ruleType === "Auto Revoke") {
      if (!action.conditionMet.provision.length) {
        validationErrors.push(
          `At least one action is required for '${ruleType}'.`
        );
      }
      action.conditionMet.provision.forEach((item, index) => {
        if (!item.application) {
          validationErrors.push(
            `Action Row ${index + 1}, application field cannot be empty.`
          );
        }
        if (!item.duration) {
          validationErrors.push(
            `Action Row ${index + 1}, duration field cannot be empty.`
          );
        }
        if (!item.value) {
          validationErrors.push(
            `Action Row ${index + 1}, value field cannot be empty.`
          );
        }
      });
    }

    this.setState({ errors: validationErrors });
    return validationErrors.length === 0;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.validateAction()) {
      console.log(JSON.stringify(this.state.action));
    }
  };

  render() {
    const { ruleType, action, errors } = this.state;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <Col md={12}>
            <Row>
              <Col md={6}>
                <label>Select Rule Type</label>
              </Col>
              <Col md={6}>
                <select value={ruleType} onChange={this.handleRuleTypeChange}>
                  <option value="">Select</option>
                  <option value="Allow">Allow</option>
                  <option value="Deny">Deny</option>
                  <option value="Auto Provision">Auto Provision</option>
                  <option value="Auto Revoke">Auto Revoke</option>
                  <option value="Approval">Approval</option>
                </select>
              </Col>
            </Row>
            <Row>
              <ActionOnCondition
                action={action}
                onChange={this.handleActionChange}
                ruleType={ruleType}
              />
            </Row>
            {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") && (
              <Row>
                <Col md={12}>
                  <button type="button" onClick={this.addRow}>
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
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            )}
            <Row>
              <div>
                <h3>JSON Output:</h3>
                <pre>{JSON.stringify(action, null, 2)}</pre>
              </div>
            </Row>
          </Col>
        </form>
      </div>
    );
  }
}

export default ActionPart;
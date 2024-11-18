import React from "react";
import PropTypes from "prop-types";
import { Col, Row } from "react-bootstrap";

const ActionOnCondition = ({ action, onChange, ruleType }) => {
  const handleInputChange = (index, key, value) => {
    const updatedRows = [...action.conditionMet.provision];
    updatedRows[index] = { ...updatedRows[index], [key]: value };
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        provision: updatedRows,
      },
    });
  };

  const handleRemoveRow = (index) => {
    const updatedRows = action.conditionMet.provision.filter(
      (_, i) => i !== index
    );
    onChange({
      ...action,
      conditionMet: {
        ...action.conditionMet,
        provision: updatedRows,
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

  const renderAutoFields = () =>
    action.conditionMet.provision?.map((row, index) => (
      <Row key={index} style={{ marginBottom: "10px" }}>
        <Col md={2} style={{ marginRight: "10px" }}>
          <input
            type="text"
            placeholder="Application"
            className="form-control"
            value={row.application || ""}
            onChange={(e) =>
              handleInputChange(index, "application", e.target.value)
            }
          />
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <label>Days</label>
        </Col>
        <Col md={2} style={{ marginRight: "10px" }}>
          <select
            className="form-control"
            value={row.duration || ""}
            onChange={(e) =>
              handleInputChange(index, "duration", e.target.value)
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
        <Col md={2} style={{ marginRight: "10px" }}>
          <input
            type="text"
            placeholder="Value"
            className="form-control"
            value={row.value || ""}
            onChange={(e) => handleInputChange(index, "value", e.target.value)}
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

    const handleApprovalChange = (key, value) => {
        onChange({
          ...action,
          approval: {
            ...action.approval,
            [key]: value,
          },
        });
      };
    
      const renderApprovalFields = () => (
        <>
          <Row style={{ marginBottom: "10px" }}>
            <Col md={2}>Primary</Col>
            <Col md={2}>
              <select
                className="form-control"
                value={action.approval?.primary || ""}
                onChange={(e) => handleApprovalChange("primary", e.target.value)}
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col md={2}>Secondary</Col>
            <Col md={2}>
              <select
                className="form-control"
                value={action.approval?.secondary || ""}
                onChange={(e) => handleApprovalChange("secondary", e.target.value)}
              >
                <option value="">Select</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </Col>
          </Row>
        </>
      );
  return (
    <div className="row">
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
            <Col md={2} style={{ marginRight: "10px" }}>
              Return Message
            </Col>
            <Col md={8}>
              <input
                type="text"
                placeholder="Return Message"
                className="form-control"
                value={action.conditionNotMet?.message || ""}
                onChange={(e) =>
                  handleMessageChange("conditionNotMet", e.target.value)
                }
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
            <Col md={2} style={{ marginRight: "10px" }}>
              Condition Met
            </Col>
            <Col md={8}>
              <input
                type="text"
                placeholder="Return Message"
                className="form-control"
                value={action.conditionMet?.message || ""}
                onChange={(e) =>
                  handleMessageChange("conditionMet", e.target.value)
                }
              />
            </Col>
          </Row>
        )}
        {(ruleType === "Auto Provision" || ruleType === "Auto Revoke") &&
          renderAutoFields()}
          {ruleType === "Approval" && renderApprovalFields()}
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
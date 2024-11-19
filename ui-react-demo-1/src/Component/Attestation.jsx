import React, { Component } from 'react';

class Attestation extends Component {
  state = {
    conditions: [
      "I agree to the terms and conditions.",
      "I confirm that I am above 18 years of age.",
      "I acknowledge the privacy policy.",
      "I agree to receive notifications.",
      "I accept the refund policy.",
    ],
    checkboxes: Array(5).fill(false), // Initial state for 5 checkboxes, all unchecked
  };

  handleCheckboxChange = (index) => {
    const newCheckboxes = [...this.state.checkboxes];
    newCheckboxes[index] = !newCheckboxes[index]; // Toggle checkbox value
    this.setState({ checkboxes: newCheckboxes });
  };

  areAllChecked = () => {
    return this.state.checkboxes.every((isChecked) => isChecked);
  };

  render() {
    const { conditions, checkboxes } = this.state;

    return (
      <div>
        <h3>Please check all boxes to attest:</h3>
        {conditions.map((condition, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={checkboxes[index]}
                onChange={() => this.handleCheckboxChange(index)}
              />
              {condition}
            </label>
          </div>
        ))}
        <button
          onClick={() => alert('Attestation Confirmed!')}
          disabled={!this.areAllChecked()}
        >
          Attest
        </button>
      </div>
    );
  }
}

export default Attestation;

import React, { Component } from 'react';

class Attestation extends Component {
  state = {
    checkboxesForAttest: Array(5).fill(false), // Initial state for 5 checkboxes, all unchecked
  };

  handleCheckboxChange = (index) => {
    const newCheckboxes = [...this.state.checkboxesForAttest];
    newCheckboxes[index] = !newCheckboxes[index]; // Toggle checkbox value
    this.setState({ checkboxesForAttest: newCheckboxes });
  };

  areAllChecked = () => {
    return this.state.checkboxesForAttest.every((isChecked) => isChecked);
  };

  render() {
    const { checkboxesForAttest } = this.state;

    return (
      <div>
        <h3>Please check all boxes to attest:</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={checkboxesForAttest[0]}
              onChange={() => this.handleCheckboxChange(0)}
            />
            I agree to the terms and conditions.
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={checkboxesForAttest[1]}
              onChange={() => this.handleCheckboxChange(1)}
            />
            I confirm that I am above 18 years of age.
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={checkboxesForAttest[2]}
              onChange={() => this.handleCheckboxChange(2)}
            />
            I acknowledge the privacy policy.
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={checkboxesForAttest[3]}
              onChange={() => this.handleCheckboxChange(3)}
            />
            I agree to receive notifications.
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={checkboxesForAttest[4]}
              onChange={() => this.handleCheckboxChange(4)}
            />
            I accept the refund policy.
          </label>
        </div>
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
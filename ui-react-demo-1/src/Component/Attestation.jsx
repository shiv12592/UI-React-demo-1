import React, { Component } from 'react';

class Attestation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxes: Array(5).fill(false), // Initial state for 5 checkboxes, all unchecked
    };
  }

  handleCheckboxChange = (index) => {
    const newCheckboxes = [...this.state.checkboxes];
    newCheckboxes[index] = !newCheckboxes[index]; // Toggle checkbox value
    this.setState({ checkboxes: newCheckboxes });
  };

  areAllChecked = () => {
    return this.state.checkboxes.every((isChecked) => isChecked);
  };

  render() {
    return (
      <div>
        <h3>Please check all boxes to attest:</h3>
        {this.state.checkboxes.map((isChecked, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => this.handleCheckboxChange(index)}
              />
              I agree to condition {index + 1}
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

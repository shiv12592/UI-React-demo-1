import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class DatePicker extends Component {
    static propTypes = {
        ruleDetails: PropTypes.object.isRequired,
    };

    static defaultProps = {};

    state = {
        ruleDescription: '',
        errorMessage: null,
        newCategory: '',
        newCarId: '',
        newRuleOwner: '',
        requestData: [],
        startDate: null,
        endDate: null,
    };

    componentDidMount() {
        const { ruleDetails } = this.props;
        const ruleCategory = ruleDetails.category;
        const carId = ruleDetails.carId;
        const ruleOwner = ruleDetails.owner;
        const startTime = new Date(ruleDetails.startTime * 1000);
        const endTime = new Date(ruleDetails.endTime * 1000);
        this.setState({
            newCategory: ruleCategory,
            newCarId: carId,
            newRuleOwner: ruleOwner,
            requestData: ruleDetails.requestData,
            startDate: startTime,
            endDate: endTime,
        });
    }

    handleDateChange = (date, isStartDate) => {
        const currentDate = new Date();
        const selectedDateWithTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds()
        );

        if (isStartDate) {
            // Set the start date and reset the end date
            this.setState({ startDate: selectedDateWithTime, endDate: null, errorMessage: null });
        } else {
            // Ensure the startDate is already set before comparing
            if (this.state.startDate && selectedDateWithTime < this.state.startDate) {
                this.setState({ errorMessage: 'End date cannot be before start date.' });
            } else {
                this.setState({ endDate: selectedDateWithTime, errorMessage: null });
            }
        }
    };


    convertToEpoch = (date) => {
        return date ? Math.floor(date.getTime() / 1000) : '';
    };

    render() {
        // ... rest of your component
        return (
            <div>
                {/* ... other parts of your component */}
                <input
                    type="date"
                    value={this.state.startDate ? this.state.startDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const date = new Date(e.target.value);
                        this.handleDateChange(date, true);
                    }}
                />
                <input
                    type="date"
                    value={this.state.endDate ? this.state.endDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const date = new Date(e.target.value);
                        this.handleDateChange(date, false);
                    }}
                    disabled={!this.state.startDate}
                />
                {this.state.errorMessage && <div style={{ color: 'red' }}>{this.state.errorMessage}</div>}
                <div>
                    Start Date Epoch: {this.convertToEpoch(this.state.startDate)}
                </div>
                <div>
                    End Date Epoch: {this.convertToEpoch(this.state.endDate)}
                </div>
                {/* ... other parts of your component */}
            </div>
        );
    }
}

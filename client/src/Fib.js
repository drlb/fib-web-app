import React, { Component } from "react";

// Module for making requets to the backend express server
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };

    componentDidMount(){
        this.fetchValues();
        this.fetchIndexes();
    }

    // Async method for fetching data from backend API
    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({ values: values.data }); // Update State
    }

    // Async method for fetch data from backend API (all indexes that stored on pg)
    async fetchIndexes() {
        const seenIndexes = await axios.get('/api/values/all');
        this.setState({ seenIndexes: seenIndexes.data }); // Update State
    }

    // Async method - submit form and try to send the information to the backend API
    handleSubmit = async (event) =>{
        // prevent the form to submit itself
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({ index: '' });
    };

    // Helper method for printing the list of current indexes (from pg)
    renderSeenIndexes () {
        // Iterate over every object in the array and pulled out each number and return it as list of numbers
        return this.state.seenIndexes.map(({ number }) => number).join(', ')
    }

    // Helper method that will render out all calculated values that was in the application (from redis)
    renderValues() {
        const entries = [];
        // Iterate over every object in the array and for each key create div with unique key id and add it to the new array
        for (let key in this.state.values) {
            entries.push(<div key={key}>For index {key} I calculated {this.state.values[key]}</div>)
        }
        return entries;
    }

    render(){
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input value={this.state.index} onChange={event => this.setState({ index: event.target.value })}/>
                    <button>Submit</button>
                </form>

                <h3>Indexes i have seen:</h3>
                {this.renderSeenIndexes()}

                <h3>Calculated Values</h3>
                {this.renderValues()}

            </div>
        );
    }
}

export default Fib;
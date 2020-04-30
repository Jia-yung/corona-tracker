import React, { Component } from 'react'
import './ListItem.css'

class ListItem extends Component {
    render() {
        let figure  = this.props.cases
        let category = "infected"

        if (this.props.sortBy === "country" || this.props.sortBy === "cases") {
            category = "Infected"
            figure = this.props.cases
        } else if (this.props.sortBy === "deaths") {
            category = "Death"
            figure = this.props.deaths
        } else if (this.props.sortBy === "recovered") {
            category = "Recovered"
            figure = this.props.recovered
        } else if (this.props.sortBy === "recoveryRate") {
            category = "Recovery rate"
            figure = (this.props.recoveryRate/100).toString() + "%"
        } else if (this.props.sortBy === "fatalityRate") {
            category = "Fatality rate"
            figure = (this.props.fatalityRate/100).toString() + "%"
        }
        return (
            <li onClick={this.props.clicked}>
                <h6>
                    <img className="itemFlag" src={this.props.flag} alt="" align="middle" />
                    {this.props.country}
                </h6>
                <div className="listContent">
                    <h6>{category + ":"}</h6>
                    <h6 className={category} >{figure.toLocaleString()}</h6>
                </div>
            </li>
        )
    }
}

export default ListItem
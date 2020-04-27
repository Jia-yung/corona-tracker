import React, { Component } from 'react'
import './ListItem.css'

class ListItem extends Component {
    render() {
        let figure  = this.props.cases
        let category = "infected"

        if (this.props.sortBy === "country" || this.props.sortBy === "cases") {
            category = "infected"
            figure = this.props.cases
        } else if (this.props.sortBy === "deaths") {
            category = "deaths"
            figure = this.props.deaths
        } else if (this.props.sortBy === "recovered") {
            category = "recovered"
            figure = this.props.recovered
        }
        return (
            <li onClick={this.props.clicked}>
                <h6>
                    <img className="itemFlag" src={this.props.flag} alt="flag" align="middle" />
                    {this.props.country}
                </h6>
                <div className="listContent">
                    <h6 className={category} >{figure.toLocaleString()}</h6>
                    <h6>{category}</h6>
                </div>
            </li>
        )
    }
}

export default ListItem
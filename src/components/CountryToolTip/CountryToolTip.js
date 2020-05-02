import React, { Component } from 'react'
import './CountryToolTip.css'

class CountryToolTip extends Component {
    render () {
        return (
            <div onClick={this.props.clicked} className="toolTipStyle">
                <img className="flagIcon" src={this.props.flag} alt="flag" ></img>
                <p className="textStyle">{this.props.country}</p>
            </div>
        )
    }
}

export default CountryToolTip
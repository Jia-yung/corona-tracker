import React, { Component } from 'react'
import './Modal.css'
import CountUp from 'react-countup'

 class modal extends Component {
    render () {
        return (
            <div>
                <CountUp className={["figure", this.props.status].join(' ')} start={0} end={this.props.figure} delay={0}></CountUp>
                <h5 className="modalStatus">{this.props.title}</h5>
            </div>
        )
    }
 }


export default modal
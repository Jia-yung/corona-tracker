import React, { Component } from 'react'
import './Modal.css'
import CountUp from 'react-countup'

 class modal extends Component {
    render () {
        return (
            <div className="modalContainer">
                <CountUp 
                    style={{display: this.props.showSpinner? 'none' : 'block'}} 
                    className={["figure", this.props.status].join(' ')} 
                    duration={2.5} 
                    separator="," 
                    start={0} 
                    end={this.props.figure} 
                    delay={0} />
                <h5 style={{display: this.props.showSpinner? 'none' : 'block'}} className="modalStatus">{this.props.title}</h5>
                {this.props.children}
            </div>
        )
    }
 }


export default modal
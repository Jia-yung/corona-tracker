import React, { Component } from 'react'
import CountUp from 'react-countup'
import './Modal.css'

 class modal extends Component {
    render () {
        let incrementPercentage = (this.props.today/this.props.figure) * 100
        return (
            <div className="modalContainer">
                <div style={{display: this.props.showSpinner? 'none' : 'block'}}>
                    <div style={{display:"flex", justifyContent:"center"}}>
                        <h4 className="arrow">↑</h4>
                        <h4 className="null" style={{display: this.props.today? 'none' : 'block'}}>--</h4>
                        <CountUp 
                            style={{display: this.props.today? 'block' : 'none'}} 
                            className={["figureIncrement", this.props.status].join(' ')} 
                            duration={2.5} 
                            separator="," 
                            start={0} 
                            end={this.props.today} 
                            delay={0} />
                        <CountUp 
                            style={{display: this.props.today? 'block' : 'none'}} 
                            className= "figureIncrement percent"
                            duration={2.5} 
                            decimals={2}
                            start={0} 
                            end={incrementPercentage}
                            prefix="±"
                            suffix="%"
                            delay={0} />            
                    </div>
                    <CountUp 
                        className={["figure", this.props.status].join(' ')} 
                        duration={2.5} 
                        separator="," 
                        start={0} 
                        end={this.props.figure} 
                        delay={0} />
                </div>
                {this.props.children}
                <h5 className="modalStatus">{this.props.title}</h5>
            </div>
        )
    }
 }


export default modal
import React from 'react'
import './ListItem.css'

const listItem = (props) => (
    <li onClick={props.clicked}>
        <h6>
            <img className="itemFlag" src={props.flag} alt="flag" align="middle" />
            {props.country}
        </h6>
        <h6>{props.cases} cases</h6>
    </li>
)

export default listItem
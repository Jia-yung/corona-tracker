import React from 'react'
import './ListItem.css'

const listItem = (props) => (
    <li onClick={props.clicked}>
        <div>{props.country} :</div> 
        <div><b>{props.cases} / {props.deaths}</b></div>
    </li>
)

export default listItem
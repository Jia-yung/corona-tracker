import React from 'react'
import './Card.scss'

const card = (props) => (
    <div className="cardStyle">
        {props.children}
    </div>
)

export default card
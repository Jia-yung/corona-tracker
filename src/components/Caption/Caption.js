import React from 'react'
import './Caption.css'

const caption = () => (
    <div className="caption">
        <p>
            Click 
            <span className="leftDot"></span>
            <span className="middleDot"></span>
            <span className="rightDot"></span>
            to enable/disable timeline series.
        </p>
        <p>Drag/Click on the graph for more information.</p>
        <p>Timeline is updated each day at 23:59 UTC.</p>
    </div>
)

export default caption
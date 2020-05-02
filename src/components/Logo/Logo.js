import React from 'react'
import './Logo.css'
import logoImage from '../../image/pandemic.svg';

const logo = () => (
    <div className="logoStyle">
        <p>
            <img className="logoIcon" src={logoImage} alt="Logo" align="middle" />
            COVID-19 Tracker
        </p>
    </div>
    //<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
)

export default logo
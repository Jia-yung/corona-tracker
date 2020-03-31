import React from 'react'
import './Alert.css'

const alert = () => (
    <div className="alertContainer">
        <p className="alertText">
            Your support is needed to keep this site operating.
            <a target="_blank" rel="noopener noreferrer" href="https://www.paypal.me/jiayung">
                <img className="paypalImg" align="middle" src="https://www.paypalobjects.com/webstatic/en_AU/i/buttons/btn_paywith_primary_l.png" alt="Donate now with PayPal" /> 
            </a>
        </p>
    </div>
)

export default alert
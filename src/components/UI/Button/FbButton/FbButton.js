import React from 'react';
import './FbButton.css'
const fbButton = () => (
    <div className="fbShareBtn">
        <div  className="fb-share-button" data-href="https://covid19trackeronline.com" data-layout="button_count" data-size="large">
            <a  
                target="_blank" 
                rel="noopener noreferrer" 
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovid19trackeronline.com%2F&amp;src=sdkpreparse" 
                className="fb-xfbml-parse-ignore">
                Share
            </a>
        </div>                           
    </div>
)

export default fbButton
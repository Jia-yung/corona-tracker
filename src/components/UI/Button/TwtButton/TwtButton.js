import React from 'react';
import './TwtButton.css';

const twtButton = () => (
    <div className="twitterShareBtn">
        <a className="twitter-share-button"
            data-size="large"
            rel="canonical"
            href="https://twitter.com/intent/tweet"
            data-url="https://covid19trackeronline.com"
            data-text=" "
            data-hashtags="covid19,tracker" >
            Tweet
        </a>
    </div>
)

export default twtButton


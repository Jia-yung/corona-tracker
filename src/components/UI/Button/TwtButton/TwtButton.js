import React, { Component } from 'react';
import './TwtButton.css';

class TwtButton extends Component {
    render() {
        window.twttr = (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0],
              t = window.twttr || {};
            if (d.getElementById(id)) return t;
            js = d.createElement(s);
            js.id = id;
            js.src = "https://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
          
            t._e = [];
            t.ready = function(f) {
              t._e.push(f);
            };
            return t;
        }(document, "script", "twitter-wjs"));

        return (
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
    }
}

export default TwtButton


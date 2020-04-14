import React, { Component } from 'react';
import Article from './Article/Article';

import './Articles.css';

class Articles extends Component {
    render(){
        let articles = this.props.data.map(data => {
            let img = ""
            let subAbstract = ""

            if(data.multimedia.length === 0){
                if(data.source === "AP"){
                    img = "https://apnews.com/images/ShareLogo2.png"
                } else if(data.source === "The New York Times") {
                    img = "https://pmcdeadline2.files.wordpress.com/2016/10/the-new-york-times-logo-featured.jpg?w=621"
                } else if (data.source === "Reuters"){
                    img = "https://www.reutersagency.com/wp-content/uploads/2019/06/Preview-Image.jpg"
                } else {
                    img = "https://pmcdeadline2.files.wordpress.com/2016/10/the-new-york-times-logo-featured.jpg?w=621"
                }
            } else{
                img ="https://www.nytimes.com/" + data.multimedia[0].url
            }
            
            if (data.abstract.length > 180) {
                subAbstract = data.abstract.slice(0,180) + "...."
            } else {
                subAbstract = data.abstract
            }
            return (
                <Article
                    key={data._id} 
                    year={data.pub_date.slice(0,4)}
                    month={data.pub_date.slice(5,7)}
                    day={data.pub_date.slice(8,10)}
                    hour={data.pub_date.slice(11,13)}
                    minute={data.pub_date.slice(14,16)}
                    seconds={data.pub_date.slice(17,19)}
                    title={data.headline.main} 
                    abstract={subAbstract}
                    imgURL= {img}
                    articleURL={data.web_url}
                    source={data.source}
                    date={(data.pub_date.slice(0,10))} />
            )
        })
        
        return (
            <div className="container-fluid">
                <div className="articleContainer row flex-nowrap">
                    {articles}                                
                </div>
            </div>
        )
    }
}

export default Articles

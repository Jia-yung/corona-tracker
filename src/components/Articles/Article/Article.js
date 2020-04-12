import React from 'react'
import './Article.css'
import {Col, Card} from 'react-bootstrap'

const article = (props) => {

    function timeAgo(current, previous) {
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
      
        var elapsed = current - previous;
      
        if (elapsed < msPerMinute) {
          return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
          return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
          return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
          return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
          return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
          return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }

    var dateObj = new Date();
    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var hour = dateObj.getUTCHours();
    var minute = dateObj.getUTCMinutes();
    var seconds = dateObj.getUTCSeconds();
    
    var d = new Date(year, month, day, hour, minute, seconds);
    let publishTimeAgo = timeAgo(d, new Date(props.year, props.month, props.day, props.hour, props.minute, props.seconds));

    return (
        <Col style={{padding:'0px', marginRight: '15px'}}>
            <a target="_blank" rel="noopener noreferrer" href={props.articleURL} className="linkStyle">
                <Card className="cardStyle card-block shadow-lg d-flex flex-column" bg={'dark'}>
                    <div className="image-section">
                        <Card.Img variant="top" className="articleImage rounded-0" src={props.imgURL}/>
                    </div>
                    <Card.Body className="cardBody">
                        <Card.Title className="cardTitle">{props.title}</Card.Title>
                        <Card.Text className="cardText">{props.abstract}</Card.Text>
                    </Card.Body>                
                    <div className="mt-auto publish">
                        <p className="timeAgo">{publishTimeAgo}</p>
                        <p>Source: {props.source}</p>
                    </div>
                </Card>
            </a>
        </Col>
    )
}

export default article
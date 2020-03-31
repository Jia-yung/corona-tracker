import React from 'react'
import './Article.css'
import {Col, Card} from 'react-bootstrap'

const article = (props) => (
    <Col xs={6} sm={4} md={4} lg={3} style={{padding:'0px', marginRight: '15px'}}>
        <Card className="cardStyle card-block rounded-0" bg={'dark'}>
            <a target="_blank" rel="noopener noreferrer" href={props.articleURL} className="linkStyle">
                <div className="image-section">
                    <Card.Img variant="top" className="news-image rounded-0" src={props.imgURL} />
                </div>
                <Card.Body className="cardBody">
                    <Card.Title className="cardTitle">{props.title}</Card.Title>
                    <Card.Text className="cardText align-self-end">Source: {props.source}</Card.Text>
                </Card.Body>
            </a>
        </Card>
    </Col>
)

export default article
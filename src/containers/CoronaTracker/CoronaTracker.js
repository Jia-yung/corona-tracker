import React, {Component} from 'react';
import {Container, Row, Col, Alert} from 'react-bootstrap';

//import DataMap from '../../components/DataMap/DataMap';
import DataGraph from '../../components/DataGraph/DataGraph';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner'
import ListItem from '../../components/ListItem/ListItem';
import CountryToolTip from '../../components/CountryToolTip/CountryToolTip';
import Paypal from '../../components/Paypal/Paypal';
import Article from '../../components/Article/Article';
import Logo from '../../components/Logo/Logo';

import article from '../../Articles/articles.json';
import axios from 'axios';

import './CoronaTracker.css';

class CoronaTracker extends Component {
    
    state = {
        totalCases: null,
        totalDeath: null,
        totalRecovered: null,
        selectedCountry: null,
        infectedCountry: [],
        latestNews: [],
        loading: true,
        error: false
    }
   
    componentDidMount() {
        axios.get('https://corona.lmao.ninja/all')
            .then(response => {
                this.setState({
                    totalCases: response.data.cases,
                    totalDeath: response.data.deaths, 
                    totalRecovered: response.data.recovered, 
                    loading: false})
            }).catch(error => {
                this.setState({error: error})
            });

        axios.get('https://corona.lmao.ninja/countries?sort=cases')
            .then(response => {
                this.setState({infectedCountry: response.data.sort((a,b) => b - a)})
            }).catch(error => {
                this.setState({error: error})
            });
        
        axios.get('https://newsapi.org/v2/everything?q=COVID&from=2020-03-16&sortBy=publishedAt&apiKey=ad674d6b8efd4b36a15265dde126606e&pageSize=100&page=1%27%20-%20Google%20Search')
            .then(response => {
                const news = response.data.articles.slice(0,8)
                this.setState({latestNews: news})
            }).catch(error => {
                this.setState({error: error})
            });
    }

    countrySelectHandler = (country) => {
        this.setState({selectedCountry: country});
        //console.log(this.state.selectedCountry)
    }

    render () {
        const countriesData = 'https://corona.lmao.ninja/countries?sort=cases';       
        
        let spinner = <Spinner />
        let infected = null;
        let death = null;
        let recovered = null;
        
        if(this.state.loading) {
            infected = spinner
            death  = spinner
            recovered = spinner
        }

        if(this.state.totalCases) {
            infected = <Modal figure={this.state.totalCases} title={"Infected"} status={"Warning"} />
            death = <Modal figure={this.state.totalDeath} title={"Death"} status={"Danger"} />
            recovered = <Modal figure={this.state.totalRecovered} title={"Recovered"} status={"Success"} />
        }


        let item = this.state.infectedCountry.map(data => {
            return (
                <ListItem 
                    key={data.country}
                    country={data.country}
                    cases={data.cases}
                    deaths={data.deaths}
                    clicked={() => this.countrySelectHandler(data.country)} />
            )
        })

        let articles = article.article.slice(0, 10).map(data => {
            return (
                <Article
                    key={data.source.id} 
                    title={data.title} 
                    description={data.description}
                    imgURL={data.urlToImage}
                    articleURL={data.url}
                    source={data.source.name} />
            )
        })
        
        let countryToolTip = this.state.infectedCountry.map(data => {
            return (
                <CountryToolTip 
                    key={data.country} 
                    country={data.country} 
                    flag={data.countryInfo.flag}
                    clicked={() => this.countrySelectHandler(data.country)} />
            )
        })
      
        return (
            <Container fluid className="main">
                <Row>
                    <Col xs={12}>
                        <Alert className="alertContainer">
                            Your support is needed to keep this site operating.<Paypal/>                            
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Logo />
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        <div className="modalContainer">
                            {recovered}
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="modalContainer">
                            {infected}
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="modalContainer">
                            {death}
                        </div>
                    </Col>                
                </Row>
                <Row>
                    <Col md={12}>
                        <h4 className="subTitle">Countries Affected</h4>
                        <div className="toolTipContainer">
                            {countryToolTip}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>                        
                        <h4 className="subTitle">Select a country to display cummulative data</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}> 
                        <div className="listItemContainer">
                            <p>Infected / Death</p>
                            <h6 style={{textAlign: "left"}}>Country: </h6>
                            <div className="ulContainer">
                                <ul className="itemStyle">
                                    {item}                      
                                </ul>
                            </div>
                        </div>                       
                    </Col>
                    <Col md={9}>
                        <DataGraph countryName={this.state.selectedCountry} />
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <h4 className="subTitle">Related Articles</h4>
                        <div className="container-fluid">
                            <div className="articleContainer row flex-nowrap">
                                {articles}                                
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}> 
                        <h4 className="subTitle">Countries Data</h4>                  
                        <DataTable url={countriesData} />                    
                    </Col>
                </Row>               
            </Container>
        )
    }
}

export default CoronaTracker;
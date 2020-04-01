import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';

import DataMap from '../../components/DataMap/DataMap';
import DataGraph from '../../components/DataGraph/DataGraph';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner'
import ListItem from '../../components/ListItem/ListItem';
import CountryToolTip from '../../components/CountryToolTip/CountryToolTip';
import Alert from '../../components/Alert/Alert';
import Article from '../../components/Article/Article';
import Logo from '../../components/Logo/Logo';

import data from '../../../src/country.json'
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
        const totalInfectionRequest = axios.get('https://corona.lmao.ninja/all')
        const allCountryInfectionRequest = axios.get('https://corona.lmao.ninja/countries?sort=country')

        axios.all([totalInfectionRequest, allCountryInfectionRequest])
            .then(axios.spread((...response) => {
                this.setState({
                    totalCases: response[0].data.cases,
                    totalDeath: response[0].data.deaths, 
                    totalRecovered: response[0].data.recovered, 
                    infectedCountry: response[1].data.reverse()
                })
            })).catch(error => {
                this.setState({error: true})
            })

        // axios.get('https://corona.lmao.ninja/all')
        //     .then(response => {
        //         this.setState({
        //             totalCases: response.data.cases,
        //             totalDeath: response.data.deaths, 
        //             totalRecovered: response.data.recovered, 
        //             loading: false})
        //     }).catch(error => {
        //         this.setState({error: error})
        //     });

        // axios.get('https://corona.lmao.ninja/countries?sort=cases')
        //     .then(response => {
        //         this.setState({infectedCountry: response.data})
        //     }).catch(error => {
        //         this.setState({error: error})
        //     });
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
            infected = <Modal figure={this.state.totalCases} showSpinner={true} title={"Infected"} status={"Warning"}>{spinner}</Modal>
            death  = <Modal figure={this.state.totalDeath} showSpinner={true} title={"Death"} status={"Danger"} >{spinner}</Modal>
            recovered = <Modal figure={this.state.totalRecovered} showSpinner={true} title={"Recovered"} status={"Success"}>{spinner}</Modal>
        }

        if(this.state.totalCases) {
            infected = <Modal figure={this.state.totalCases} showSpinner={false} title={"Infected"} status={"Warning"} />
            death = <Modal figure={this.state.totalDeath} showSpinner={false} title={"Death"} status={"Danger"} />
            recovered = <Modal figure={this.state.totalRecovered} showSpinner={false} title={"Recovered"} status={"Success"} />
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
                        <Alert />                            
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Logo />
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        {recovered}
                    </Col>
                    <Col xs={4}>
                        {infected}
                    </Col>
                    <Col xs={4}>
                        {death}
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
                    <div className="mapContainer">
                        <DataMap data={data} property="pop_est" infections={this.state.infectedCountry} />
                    </div>
                </Row>
                <Row>
                    <Col md={12}>                        
                        <h4 className="subTitle">Select a country to display cummulative data</h4>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}> 
                        <div className="listItemContainer">
                            <p>Total Cases</p>
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
                        <p className="caption" style={{textAlign: 'right'}}>Click category to enable/disable timeline series</p>
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
                        <h6 className="contentText">Click the column header to sort.</h6>                
                        <DataTable url={countriesData} />                    
                    </Col>
                </Row> 
                <Row>
                    <Col xs={12}>
                        <Alert/>                            
                    </Col>
                </Row>              
            </Container>
        )
    }
}

export default CoronaTracker;
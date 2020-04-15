import React, {Component} from 'react';
import {Container, Row, Col, DropdownButton, Dropdown} from 'react-bootstrap';

import Graph from '../Graph/Graph';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner'
import FbButton from '../../components/UI/Button/FbButton/FbButton'
import TweetButton from '../../components/UI/Button/TwtButton/TwtButton'
import ListItem from '../../components/ListItem/ListItem';
import CountryToolTip from '../../components/CountryToolTip/CountryToolTip';
import Alert from '../../components/Alert/Alert';
import Articles from '../Articles/Articles';
import Logo from '../../components/Logo/Logo';
import EarthLogo from '../../Images/worldwide.svg';
import Disclaimer from '../../components/Disclaimer/Disclaimer'
import Map from '../Map/Map.js';

import axios from 'axios';
import './CoronaTracker.css';

class CoronaTracker extends Component {
    state = {
        totalCases: null,
        totalDeath: null,
        totalRecovered: null,
        selectedCountry: null,
        infectedCountry: [],
        sort: "country",
        loading: true,
        error: false
    }
    
    componentDidMount() {
        const totalInfectionRequest = axios.get('https://corona.lmao.ninja/all')
        const allCountryInfectionRequest = axios.get('https://corona.lmao.ninja/countries?sort='  + this.state.sort)
        axios.all([totalInfectionRequest, allCountryInfectionRequest])
            .then(axios.spread((...response) => {
                this.setState({
                    totalCases: response[0].data.cases,
                    totalDeath: response[0].data.deaths, 
                    totalRecovered: response[0].data.recovered, 
                    infectedCountry: response[1].data.reverse(),
                })
            })).catch(error => {
                this.setState({error: true})
            }) 
    }

    countrySelectHandler = (country) => {
        this.setState({selectedCountry: country});
    }

    compareValues = (key, order = "asc") => {
        return function innerSort(a, b) {
          if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
          }
      
          const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];
      
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
    }

    sortHandler = (type) => {
        this.setState({sort: type})
        if (type === "country") {
            this.state.infectedCountry.sort(this.compareValues(type, 'asc'))
        } else {
            this.state.infectedCountry.sort(this.compareValues(type, 'desc'))
        }
    }

    render () { 
        let spinner = <Spinner />
        let infected = null;
        let death = null;
        let recovered = null;
        
        if(this.state.loading) {
            infected = <Modal figure={0} showSpinner={true} title={"Infected"} status={"Warning"}>{spinner}</Modal>
            death  = <Modal figure={0} showSpinner={true} title={"Death"} status={"Danger"} >{spinner}</Modal>
            recovered = <Modal figure={0} showSpinner={true} title={"Recovered"} status={"Success"}>{spinner}</Modal>
        }

        if(this.state.totalCases) {
            infected = <Modal figure={this.state.totalCases} showSpinner={false} title={"Infected"} status={"Warning"} />
            death = <Modal figure={this.state.totalDeath} showSpinner={false} title={"Deaths"} status={"Danger"} />
            recovered = <Modal figure={this.state.totalRecovered} showSpinner={false} title={"Recovered"} status={"Success"} />
        }
    
        let item = this.state.infectedCountry.map(data => {
            return (
                <ListItem 
                    key={data.country}
                    country={data.country}
                    cases={data.cases}
                    deaths={data.deaths}
                    recovered={data.recovered}
                    sortBy={this.state.sort}
                    flag={data.countryInfo.flag}
                    clicked={() => this.countrySelectHandler(data.country)} />
            )
        })
        
        let countryToolTip = this.state.infectedCountry.map(data => {
            return (
                <CountryToolTip 
                    key={data.country} 
                    country={data.country} 
                    flag={data.countryInfo.flag} />
            )
        })

        return (
            <Container fluid className="main">
                <div className="mainHolder">
                    <Row>
                        <Col xs={12}>
                            <Alert /> 
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={7}>
                            <Logo />
                        </Col>
                        <Col xs={12} sm={5}>
                            <div className="socialContainer">
                                <TweetButton />
                                <FbButton />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="modalLeft">
                            {recovered}
                        </Col>
                        <Col xs={4} className="modalMiddle">
                            {infected}
                        </Col>
                        <Col xs={4} className="modalRight">
                            {death}
                        </Col>                
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <h4 className="subTitle">Countries Affected</h4>
                            <div className="toolTipContainer">
                                {countryToolTip}
                            </div>
                        </Col>
                    </Row>
                    <Map/>
                    <Row>
                        <Col md={12}>                        
                            <h4 className="subTitle">
                                Select a country to display cummulative graph
                            </h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}> 
                            <div className="listContainer">
                                <p>Country</p>
                                <div className="listContainerBtn">
                                    <h5 className="globalBtn" onClick={() => this.countrySelectHandler("Global")}>
                                        <img src={EarthLogo} alt="Globe" align="middle" />
                                        Global  
                                        {/*Icons made by <a href="https://www.flaticon.com/authors/turkkub" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/}
                                    </h5>
                                    <DropdownButton className="sortBtn" title="Sort by" size="sm">
                                        <Dropdown.Item onClick={() => this.sortHandler("country")}>Country Name</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.sortHandler("cases")}>Infection</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.sortHandler("deaths")}>Death</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.sortHandler("recovered")}>Recovered</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                                <div className="ulContainer">
                                    <ul className="itemStyle">
                                        {item}                      
                                    </ul>
                                </div>
                            </div>                       
                        </Col>
                        <Col md={9}>
                            <Graph countryName={this.state.selectedCountry}/>                           
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <h4 className="subTitle">Latest Articles</h4>
                            <Articles />                                
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}> 
                            <h4 className="subTitle">Affected Countries List</h4>  
                            <h6 className="contentText">Click the column header to sort.</h6>                
                            <DataTable />                    
                        </Col>
                    </Row> 
                    <Row>
                        <Col xs={12}>
                            <Disclaimer />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Alert/>                            
                        </Col>
                    </Row>              
                </div>
            </Container>
        )
    }
}

export default CoronaTracker;
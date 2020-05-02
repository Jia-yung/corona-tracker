//libraries
import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import axios from 'axios';

//components
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import FbButton from '../../components/UI/Button/FbButton/FbButton';
import TweetButton from '../../components/UI/Button/TwtButton/TwtButton';
import CountryToolTip from '../../components/CountryToolTip/CountryToolTip';
import Alert from '../../components/Alert/Alert';
import Logo from '../../components/Logo/Logo';
import Disclaimer from '../../components/Disclaimer/Disclaimer';
import flag from '../../flag/flag.json';

//containers
import Articles from '../Articles/Articles';
import Map from '../Map/Map';
import ComparisonGraph from '../Graph/ComparisonGraph/ComparisonGraph';
import SelectionGraph from '../Graph/SelectionGraph/Selection';

//stylings
import './CoronaTracker.css';

class CoronaTracker extends Component {
    state = {
        totalCases: null,
        totalDeath: null,
        totalRecovered: null,
        todayCases: null,
        todayDeaths: null,
        infectedCountry: [],
        loading: true,
        getAllError: false,
        getCountryError:false
    }
    
    componentDidMount() {
        axios.get('https://corona.lmao.ninja/v2/all?')
            .then(response => {
                this.setState({
                    totalCases: response.data.cases,
                    totalDeath: response.data.deaths, 
                    totalRecovered: response.data.recovered,
                    todayCases: response.data.todayCases,
                    todayDeaths: response.data.todayDeaths,
                    loading: false
                })
            }).catch(error => {
                this.setState({getAllError: true})
            })  
        
        axios.get('https://corona.lmao.ninja/v2/jhucsse')
            .then(response => {
                let check = []
                let infectedCountry = []

                for(let x = 0; x < response.data.length ; x++){                    
                    if(!check.includes(response.data[x].country)){
                        check.push(response.data[x].country)
                        let img = ""
                        for (let j = 0; j < flag.length; j++) {
                            if(response.data[x].country === flag[j].country){
                                img = flag[j].countryInfo.flag
                            }
                        }
                        infectedCountry.push({"country":response.data[x].country, "flag":img})     
                    }
                }
                this.setState({infectedCountry: infectedCountry})
            }).catch(error => {
                this.setState({getCountryError: true})
            }) 
    }

    render () { 
        let spinner = <Spinner />
        let infected = null;
        let death = null;
        let recovered = null;
        
        if(this.state.loading) {
            infected = <Modal figure={0} showSpinner={true} today={1} title={"Infected"} status={"infected"}>{spinner}</Modal>
            death  = <Modal figure={0} showSpinner={true}  today={1} title={"Death"} status={"death"} >{spinner}</Modal>
            recovered = <Modal figure={0} showSpinner={true}  today={0} title={"Recovered"} status={"recovered"}>{spinner}</Modal>
        }

        if(this.state.totalCases) {
            infected = <Modal figure={this.state.totalCases} today={this.state.todayCases} showSpinner={false} title={"Infected"} status={"infected"} />
            death = <Modal figure={this.state.totalDeath} today={this.state.todayDeaths} showSpinner={false} title={"Deaths"} status={"death"} />
            recovered = <Modal figure={this.state.totalRecovered} today={0} showSpinner={false} title={"Recovered"} status={"recovered"} />
        }
           
        let countryToolTip = this.state.infectedCountry.map(data => {
            return (
                <CountryToolTip 
                    key={data.country} 
                    country={data.country} 
                    flag={data.flag} />
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
                    <SelectionGraph infected={this.state.totalCases} recovered={this.state.totalRecovered} death={this.state.totalDeath}  />
                    <ComparisonGraph /> 
                    <Row>
                        <Col xs={12}>
                            <h4 className="subTitle">Time-lapse Data Visualisation</h4>                 
                            <div className="racingChart flourish-embed flourish-bar-chart-race" data-src="visualisation/2009352" data-url="https://flo.uri.sh/visualisation/2009352/embed"></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <h4 className="subTitle">Latest Articles</h4>
                        </Col>
                    </Row>
                    <Articles />                                
                    <Row>
                        <Col xs={12}> 
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
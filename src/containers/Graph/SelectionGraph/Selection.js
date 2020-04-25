import React, { Component} from "react";
import {Row, Col, DropdownButton, Dropdown, Button} from 'react-bootstrap';
import EarthLogo from '../../../Images/worldwide.svg';
import ListItem from '../../../components/ListItem/ListItem';
import Spinner from '../../../components/UI/Spinner/Spinner';
import DailyGraph from './DailyGraph/DailyGraph'
import SumGraph from './SumGraph/SumGraph';
import RadialGraph from './RadialGraph/RadialGraph';

import './Selection.css';
import axios from "axios";

class Graph extends Component {
    state = {
        sort: "country",
        infectedCountry: [],
        selectedCountry: "Country",
        infected:0,
        recovered: 0,
        death:0,
        error: false,
        loading:true,
    };

    componentDidMount() {
        axios.get("https://corona.lmao.ninja/v2/countries?sort=country")
            .then(response => {
                this.setState({
                    error: false,
                    loading:false,
                    infectedCountry: response.data.reverse()
                })
        }).catch(error => {
            this.setState({error: true})
        }) 
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

    countrySelectHandler = (country, infections, deaths, recoveries) => {
        this.setState({selectedCountry: country});
        this.setState({infected:infections})
        this.setState({death:deaths})
        this.setState({recovered:recoveries})
    }

    render() {
        let item = null
        if(this.state.error) {
            item = <h5>Error loading country . . .</h5>
        } else if(this.state.loading) {
            item = <Spinner />
        } else if (!this.state.loading)  {
            item = this.state.infectedCountry.map(data => {
                return (
                    <ListItem 
                        key={data.country}
                        country={data.country}
                        cases={data.cases}
                        deaths={data.deaths}
                        recovered={data.recovered}
                        sortBy={this.state.sort}
                        flag={data.countryInfo.flag}
                        clicked={() => this.countrySelectHandler(data.country, data.cases, data.deaths, data.recovered)} />
                )
            })
        } 

        return (
            <div>
                <Row>
                    <Col xs={12} md={3} className="countryListColumn"> 
                        <h4 className="subTitle">
                            Overview
                        </h4>
                        <div className="listContainer">
                            <p>Country</p>
                            <div className="listContainerBtn">
                                <Button className="globalBtn" size="sm" variant="secondary" onClick={() => this.countrySelectHandler("World", this.props.infected, this.props.death, this.props.recovered)}>
                                    <img src={EarthLogo} alt="Globe" align="middle" />
                                    World  
                                    {/*Icons made by <a href="https://www.flaticon.com/authors/turkkub" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/}
                                </Button>
                                <DropdownButton className="sortBtn" title="Sort" variant="secondary" size="sm">
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
                        <Row>
                            <Col xs={12}>
                                <h4 className="radialGraphTitle" >{this.state.selectedCountry + " - Rate"}</h4>
                            </Col>
                            <Col xs={6} md={12}>
                                <RadialGraph countryName={this.state.selectedCountry} infected={this.state.infected} data={this.state.recovered} category="Recovery" color="#00E396" />                      
                            </Col>
                            <Col xs={6} md={12}>
                                <RadialGraph countryName={this.state.selectedCountry} infected={this.state.infected} data={this.state.death} category="Fatality" color="#FF4560" />                      
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} md={9}>
                        <Row>
                            <Col md={12}>
                                <SumGraph countryName={this.state.selectedCountry} />
                            </Col>
                            <Col md={12}>
                                <DailyGraph countryName={this.state.selectedCountry} />
                            </Col>
                        </Row>
                        <div className="caption">
                            <p>Drag/Click on the graph for more information.</p>
                            <p>Timeline is updated each day at 23:59 UTC.</p>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Graph;
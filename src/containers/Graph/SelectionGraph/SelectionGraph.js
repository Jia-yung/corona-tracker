import React, { Component} from "react";
import {Row, Col, DropdownButton, Dropdown} from 'react-bootstrap';
import EarthLogo from '../../../Images/worldwide.svg';
import ListItem from '../../../components/ListItem/ListItem';
import DailyGraph from './DailyGraph/DailyGraph.js'
import './SelectionGraph.css';
import axios from "axios";
import SumGraph from "./SumGraph/SumGraph";

class Graph extends Component {
    state = {
        countryName: null,
        selectedCountry: null,
        graphType: "Cummulative",
        infectedCountry: [],
        countryListError: false,
        sort: "country",
        loading:true,
    };

    componentDidMount() {
        axios.get("https://corona.lmao.ninja/v2/countries?sort=country")
        .then(response => {
            this.setState({
                infectedCountry: response.data.reverse()
            })
        }).catch(error => {
            this.setState({countryListError: true})
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

    countrySelectHandler = (country) => {
        this.setState({selectedCountry: country});
    }

    render() {
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

        return (
            <div>
                <Row>
                    <Col xs={12} md={3}> 
                    <h4 className="subTitle">
                            Data Graph
                        </h4>
                        <div className="listContainer">
                            <p>Country</p>
                            <div className="listContainerBtn">
                                <h5 className="globalBtn" onClick={() => this.countrySelectHandler("Global")}>
                                    <img className="globe" src={EarthLogo} alt="Globe" align="middle" />
                                    Global  
                                    {/*Icons made by <a href="https://www.flaticon.com/authors/turkkub" title="turkkub">turkkub</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/}
                                </h5>
                                <DropdownButton className="sortBtn" title="Sort by" variant="secondary" size="sm">
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
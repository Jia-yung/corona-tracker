import React, { Component } from "react";
import {Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';

import GlobalMap from '../../components/DataMap/GlobalMap';
import CountryMap from '../../components/DataMap/CountryMap';

import mapList from '../../../src/Maps/mapList.json';
import globalGeoData from '../../../src/Maps/GeoData/global.json'
import usaGeoData from '../../../src/Maps/GeoData/usa.json'
import canadaGeoData from '../../../src/Maps/GeoData/canada.json'
import australiaGeoData from '../../../src/Maps/GeoData/australia.json'

import './Map.css';
import axios from 'axios';

class Map extends Component {
    state = {
        infectedProvince: [],
        infectedCountry: [],
        selectedMap: "World",
        error: false
    }

    componentDidMount(){
        axios.get('https://corona.lmao.ninja/v2/jhucsse')
        .then(response => {
            this.setState({
                infectedProvince: response.data
            })
        }).catch(error => {
            this.setState({error: true})
        })  
        
        axios.get("https://corona.lmao.ninja/countries?sort=cases")
        .then(response => {
            this.setState({
                infectedCountry: response.data
            })
        }).catch(error => {
            this.setState({error: true})
        }) 
    }

    mapSelectHandler = (map) => {
        this.setState({selectedMap: map})
    }

    render() {
        var map;
        switch (this.state.selectedMap) {
            case "World":
                map = <GlobalMap data={globalGeoData} infectedCountry={this.state.infectedCountry}/>
                break;
            case "Australia":
                map = <CountryMap data={australiaGeoData} infectedProvince={this.state.infectedProvince} scale3={100} scale4={500} scale5={1000} scale6={5000}/>
                break;
            case "Canada":
                map = <CountryMap data={canadaGeoData} infectedProvince={this.state.infectedProvince} scale3={100} scale4={1000} scale5={5000} scale6={10000}/>
                break;
            case "USA":
                map =  <CountryMap data={usaGeoData} infectedProvince={this.state.infectedProvince} scale3={1000} scale4={5000} scale5={10000} scale6={100000}/>
                break;
            default:
                map = <GlobalMap data={globalGeoData} infectedCountry={this.state.infectedCountry}/>
                break;
        }

        let countryMapList = mapList.map(data => {
            let img = ""
            if(data.country !== "World"){
                img = <img height="15px" width="25px" className="dropdownBtnFlag" src={data.countryInfo.flag} alt=""/>
            } else {
                img = <img height="20px" width="20px" className="dropdownBtnFlag" src={require("../../Images/worldwide.svg")} alt=""/>
            }
            return (
                <Dropdown.Item 
                    key={data.countryInfo._id}
                    onClick={() => this.mapSelectHandler(data.country)}>
                    {img}
                    {data.country}
                </Dropdown.Item>
            )
        })
        
        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <div style={{display: 'inline'}}>
                            <DropdownButton alignRight className="countryMapBtn" title={this.state.selectedMap + " Map"} size="sm">
                                {countryMapList}
                            </DropdownButton>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {map}
                    </Col> 
                </Row>
            </div>
        )
    }
}

export default Map;
//libraries
import React, { Component } from "react";
import {Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';
import axios from 'axios';

//components
import GlobalMap from '../../components/DataMap//DataMap/GlobalMap';
import CountryMap from '../../components/DataMap/DataMap/CountryMap';

//data
import mapList from '../../../src/map/MapList/mapList.json';
import globalGeoData from '../../../src/map/GeoData/global.json';
import usaGeoData from '../../../src/map/GeoData/usa.json';
import canadaGeoData from '../../../src/map/GeoData/canada.json';
import australiaGeoData from '../../../src/map/GeoData/australia.json';
import chinaGeoData from '../../../src/map/GeoData/china.json';

//images
import worldImg from '../../image/worldwide.svg';

//stylings
import './Map.css';

class Map extends Component {
    state = {
        infectedProvince: [],
        infectedCountry: [],
        selectedMap: "World",
        error: false
    }

    componentDidMount(){
        //for country by province
        axios.get('https://corona.lmao.ninja/v2/jhucsse')
        .then(response => {
            this.setState({
                infectedProvince: response.data
            })
        }).catch(error => {
            this.setState({error: true})
        })  
        //for worldwide
        axios.get("https://corona.lmao.ninja/v2/countries?sort=cases")
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
            case "China":
                map =  <CountryMap data={chinaGeoData} infectedProvince={this.state.infectedProvince} scale3={1000} scale4={5000} scale5={10000} scale6={50000}/>
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
                img = <img height="20px" width="20px" className="dropdownBtnFlag" src={worldImg} alt=""/>
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
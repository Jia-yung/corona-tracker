import React, { Component} from "react";
import {Row, Col, DropdownButton, Dropdown} from 'react-bootstrap';
import EarthLogo from '../../../Images/worldwide.svg';
import ListItem from '../../../components/ListItem/ListItem';
import Chart from "react-apexcharts";
import Caption from '../../../components/Caption/Caption';
import './SelectionGraph.css';
import axios from "axios";

class Graph extends Component {
    state = {
        countryName: null,
        selectedCountry: null,
        infectedCountry: [],
        error: false,
        sort: "country",
        options: {
            chart: {
                zoom: {
                    enabled: false
                },
                stacked: false,
                toolbar: {
                    show: false
                }
            },
            colors: ["#FEB01A", "#00E396", "#FF4560"],
            legend: {
                show: true,
                labels: {
                    colors: 'white'
                }
            },
            xaxis: {
                type: 'datetime',
                categories: [],
                labels: {
                    show: true,
                    style: {
                        colors: 'white'
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: 'white'
                    }
                }
            },
            title: {
                text: "Select a country",
                align: 'Center',
                style: {
                    color: 'white',
                    fontSize: '20px'
                }
            },
            tooltip: {
                theme: 'dark',
            },
        },
        series: [{
            name:'Infected',
            type: 'line',
            data: [],
        },{
            name:'Recovered',
            type: 'line',
            data: []
        },{
            name:'Death',
            type: 'line',
            data: []
        }]
    };

    componentDidMount() {
        axios.get("https://corona.lmao.ninja/v2/countries?sort=country")
        .then(response => {
            this.setState({
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

    countrySelectHandler = (country) => {
        this.setState({selectedCountry: country});
        
        let request= null

        if (country !== "Global"){
            request = country
        } else {
            request = "all"
        }
        this.getData(request)
    }
    
    getData = (request) => {
        axios.get("https://corona.lmao.ninja/v2/historical/" + request + "/?lastdays=all").then(response => {
            let historicDataInfected = null
            let historicDataDeath = null
            let historicDataRecovered = null
            if(request !== "all"){
                historicDataInfected = response.data.timeline.cases
                historicDataDeath = response.data.timeline.deaths
                historicDataRecovered = response.data.timeline.recovered
            } else {
                historicDataInfected = response.data.cases
                historicDataDeath = response.data.deaths
                historicDataRecovered = response.data.recovered
            }
            
            const dateArray = [], infectedArray = [], deathArray = [], recoveredArray = []
            
            for (const key of Object.keys(historicDataInfected)) {
                dateArray.push(key + " GMT")
                infectedArray.push(historicDataInfected[key])
            }
            for (const key of Object.keys(historicDataDeath)) {
                deathArray.push(historicDataDeath[key])
            }
            for (const key of Object.keys(historicDataRecovered)) {
                recoveredArray.push(historicDataRecovered[key])
            }
            this.setState({
                options: {
                    title: {
                        text: this.state.selectedCountry.toUpperCase(),
                    },
                    xaxis: {
                        categories: dateArray
                    }                         
                },
                series: [{
                    data: infectedArray  
                },{
                    data: recoveredArray                   
                },{
                    data: deathArray                   
                }]
            })            
        }).catch(error => {
            this.setState({
                error: true,
                options: {
                    title: {
                        text: this.state.selectedCountry.toUpperCase() + " - No Data",
                    }                     
                },
                series: [{
                    name:'Infected',
                    type: 'line',
                    data: [],
                },{
                    name:'Recovered',
                    type: 'line',
                    data: []
                },{
                    name:'Death',
                    type: 'line',
                    data: []
                }]
            })
        });
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
                    <div className="chartContainer">            
                        <div className="mixed-chart">
                            <Chart
                                options={this.state.options}
                                series={this.state.series} 
                                type="line"                  
                                width="100%"
                                height="300px"/>
                        </div>
                    </div>
                    <Caption/>
                </Col>
            </Row>
        )
    }
}

export default Graph;
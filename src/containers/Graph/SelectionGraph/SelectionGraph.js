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
        graphType: "Linear",
        infectedCountry: [],
        infectedHistory: [],
        deathHistory: [],
        recoveredHistory: [],
        countryListError: false,
        getDataError: false,
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
            stroke: {
                width: 4    
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
            markers: {
                showNullDataPoints:false
            },
            yaxis: {
                showAlways:true,
                labels: {
                    style: {
                        colors: 'white'
                    }
                },
                logarithmic: false
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

    graphHandler = (type) => {
        if (type === "logarithmic") {
            this.setState({graphType: "Logarithmic", logarithmic: true})
            if (this.state.selectedCountry) {
                this.computeGraph(this.state.deathHistory, this.state.infectedHistory, this.state.recoveredHistory, true)
            }
        } else if (type === "linear") {
            this.setState({graphType: "Linear", logarithmic: false})
            if (this.state.selectedCountry) {
                this.computeGraph(this.state.deathHistory, this.state.infectedHistory, this.state.recoveredHistory, false)
            }
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
        this.getData(request, this.state.logarithmic)
    }

    computeGraph = (Death, Infected, Recovered, log) => {
        const dateArray = [], infectedArray = [], deathArray = [], recoveredArray = []
        if(!this.state.error) {
            for (const key of Object.keys(Infected)) {
                dateArray.push(key + " GMT")
                if (Infected[key] === 0 && log){
                    infectedArray.push(null)
                } else {
                    infectedArray.push(Infected[key])
                }
            }
            for (const key of Object.keys(Death)) {
                if (Death[key] === 0 && log){
                    deathArray.push(null)
                } else {
                    deathArray.push(Death[key])
                }
            }
            for (const key of Object.keys(Recovered)) {
                if (Recovered[key] === 0 && log){
                    recoveredArray.push(null)
                } else {
                    recoveredArray.push(Recovered[key])
                }
            }
            this.setState({
                options: {
                    title: {
                        text: this.state.selectedCountry.toUpperCase(),
                    },
                    xaxis: {
                        categories: dateArray
                    },
                    yaxis: {
                        tickAmount: 4,
                        showAlways: true,
                        labels: {
                            style: {
                                colors: 'white'
                            }
                        },
                        logarithmic: log,
                    },                
                },
                series: [{
                    data: infectedArray  
                },{
                    data: recoveredArray                   
                },{
                    data: deathArray                   
                }]
            })          
        } else {
            this.setState({
                options: {
                    title: {
                        text: this.state.selectedCountry.toUpperCase() + " - No Data",
                    }              
                }, 
                yaxis: {
                    show:true,
                    showAlways: true,
                    labels: {
                        style: {
                            colors: 'white'
                        }
                    }
                },  
                series: [{
                    data: [] 
                },{
                    data: []                  
                },{
                    data: []                
                }]
            })    
        }
    }
    
    getData = (request, graph) => {
        axios.get("https://corona.lmao.ninja/v2/historical/" + request + "/?lastdays=all").then(response => {
            this.setState({getDataError:false})
            if(request !== "all"){
                this.setState({
                    infectedHistory: response.data.timeline.cases,
                    deathHistory: response.data.timeline.deaths,
                    recoveredHistory: response.data.timeline.recovered
                })
            } else {
                this.setState({
                    infectedHistory: response.data.cases,
                    deathHistory: response.data.deaths,
                    recoveredHistory: response.data.recovered
                })
            }
            this.computeGraph(this.state.deathHistory, this.state.infectedHistory, this.state.recoveredHistory, graph)           
        }).catch(error => {
            this.setState({
                getDataError: true,
                infectedHistory: [],
                deathHistory: [],
                recoveredHistory: []
            })
            this.computeGraph([], [], [], graph)
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
            <div>
                <Row>
                    <Col xs={12} sm={8}> 
                        <h4 className="subTitle">
                            Select a country to display graph
                        </h4>
                    </Col>
                    <Col xs={12} sm={4}>
                        <DropdownButton className="graphBtn" title={this.state.graphType} size="sm">
                            <Dropdown.Item onClick={() => this.graphHandler("linear")}>Linear</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.graphHandler("logarithmic")}>Logarithmic</Dropdown.Item>
                        </DropdownButton>        
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
                    <Col md={9}>
                        <div className="selectionChartContainer">            
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
            </div>
        )
    }
}

export default Graph;
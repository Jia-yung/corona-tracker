import React, { Component} from "react";
import Chart from "react-apexcharts";
import {DropdownButton, Dropdown} from 'react-bootstrap';
import './SumGraph.css';
import axios from "axios";

class SumGraph extends Component {
    state = {
        countryName: null,
        selectedCountry: null,
        graphType: "Cummulative",
        infectedHistory: [],
        deathHistory: [],
        recoveredHistory: [],
        getDataError: false,
        loading:true,
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
                },
                onItemClick: {
                    toggleDataSeries: false
                },
                onItemHover: {
                    highlightDataSeries:true
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

    componentDidUpdate (prevProps) {
        if (prevProps.countryName !== this.props.countryName){ 
            if (this.props.countryName !== "Global") {
                this.setState({selectedCountry: this.props.countryName})
                this.getData(this.props.countryName, this.state.logarithmic)
            } else {
                this.setState({selectedCountry: "Global"})
                this.getData("all", this.state.logarithmic)
            }
        }
    }

    graphHandler = (type) => {
        if (type === "logarithmic") {
            this.setState({graphType: "Logarithmic", logarithmic: true})
            if (this.state.selectedCountry) {
                this.computeGraph(this.state.deathHistory, this.state.infectedHistory, this.state.recoveredHistory, true)
            }
        } else if (type === "cummulative") {
            this.setState({graphType: "Cummulative", logarithmic: false})
            if (this.state.selectedCountry) {
                this.computeGraph(this.state.deathHistory, this.state.infectedHistory, this.state.recoveredHistory, false)
            }
        }
    }

    countrySelectHandler = (country) => {
        this.setState({selectedCountry: country});

        if (country !== "Global"){
            this.getData(country, this.state.logarithmic)
        } else {
            this.getData("all", this.state.logarithmic)
        }
    }

    computeGraph = (Death, Infected, Recovered, log) => {
        const dateArray = [], infectedArray = [], deathArray = [], recoveredArray = []
        if(!this.state.getDataError) {
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
                        text: this.state.selectedCountry + " - Total",
                    },
                    xaxis: {
                        categories: dateArray
                    },
                    yaxis: {
                        tickAmount: 4,
                        showAlways: true,
                        logarithmic: log,
                        labels: {
                            style: {
                                colors: 'white'
                            }
                        }
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
                        text: this.state.selectedCountry + " - No Data",
                    }              
                }, 
                yaxis: {
                    show:true,
                    showAlways: true,
                    tickAmount:4,
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
            this.setState({loading:true})          
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
        return (
            <div>
                <DropdownButton className="graphBtn" title={this.state.graphType} size="sm">
                    <Dropdown.Item onClick={() => this.graphHandler("cummulative")}>Cummulative</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.graphHandler("logarithmic")}>Logarithmic</Dropdown.Item>
                </DropdownButton>        
                <div className="selectionChartContainer">            
                    <div className="mixed-chart">
                        <Chart
                            options={this.state.options}
                            series={this.state.series} 
                            type="line"                  
                            width="100%"
                            height="275px"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default SumGraph;
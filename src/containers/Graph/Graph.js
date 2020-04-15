import React, { Component } from "react";
import Chart from "react-apexcharts";
import './Graph.css';
import axios from "axios";

class Graph extends Component {
    state = {
        countryName: null,
        error: false,
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

    componentDidUpdate (prevProps) {
        if (prevProps.countryName !== this.props.countryName){ 
            let request= null
            if (this.props.countryName !== "Global"){
                request = this.props.countryName
            } else {
                request = "all"
            }
            this.getData(request)
        }
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
                        text: this.props.countryName.toUpperCase(),
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
                        text: this.props.countryName.toUpperCase() + " - No Data",
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
        return (
            <div>
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
                <div className="caption">
                    <p>
                        Click 
                        <span className="leftDot"></span>
                        <span className="middleDot"></span>
                        <span className="rightDot"></span>
                        to enable/disable timeline series.
                    </p>
                    <p>Drag/Click on the graph for more information.</p>
                    <p>Timeline is updated each day at 23:59 UTC.</p>
                </div>
            </div>
        )
    }
}

export default Graph;
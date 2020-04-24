import React, { Component} from "react";
import {DropdownButton, Dropdown} from 'react-bootstrap';
import Chart from "react-apexcharts";
import './DailyGraph.css';
import axios from "axios";

class DailyGraph extends Component {
    state = {
        getDataError: false,
        selectedCountry: null,
        category:"Infected",
        infectedDaily:[],
        deathDaily:[],
        recoveredDaily:[],
        options: {
            dataLabels: {
                enabled: false
            },
            chart: {
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false
                }
            },
            stroke: {
                width: 2,
            },
            colors:["#FEB01A"],
            legend: {
                showForSingleSeries: true,
                showForZeroSeries: true,
                labels: {
                    colors: 'white'
                },
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    type:'vertical',
                    opacityFrom: 0.7,
                    opacityTo: 0.9,    
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
                text: 'Select a Country',
                align: 'Center',
                style: {
                    color: 'white',
                    fontSize: '20px'
                }
            },
            tooltip: {
                theme: 'dark'
            },
        },
        series: [{
            name:'Infected',
            data: [],
        }]
    };

    componentDidUpdate (prevProps) {
        if (prevProps.countryName !== this.props.countryName){ 
            if (this.props.countryName !== "Global") {
                this.setState({selectedCountry: this.props.countryName})
                this.getData(this.props.countryName)
            } else {
                this.setState({selectedCountry: "Global"})
                this.getData("all")
            }
        }
    }

    categoryHandler = (category) => {
        let data = []
        if(category === "Infected"){
            this.setState({category: "Infected"})
            data = this.state.infectedDaily
        } else if (category === "Recovered") {
            this.setState({category: "Recovered"})
            data = this.state.recoveredDaily
        } else if (category === "Death") {
            this.setState({category: "Death"})
            data = this.state.deathDaily
        }
        if (this.state.selectedCountry) {
            this.computeGraph(data, category)
        }
    }

    getData = (request) => {
        axios.get("https://corona.lmao.ninja/v2/historical/" + request + "/?lastdays=all").then(response => {
            this.setState({getDataError:false})
            if(request !== "all"){
                this.setState({
                    infectedDaily: response.data.timeline.cases,
                    deathDaily: response.data.timeline.deaths,
                    recoveredDaily: response.data.timeline.recovered
                })
            } else {
                this.setState({
                    infectedDaily: response.data.cases,
                    deathDaily: response.data.deaths,
                    recoveredDaily: response.data.recovered
                })
            }

            let data = []
            if(this.state.category === "Infected"){
                data = this.state.infectedDaily
            } else if (this.state.category === "Recovered") {
                data = this.state.recoveredDaily
            } else if (this.state.category === "Death") {
                data = this.state.deathDaily
            }
            this.computeGraph(data,this.state.category)  

        }).catch(error => {
            this.setState({
                getDataError: true,
                infectedDaily: [],
                deathDaily: [],
                recoveredDaily: []
            })
            this.computeGraph([], this.state.category)
        });
    }

    computeGraph = (data, category) => {
        const dateArray = [], dailyArray = []
        if(!this.state.getDataError) {
            let daily = Object.entries(data)

            for (const key of Object.keys(data)) {
                dateArray.push(key + " GMT")
            }

            dailyArray.push(daily[0][1])
            for (let x = 0; x < daily.length-1; x++){
                dailyArray.push(daily[x+1][1] - daily[x][1])
            }

            let seriesColor = "#FEB01A"

            if (category === "Recovered") {
                seriesColor = "#00E396"
            } else if (category === "Death") {
                seriesColor = "#FF4560"
            }

            this.setState({
                options: {
                    title: {
                        text: this.props.countryName + " - Daily",
                    },
                    xaxis: {
                        categories: dateArray
                    },
                    colors:[seriesColor],              
                },
                series: [{
                    name: category,
                    data: dailyArray
                }]
            })          
        } else {
            this.setState({
                options: {
                    title: {
                        text: this.props.countryName + " - No Data",
                    }              
                }, 
                series: [{
                    name: category,
                    data: [] 
                }]
            })    
        }
    }
    
    render() {
        return (
            <div>
                <DropdownButton className="categoryBtn" title={this.state.category} size="sm">
                    <Dropdown.Item onClick={() => this.categoryHandler("Infected")}>Infected</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.categoryHandler("Recovered")}>Recovered</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.categoryHandler("Death")}>Death</Dropdown.Item>
                </DropdownButton>
                <div className="dailyChartContainer">                                    
                    <Chart
                        options={this.state.options}
                        series={this.state.series}                
                        type="area"
                        width="100%"
                        height="275px"/>                        
                </div>
            </div>
        )
    }
}

export default DailyGraph;
import React, { Component } from "react";
import Chart from "react-apexcharts";
import {Button} from 'react-bootstrap';
import './DataGraph.css';
import axios from "axios";

class Graph extends Component {
    state = {
        countryName: null,
        chartType:"bar",
        category: "Infected",
        error: false,
        options: {
            chart: {
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false,
            },
            xaxis: {
                categories: [],
                type: 'datetime',
                labels: {
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
                theme: 'dark'
            },
        },
        series: [{
            name:'infected',
            data: []
        }],
    };

    componentDidUpdate (prevProps) {
        if (prevProps.countryName !== this.props.countryName){ 
            this.setState({countryName: this.props.countryName})
            this.getData(this.props.countryName)
        }
    }

    infectedSelectHandler = () => {
        this.setState({category: "Infected"});
        if (this.state.countryName === null) {
            return
        } else {
            this.getData(this.props.countryName)
        }
    }

    deathsSelectHandler = () => {
        this.setState({category: "Death"});
        if (this.state.countryName === null) {
            return
        } else {
            this.getData(this.props.countryName)
        }
    } 

    barSelectHandler = () => {
        this.setState({chartType: "bar"});
        if (this.state.countryName === null) {
            return
        } else {
            this.getData(this.props.countryName)
        }
    } 

    lineSelectHandler = () => {
        console.log("here")
        this.setState({chartType: "line"});
        if (this.state.countryName === null) {
            return
        } else {
            this.getData(this.props.countryName)
        }
    } 
    

    getData = (countryName) => {
        axios.get('https://corona.lmao.ninja/v2/historical/' + countryName).then(response => {
            let historicData = null
            if (this.state.category === "Infected"){
                historicData = response.data.timeline.cases
            } else {
                historicData = response.data.timeline.deaths
            }
            const dateArray = []
            const figureArray = []
            const chartTypes = this.state.chartType
            for (const key of Object.keys(historicData)) {
                dateArray.push(key)
                figureArray.push(historicData[key])
            }
            this.setState({
                chartType: chartTypes,
                options: {
                    title: {
                        text: response.data.country.toUpperCase() + ` - ` + this.state.category,
                    },
                    xaxis: {
                        categories: dateArray,
                    },                            
                },
                series: [
                    {
                    name: this.state.category,
                    data: figureArray
                    },
                ]
            })            
        }).catch(error => {
            this.setState({error: error})
        });
    }

    render() {
        return (
            <div className="chartContainer">            
                <div className="mixed-chart">
                    <Chart
                        options={this.state.options}
                        series={this.state.series}
                        type={this.state.chartType}
                        width="100%"
                        height="260px"
                    />
                </div>
                <div className="float-left leftBtnContainer">
                    <Button className="btnStyle" onClick= {() => this.infectedSelectHandler()}>Infected</Button>
                    <Button className="btnStyle" onClick= {() => this.deathsSelectHandler()}>Death</Button>
                </div>
                {/* <div className="float-right rightBtnContainer">
                    <Button className="btnStyle" onClick= {() => this.barSelectHandler()}>Bar</Button>
                    <Button className="btnStyle" onClick= {() => this.lineSelectHandler()}>Line</Button>
                </div> */}
            </div>
        );
    }
}

export default Graph;
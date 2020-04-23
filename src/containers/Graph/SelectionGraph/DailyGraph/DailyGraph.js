import React, { Component} from "react";
import {Row, Col, DropdownButton, Dropdown} from 'react-bootstrap';
import Chart from "react-apexcharts";
import './DailyGraph.css';
import axios from "axios";

class DailyGraph extends Component {
    state = {
        error: false,
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
                show:true,
                showForSingleSeries: true,
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
                show:true,
                showAlways: true,
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
            type:'area',
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
        if(category === "Infected"){
            this.setState({category: "Infected"})
        } else if (category === "Recovered") {
            this.setState({category: "Recovered"})
        } else if (category === "Death") {
            this.setState({category: "Death"})
        }
        if (this.state.selectedCountry) {
            this.computeGraph(this.state.deathDaily, this.state.infectedDaily, this.state.recoveredDaily, category)
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
            this.computeGraph(this.state.deathDaily, this.state.infectedDaily, this.state.recoveredDaily,this.state.category) 
            this.setState({loading:true})          
        }).catch(error => {
            this.setState({
                getDataError: true,
                infectedDaily: [],
                deathDaily: [],
                recoveredDaily: []
            })
            this.computeGraph([], [], [],this.state.category)
        });
    }

    computeGraph = (Death, Infected, Recovered, category) => {
        const dateArray = [], infectedArray = [], deathArray = [], recoveredArray = []
        if(!this.state.getDataError) {
            let infected = Object.entries(Infected)
            let death = Object.entries(Death)
            let recovered = Object.entries(Recovered)

            for (const key of Object.keys(Infected)) {
                dateArray.push(key + " GMT")
            }

            infectedArray.push(infected[0][1])
            for (let x = 0; x < infected.length-1; x++){
                infectedArray.push(infected[x+1][1] - infected[x][1])
            }

            deathArray.push(death[0][1])
            for (let x = 0; x < death.length-1; x++){
                deathArray.push(death[x+1][1] - death[x][1])
            }

            recoveredArray.push(recovered[0][1])
            for (let x = 0; x < recovered.length-1; x++){
                recoveredArray.push(recovered[x+1][1] - recovered[x][1])
            }

            let dataArray = []
            let seriesColor = ""

            if(category === "Infected"){
                dataArray = infectedArray
                seriesColor = "#FEB01A"
            } else if (category === "Recovered") {
                dataArray = recoveredArray
                seriesColor = "#00E396"
            } else {
                dataArray = deathArray
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
                    yaxis: {
                        show:true,
                        showAlways: true,
                        labels: {
                            style: {
                                colors: 'white'
                            }
                        }
                    }              
                },
                legend: {
                    show: true,
                    labels: {
                        colors: 'white'
                    },
                    onItemClick: {
                        toggleDataSeries: false
                    }
                },
                series: [{
                    name: category,
                    data: dataArray
                }]
            })          
        } else {
            this.setState({
                options: {
                    title: {
                        text: this.props.countryName + " - No Data",
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
                    name: category,
                    type:'area',
                    data: [] 
                }]
            })    
        }
    }
    
    render() {
        return (
            <Row>
                <Col xs={12}>
                    <DropdownButton className="categoryBtn" title={this.state.category} size="sm">
                        <Dropdown.Item onClick={() => this.categoryHandler("Infected")}>Infected</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.categoryHandler("Recovered")}>Recovered</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.categoryHandler("Death")}>Death</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col xs={12}>
                    <div className="dailyChartContainer">                                    
                        <Chart
                            options={this.state.options}
                            series={this.state.series}                
                            type="area"
                            width="100%"
                            height="275px"/>                        
                    </div>
                </Col>
            </Row>
        )
    }
}

export default DailyGraph;
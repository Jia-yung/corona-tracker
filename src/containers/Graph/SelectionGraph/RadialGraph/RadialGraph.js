//libraries
import React, { Component} from "react";
import Chart from "react-apexcharts";
import axios from 'axios';

//stylings
import './RadialGraph.css';

class RadialGraph extends Component {
    state = {      
        series: [0],
        options: {
            labels:[this.props.category],
            colors:[this.props.color],
            offsetY: -10,
            getDataError:false,
            chart: {
                type: 'radialBar',
                sparkline: {
                    enabled: true
                },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 2000,
                    dynamicAnimation: {
                        enabled: true,
                        speed: 2000
                    }
                }
            },
            states: {
                hover:{
                    filter: {
                        type:'none'
                    }
                },
                active: {
                    filter: {
                        type:'none'
                    }
                }
            },
            stroke: {
                lineCap: 'round'
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: {
                        size:'60%'
                    },
                    track: {
                        show:true,
                        background: "#e7e7e7",
                        strokeWidth: '100%'
                    },
                    dataLabels: {
                        name: {
                            show:true,
                            fontSize: '16px',
                            fontFamily: undefined,
                            fontWeight: 600,
                            color: 'white',
                            offsetY: 56
                        },
                        value: {
                            show:true,
                            offsetY: -10,
                            fontSize: '20px',
                            color: this.props.color
                        }
                    }
                }
            }       
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.countryName !== this.props.countryName){             
            if(this.props.countryName !== "World") {
                let percentage = 0
                percentage =  (this.props.data / this.props.infected * 100).toFixed(2)
                this.computeGraph(percentage)
            } else if (this.props.countryName === "World"){
                this.getData("all")
            }
        }
    }

    getData = (request) => {
        let infected = 0 
        let death = 0
        let recovered = 0
        let percentage = 0

        axios.get("https://corona.lmao.ninja/v2/historical/" + request + "/?lastdays=1").then(response => {
            this.setState({getDataError:false})
            if(request !== "all"){
                    infected = Object.values(response.data.timeline.cases)[0]
                    death = Object.values(response.data.timeline.deaths)[0]
                    recovered = Object.values(response.data.timeline.recovered)[0]            
            } else {
                    infected = Object.values(response.data.cases)[0]
                    death =  Object.values(response.data.deaths)[0]
                    recovered = Object.values(response.data.recovered)[0]
            }

            if(this.props.category === "Fatality"){
                percentage = (death / infected * 100).toFixed(2)
            } else {
                percentage = (recovered / infected * 100).toFixed(2)
            }
            this.computeGraph(percentage)

        }).catch(error => {
            this.setState({
                getDataError: true,
            })
            this.computeGraph(0)
        });
    }

    computeGraph = (percentage) => {
        this.setState({
            series:[percentage]
        })
    }

    render() {
        return (
            <div>      
                <div className="radialChartContainer">            
                    <Chart
                        options={this.state.options}
                        series={this.state.series} 
                        type="radialBar"
                        width="100%"
                        height="153px"/>
                </div>
            </div>
        )
    }
}

export default RadialGraph;
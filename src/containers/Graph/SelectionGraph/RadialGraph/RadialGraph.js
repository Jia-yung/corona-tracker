import React, { Component} from "react";
import Chart from "react-apexcharts";
import './RadialGraph.css';

class RadialGraph extends Component {
    state = {      
        series: [0],
        options: {
            labels:[this.props.category],
            colors:[this.props.color],
            offsetY: -10,
            chart: {
                type: 'radialBar',
                sparkline: {
                    enabled: true
                },
                animations: {
                    enabled: true,
                    easing: 'easein',
                    speed: 1000,
                    dynamicAnimation: {
                        enabled: true,
                        speed: 1000
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
            let percentage = 0
            percentage =  (this.props.data / this.props.infected * 100).toFixed(2)
            this.computeGraph(percentage, this.props.category)
        }
    } 

    computeGraph = (percentage, category) => {
        this.setState({
            series:[percentage],
            options: {
                
            }
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
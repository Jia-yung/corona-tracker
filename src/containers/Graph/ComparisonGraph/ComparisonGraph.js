import React, { Component} from "react";
import {Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';
import Chart from "react-apexcharts";
import Caption from '../../../components/Caption/Caption';
import './ComparisonGraph.css';
import axios from "axios";

class ComparisonGraph extends Component {
    state = {
        usa: [],
        china: [],
        italy: [],
        france: [],
        uk: [],
        germany: [],
        spain:[],
        iran:[],
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
            colors: ["#FF4560", "#FFA500", "#FFFF00","#00E396","#008FFB","#775DD0","#FF00FF","#FFC0CB"],
            stroke: {
                width: 3,
                dashArray:0
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
                text: "",
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
            name:'USA',
            type: 'line',
            data: [],
        },{
            name:'China',
            type: 'line',
            data: []
        },{
            name:'Italy',
            type: 'line',
            data: []
        },{
            name:'UK',
            type: 'line',
            data: []
        },{
            name:'France',
            type: 'line',
            data: []
        },{
            name:'Germany',
            type: 'line',
            data: []
        },{
            name:'Spain',
            type:'line',
            data:[]
        },{
            name:'Iran',
            type:'line',
            data:[]
        }]
    };

    componentDidMount() {
        const usa = axios.get("https://corona.lmao.ninja/v2/historical/USA/?lastdays=all")
        const china = axios.get("https://corona.lmao.ninja/v2/historical/China/?lastdays=all")
        const italy = axios.get("https://corona.lmao.ninja/v2/historical/Italy/?lastdays=all")
        const uk = axios.get("https://corona.lmao.ninja/v2/historical/UK/?lastdays=all")
        const france = axios.get("https://corona.lmao.ninja/v2/historical/France/?lastdays=all")
        const germany = axios.get("https://corona.lmao.ninja/v2/historical/Germany/?lastdays=all")
        const spain = axios.get("https://corona.lmao.ninja/v2/historical/Spain/?lastdays=all")
        const iran = axios.get("https://corona.lmao.ninja/v2/historical/Iran/?lastdays=all")
        
        axios.all([usa, china, italy, uk, france, germany, spain,iran])
            .then(axios.spread((...response) => {
                this.setState({
                    usa: response[0].data.timeline,
                    china: response[1].data.timeline,
                    italy: response[2].data.timeline,
                    uk: response[3].data.timeline,
                    france: response[4].data.timeline,
                    germany: response[5].data.timeline,
                    spain: response[6].data.timeline,
                    iran: response[7].data.timeline
                })
                console.log(this.state.usa)
                this.getData("Infection")
        })).catch(error => {
            this.setState({error: true})
        })
    }

    getData = (type) => {
        let usaHistory = []
        let chinaHistory = []
        let italyHistory = []
        let ukHistory = []
        let franceHistory = []
        let germanyHistory = []
        let spainHistory = []
        let iranHistory = []

        if (type === "Infection"){
            usaHistory = this.state.usa.cases
            chinaHistory = this.state.china.cases
            italyHistory = this.state.italy.cases
            ukHistory = this.state.uk.cases
            franceHistory = this.state.france.cases
            germanyHistory = this.state.germany.cases
            spainHistory = this.state.spain.cases
            iranHistory = this.state.iran.cases
        } else if (type === "Death") {
            usaHistory = this.state.usa.deaths
            chinaHistory = this.state.china.deaths
            italyHistory = this.state.italy.deaths
            ukHistory = this.state.uk.deaths
            franceHistory = this.state.france.deaths
            germanyHistory = this.state.germany.deaths
            spainHistory = this.state.spain.deaths
            iranHistory = this.state.iran.deaths
        } else {
            usaHistory = this.state.usa.recovered
            chinaHistory = this.state.china.recovered
            italyHistory = this.state.italy.recovered
            ukHistory = this.state.uk.recovered
            franceHistory = this.state.france.recovered
            germanyHistory = this.state.germany.recovered
            spainHistory = this.state.spain.recovered
            iranHistory = this.state.iran.recovered
        }
        
        const dateArray = [], usaArray = [], chinaArray = [], italyArray = [], ukArray = [], franceArray = [], germanyArray = [], spainArray = [], iranArray = []
        
        for (const key of Object.keys(usaHistory)) {
            dateArray.push(key + " GMT")
            usaArray.push(usaHistory[key])
        }
        for (const key of Object.keys(chinaHistory)) {
            chinaArray.push(chinaHistory[key])
        }
        for (const key of Object.keys(italyHistory)) {
            italyArray.push(italyHistory[key])
        }
        for (const key of Object.keys(ukHistory)) {
            ukArray.push(ukHistory[key])
        }
        for (const key of Object.keys(franceHistory)) {
            franceArray.push(franceHistory[key])
        }
        for (const key of Object.keys(germanyHistory)) {
            germanyArray.push(germanyHistory[key])
        }
        for (const key of Object.keys(spainHistory)) {
            spainArray.push(spainHistory[key])
        }
        for (const key of Object.keys(iranHistory)) {
            iranArray.push(iranHistory[key])
        }

        this.setState({
            options: {
                xaxis: {
                    categories: dateArray
                },
                title: {
                    text: "Countries by " + type
                }                        
            },
            series: [{
                data: usaArray  
            },{
                data: chinaArray                   
            },{
                data: italyArray                   
            },{
                data: ukArray 
            },{
                data: franceArray
            }, {
                data: germanyArray   
            }, {
                data: spainArray
            }, {
                data: iranArray
            }]
        })            
    }
    
    render() {
        return (
            <Row>
                <Col xs={12}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <h4 className="subTitle">Comparison of multiple countries</h4>
                        <DropdownButton className="compareBtn" title="Compare" size="sm">
                            <Dropdown.Item onClick={() => this.getData("Infection")}>Infected</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.getData("Death")}>Deaths</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.getData("Recovery")}>Recovered</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </Col>
                <Col xs={12}>
                    <div className="chartCompareContainer">            
                        <div className="mixed-chart">
                            <Chart
                                options={this.state.options}
                                series={this.state.series} 
                                type="line"                  
                                width="100%"
                                height="400px"/>
                        </div>
                    </div>
                    <Caption/>
                </Col>
            </Row>
        )
    }
}

export default ComparisonGraph;
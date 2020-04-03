import React, {Component} from 'react'
import { geoMercator, select, scaleLinear, max} from 'd3'
import { geoPath } from 'd3'
import { interpolateHclLong } from 'd3'

class WorldMap extends Component {  
    renderMap(props) {
        const node = this.node
        const width = 1000//node.width.minVal.value
        const height= 500 //node.height.minVal.value
        const mapData = props.mapData

        // const maxMapDisplayData = max(mapData, d=> {
        //     return d.displayDataValue
        // })
        const projection = () => {
            return geoMercator()
                .scale(150)
                .translate(width/2, height/1.5)
        }

        const colorScale = scaleLinear()
            .domain(0, 1000000000)
            .range(["white", "red"])
            .interpolate(interpolateHclLong)
            colorScale.clamp(true)
        
        select(node)
            .append('g')
            .classed('countries', true)
            
        const countries = select('g')
            .selectAll('path')
            .data(mapData)

        countries.enter()
            .append('path')
            .classed('country', true)
            .attr("stroke", "black")
            .attr("strokeWidth", 0.75)
            .each(function(d,i){
                select(this)
                .attr("d", geoPath().projection(projection()(d)))
                .attr("fill", colorScale(d.displayDataValue))
            })
            .merge(countries)
                .each(function(d,i){
                    select(this)
                        .transition()
                        .delay(100)
                        .duration(1000)
                        .attr("fill", colorScale(d.displayDataValue))
                })

        countries.exit()
            .remove()
    }


    componentDidUpdate(nextProps) {
        if (nextProps.mapData.length) {
            this.renderMap(nextProps)
        }
    }

    componentDidMount() {
        this.renderMap(this.props.mapData)
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <svg
                width={this.props.width} height={this.props.height}
                ref={node => this.node = node}
                onClick = {() => this.props.onClick(undefined, this.node)} >
            </svg>
        )
    }
}

export default WorldMap
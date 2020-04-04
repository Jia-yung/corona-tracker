import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, scaleQuantile} from "d3";
import './DataMap.css'
import ColorLegend from './ColorLegend/ColorLegend'
import useResizeObserver from "./ResizeObserver"; 

function GeoChart({ data, property, infectedCountry}) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {                
        const svg = select(svgRef.current);
        const colorScale = scaleQuantile()
        .domain([0, 1, 1000, 50000, 80000, 100000])
        .range(["white","#F4C2C2", "#FF5C5C", "#D73B3E","#B22222","#701C1C"]);

        const { width, height } =
        dimensions || wrapperRef.current.getBoundingClientRect();

        const projection = geoMercator()
        .fitSize([width, height], data)
        .precision(100);

        const pathGenerator = geoPath().projection(projection);
        
        let color = 0
        let cases = 0 
        let death = 0 
        let recovered = 0
        let flag = null

        svg
        .selectAll(".country")
        .data(data.features)
        .join("path")
        .on("mouseover", feature => {
            setSelectedCountry(selectedCountry === feature ? null : feature);
        })
        .on("mouseout", feature => {
            setSelectedCountry(selectedCountry === feature ? null : feature);
        })
        .attr("class", "country")
        .attr("d", feature => pathGenerator(feature))
        .transition().duration(1000)
        .attr("fill", feature => {
            for (const key of Object.keys(infectedCountry)) {
                if(feature.properties["iso_a3"] === infectedCountry[key].countryInfo.iso3) {
                    color = infectedCountry[key].cases * 1
                    break
                } else {
                    color = 0
                }
            }
            return colorScale(color)
        })
        
        if(selectedCountry) {
            for (const key of Object.keys(infectedCountry)) {
                if(selectedCountry.properties["iso_a3"] === infectedCountry[key].countryInfo.iso3) {
                    cases = infectedCountry[key].cases
                    death = infectedCountry[key].deaths
                    recovered = infectedCountry[key].recovered
                    flag = infectedCountry[key].countryInfo.flag
                    break
                } else {
                    cases = 0
                    death = 0
                    recovered = 0
                }
            }
        }

        svg
        .selectAll(".label")
        .data([selectedCountry])
        .join("text")
        .attr("class", "label")
        .style("fill", "white")
        .text(
            feature => feature && feature.properties["name"]
            )
        .attr("x", '1em')
        .attr("y", '15.5em')
        .append("tspan")
        .text(
            feature => feature && "Cases: " + cases
        )
        .attr("x", '1em')
        .attr("y", '17em')
        .append('tspan')
        .text(
            feature => feature && "Death: " + death
        )
        .attr("x", '1em')
        .attr("y", '18.5em')
        .append('tspan')
        .text(
            feature => feature && "Recovered: " + recovered
        )
        .attr("x", '1em')
        .attr("y", '20em')
        .attr("className", "labelText")
        
        .append("svg:image")
        .attr('width', 20)
        .attr('height', 24)
        .attr("xlink:href", flag)
        .attr("x", 0)
        .attr("y", 75)
    }, [data, dimensions, property, selectedCountry, infectedCountry]);

    return (
        <div>
            <div ref={wrapperRef} style={{ marginBottom: "10px" }}>
                <svg className="svg" ref={svgRef}></svg>
            </div>
            <ColorLegend />
        </div>
    );
}

export default GeoChart;

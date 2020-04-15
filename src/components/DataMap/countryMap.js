import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, scaleQuantile} from "d3";
import ColorLegend from './ColorLegend/ColorLegend';
import useResizeObserver from "./ResizeObserver"; 
import './DataMap.css'

function countryGeoChart({ data, infectedProvince, scale3, scale4, scale5, scale6}){
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedCountry, setSelectedCountry] = useState(null);

    useEffect(() => {                
        const svg = select(svgRef.current);
        const colorScale = scaleQuantile()
        .domain([0, 1, scale3, scale4, scale5, scale6, 1000000])
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
        .attr("fill", feature => {
            for (const key of Object.keys(infectedProvince)) {
                if((feature.properties["NAME"]) === (infectedProvince[key].province)) {
                    color = infectedProvince[key].stats.confirmed * 1
                    break
                } else {
                    color = 0
                }
            }
            return colorScale(color)
        })
        
        if(selectedCountry) {
            for (const key of Object.keys(infectedProvince)) {
                if(selectedCountry.properties["NAME"] === (infectedProvince[key].province)) {
                    cases = infectedProvince[key].stats.confirmed
                    death = infectedProvince[key].stats.deaths
                    recovered = infectedProvince[key].stats.recovered
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
        
        .text(feature => feature && "Infected: " + cases.toLocaleString())
        .attr("x", '1em')
        .attr("y", '18.5em')
        .append('tspan')
        
        .text(feature => feature && "Deaths: " + death.toLocaleString())
        .attr("x", '1em')
        .attr("y", '20em')
        .append('tspan')
        
        .text(feature => feature && "Recovered: " + recovered.toLocaleString())
        .attr("x", '1em')
        .attr("y", '21.5em')
        .attr("className", "labelText")
        .append("tspan")
        
        .style("font-weight", "bold")
        .text(feature => feature && feature.properties["NAME"])
        .attr("x", '1em')
        .attr("y", '17em')
        .attr("className", "countryName")
    }, [data, dimensions, selectedCountry, infectedProvince, scale3, scale4, scale5, scale6]);

    return (
        <div className="mapContainer">
            <div ref={wrapperRef}>
                <svg className="svg" ref={svgRef}></svg>
            </div>
            <ColorLegend 
                scale1={0} 
                scale2={1} 
                colorScale3={scale3/1000} 
                colorScale4={scale4/1000} 
                colorScale5={scale5/1000} 
                colorScale6={scale6/1000} />
        </div>
    );
}

export default countryGeoChart;

import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, scaleQuantile } from "d3";
import './DataMap.css'
import ColorLegend from './ColorLegend/ColorLegend'
import useResizeObserver from "./ResizeObserver"; 

function GeoChart({ data, property, infectedCountry}) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);
    const [selectedCountry, setSelectedCountry] = useState(null);
    // will be called initially and on every data change
    
    useEffect(() => {                
        const svg = select(svgRef.current);
        const colorScale = scaleQuantile()
        .domain([0, 1, 1000, 50000, 80000, 100000])
        .range(["white","#F4C2C2", "#FF5C5C", "#D73B3E","#B22222","#701C1C"]);
        // use resized dimensions
        // but fall back to getBoundingClientRect, if no dimensions yet.
        const { width, height } =
        dimensions || wrapperRef.current.getBoundingClientRect();

        // projects geo-coordinates on a 2D plane
        const projection = geoMercator()
        .fitSize([width, height], data)
        .precision(100);

        // takes geojson data,
        // transforms that into the d attribute of a path element
        const pathGenerator = geoPath().projection(projection);
        let color = 0
        // render each country
        svg
        .selectAll(".country")
        .data(data.features)
        .join("path")
        .on("click", feature => {
            setSelectedCountry(selectedCountry === feature ? null : feature);
        })
        .attr("class", "country")
        .transition().duration(1000)
        .attr("d", feature => pathGenerator(feature))
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
        // render text
        svg
        .selectAll(".label")
        .data([selectedCountry])
        .join("text")
        .attr("class", "label")
        .style("fill", "white")
        .text(
            feature =>
            feature &&
            feature.properties["iso_a3"] +
                ": " +
                feature.properties[property].toLocaleString()
        )
        // .text(
        //     feature => {
        //         for (const key of Object.keys(infectedCountry)) {
        //             if (infectedCountry[key].countryInfo.iso3 === feature && feature.properties["iso_a3"]) {
        //                 cases = infectedCountry[key].cases
        //                 break
        //             } else {
        //                 cases = 0
        //             }
        //         }
        //         return (feature && feature.properties.name + ":" + cases)
        //     }         
        // )
        
        .attr("x", 25)
        .attr("y", 25)
        .attr("className", "labelText");
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

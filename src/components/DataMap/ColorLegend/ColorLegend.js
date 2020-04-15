import React from 'react'
import './ColorLegend.css'

const colorLegend = (props) => (
    <div className="colorLegend">
        <h6>Total Cases</h6>
        <table className="colorTable" align="center">
            <thead>
                <tr className="colorRow">
                    <td className="noCases"></td>
                    <td className="leastCases"></td>
                    <td className="minimalCases"></td>
                    <td className="averageCases"></td>
                    <td className="moderateCases"></td>
                    <td className="mostCases"></td>
                </tr>
            </thead>
            <tbody>
                <tr className="dataRow">
                    <td>{props.scale1}</td>
                    <td>>{props.scale2}</td>
                    <td>>{props.scale3}K</td>
                    <td>>{props.scale4}K</td>
                    <td>>{props.scale5}K</td>
                    <td>>{props.scale6}K</td>
                </tr>
            </tbody>
        </table>
    </div>
)

export default colorLegend
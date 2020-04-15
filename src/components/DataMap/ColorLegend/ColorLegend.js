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
                    <td>0</td>
                    <td>>1</td>
                    <td>>{props.colorScale3}K</td>
                    <td>>{props.colorScale4}K</td>
                    <td>>{props.colorScale5}K</td>
                    <td>>{props.colorScale6}K</td>
                </tr>
            </tbody>
        </table>
    </div>
)

export default colorLegend
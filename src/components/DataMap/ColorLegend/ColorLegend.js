import React from 'react'
import './ColorLegend.css'

const colorLegend = () => (
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
                    <td>>1000</td>
                    <td>>50000</td>
                    <td>>80000</td>
                    <td>>100000</td>
                </tr>
            </tbody>
        </table>
    </div>
)

export default colorLegend
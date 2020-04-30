import React, {Component} from 'react';
import './DataTable.css'

class DataTable extends Component {
    render () {
        return (
            <div className="dataTable">         
                <table 
                    data-url= 'https://corona.lmao.ninja/v2/countries?sort=cases'                
                    data-toggle="table"
                    data-sticky-header = "true"
                    data-height = "500"
                    data-classes="table table-bordered table-dark table-striped"
                    data-search="true" >
                    <thead className="thead-dark">
                        <tr className="tableRow">
                            <th data-field="country" data-sortable>Country</th>
                            <th data-field="cases" className="infected" data-sortable>Infected</th>
                            <th data-field="todayCases" data-sortable>New Cases</th>
                            <th data-field="deaths" className="deaths" data-sortable>Deaths</th>
                            <th data-field="recovered" className="recovered" data-sortable>Recovered</th>
                            <th data-field="active" data-sortable>Active</th>
                            <th data-field="critical" data-sortable>Critical</th>
                            <th data-field="casesPerOneMillion" data-sortable>Cases/Million</th>
                            <th data-field="deathsPerOneMillion" data-sortable>Death/Million</th>
                        </tr>
                    </thead>
                </table>
                <div className="tableCaption">
                    <p>Updated for every 10 minutes.</p>
                    <p>Source:
                        <a className="links" href="https://www.worldometers.info/coronavirus/" target="_blank" rel="noopener noreferrer" >
                            Worldometers
                        </a>
                    </p>
                </div>
            </div>
        )
    }
}

export default DataTable
    

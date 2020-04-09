import React, {Component} from 'react';
import './DataTable.css'

class DataTable extends Component {
    render () {
        return (
            <div className="dataTable">         
                <table 
                    data-url= {this.props.url}                
                    data-toggle="table"
                    data-sticky-header = "true"
                    data-height = "500"
                    data-classes="table table-bordered table-dark table-striped"
                    data-search="true" >
                    <thead className="thead-dark">
                        <tr className="tableRow">
                            <th data-field="country" data-sortable data-show-columns="true" data-switchable="true">Country</th>
                            <th data-field="cases" data-sortable data-switchable="true">Infected</th>
                            <th data-field="todayCases" data-sortable>New Cases</th>
                            <th data-field="deaths" data-sortable data-show-footer>Deaths</th>
                            <th data-field="recovered" data-sortable>Recovered</th>
                            <th data-field="active" data-sortable>Active</th>
                            <th data-field="critical" data-sortable>Critical</th>
                            <th data-field="casesPerOneMillion" data-sortable>Cases/Million</th>
                            <th data-field="deathsPerOneMillion" data-sortable>Death/Million</th>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}

export default DataTable
    

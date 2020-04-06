import React, {Component} from 'react';
import './DataTable.css'

class DataTable extends Component {
    render () {
        return (
            <div className="dataTable">         
                <table 
                    className="table-custom"
                    data-toggle="table"
                    data-sticky-header = "true"
                    data-classes="table table-bordered"
                    data-url= {this.props.url}                
                    data-search="true" >
                    <thead className="tableHeader" data-sticky-header="true">
                        <tr className="tableRow">
                            <th data-field="country" data-sortable>Country</th>
                            <th data-field="cases" data-sortable>Infected</th>
                            <th data-field="todayCases" data-sortable>New Cases</th>
                            <th data-field="deaths" data-sortable>Deaths</th>
                            <th data-field="active" data-sortable>Active</th>
                            <th data-field="critical" data-sortable>Critical</th>
                            <th data-field="recovered" data-sortable>Recovered</th>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}

export default DataTable
    

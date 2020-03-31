import React from 'react';
import './DataTable.css'

const dataTable = (props) => {
    return (
        <div className="dataTable">         
            <table 
                className="table-custom"
                data-toggle="table"
                data-classes="table-striped table table-bordered"
                data-url= {props.url}                
                data-search="true" >
                <thead>
                    <tr>
                        <th data-field="country" data-sortable onClick={props.clicked}>Country</th>
                        <th data-field="cases" data-sortable>Infected</th>
                        <th data-field="todayCases" data-sortable>Today Infections</th>
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

export default dataTable
    

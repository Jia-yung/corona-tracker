import React, {Component} from 'react';
import './DataTable.css'

class DataTable extends Component {
    componentDidMount() {
        const script = document.createElement("script");

        script.src = "extensions/sticky-header/bootstrap-table-sticky-header.js";
        script.async = true;
    
        document.body.appendChild(script);
    }

    render () {
        return (
            <div className="dataTable">         
                <table 
                    className="table-custom"
                    data-toggle="table"
                    data-sticky-header="true"
                    data-classes="table table-bordered"
                    data-url= {this.props.url}                
                    data-search="true" >
                    <thead className="tableHeader">
                        <tr className="tableRow">
                            <th data-field="country" data-sortable>Country</th>
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
}

export default DataTable
    

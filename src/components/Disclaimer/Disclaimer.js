import React from 'react'
import './Disclaimer.css'

const disclaimer = () => (
    <div className="disclaimerContainer">
        <h4>About the data</h4>
        <h6>Rapid Changes</h6>
        <p>
            The data displayed on this site may not always be up to date. Relevant information about reported cases can be found on   
            <a className="links" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports" target="_blank" rel="noopener noreferrer">
                World Health Organization (WHO)  
            </a>
            and
            <a className="links" href="https://coronavirus.jhu.edu/" target="_blank" rel="noopener noreferrer" >
                John Hopkins University (JHU)
            </a>
            official site.
        </p>
        <h6>Availability of Data</h6>
        <p>Data for some countries are not displayed due to the unavailability of the data provided.</p>
        <div className="fa-pull-left email">         
            <p>
                <a href="mailto:covid19trackeronline@gmail.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary emailBtn">
                    <span className="fa fa-envelope envelopeIcon" aria-hidden="true"/>
                </a>
                Email  about anything related to this tracker.
            </p>                          
        </div>    
    </div>
)

export default disclaimer
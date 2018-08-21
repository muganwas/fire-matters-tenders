import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Image from 'react-image';
//import { dispatchedSearchInfo } from '../extras/dispatchers';
import '../css/App.css';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user
    }
})
export default class LandingSummary extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="landing-info">
                <div className="section about">
                    <i class="material-icons md-36">assignment</i>
                    <div className="text-main">
                        <h2>About Fire-Matters Documents</h2>
                        <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                </div>
                <div className="section-full">
                
                    <h2>How It Works</h2>
                    <div className="how-it-works">
                        <div className="sect-1-3">
                            <i class="material-icons">search</i>
                            <span>find</span>
                            <span className="dit">post request for service quote </span>
                        </div>
                        <div className="sect-1-3">
                            <i class="material-icons">assignment_turned_in</i>
                            <span>vet</span>
                            <span className="dit">pick out the best quote for your needs</span>
                        </div>
                        <div className="sect-1-3">
                            <i class="material-icons">next_week</i>
                            <span>hire</span>
                            <span className="dit">hire service provider</span>
                        </div>
                    </div>
                {/*Joshua's version
                    <h2>Services</h2>
                    <div className="how-it-works">
                        <div className="sect-1-2 left">
                        <span class='sect-header'>Documents</span>
                            <span className="service" id="tenders">
                                <Image className="pic" src={require('../images/Tenders.png')}/>
                                <span>Tenders</span>
                            </span>
                            <span className="service" id="evac-diagrams">
                                <Image className="pic" src={require('../images/EvacuationDiagrams.png')}/>
                                <span>Evacuation Diagrams</span>
                            </span>
                            <span className="service" id="practices-guide">
                                <Image className="pic" src={require('../images/GoodPracticeGuides.png')}/>
                                <span>Good Practice Guide</span>
                            </span>
                            <span className="service" id="special-needs">
                                <Image className="pic" src={require('../images/SpecialNeeds.png')}/>
                                <span>Special Needs Persons <br/>Guide</span>
                            </span>
                        </div>
                        <div className="sect-1-2 right">
                        <span class='sect-header'>Market Place</span>
                            <span className="service" id="quotations">
                                <Image className="pic" src={require('../images/quotations.png')}/>
                                <span>Quotations</span>
                            </span>
                            <span className="service" id="portables">
                                <Image className="pic" src={require('../images/Portables.png')}/>
                                <span>Portables</span>
                            </span>
                            <span className="service" id="maintenance">
                                <Image className="pic" src={require('../images/Maintenance.png')}/>
                                <span>FSI-Maintenance</span>
                            </span>
                            <span className="service" id="evac-training">
                                <Image className="pic" src={require('../images/EvacTraining.png')}/>
                                <span>Evacuation <br/>Training</span>
                            </span>
                        </div>
                    </div>*/}
                </div>
                <div className="section-full dark">
                    <div className="sect-1-2" dir="rtl">
                    <i class="material-icons on">format_quote</i>
                        <span className="title">
                            We bring you the best service providers in the industry
                        </span>
                        <span className="caption"><span>John Doe</span>
                        <span>CEO</span></span>
                    </div>
                    <div className="sect-1-2 best-sps"></div>
                </div>                
                <div className="section-full">
                <h2>Fire Matters Online Services</h2>
                    <div className="other-services">
                        <div className="sect-1-4">
                            <Link to={`//www.firematters.com.au`} target="_blank"><Image className="pic" src={require('../images/Compliance.png')}/></Link>
                            <span>FM Compliance</span>
                        </div>
                        <div className="sect-1-4">
                            <Link to={`//www.firematters.com.au`} target="_blank"><Image className="pic" src={require('../images/Learning.png')}/></Link>
                            <span>FM Learning</span>
                        </div>
                        <div className="sect-1-4">
                            <Link to={`//www.firematters.com.au`} target="_blank"><Image className="pic" src={require('../images/Diagrams.png')}/></Link>
                            <span>FM Diagrams</span>
                        </div>
                        <div className="sect-1-4">
                            <Link to={`//www.firematters.com.au`} target="_blank"><Image className="pic" src={require('../images/Reports.png')}/></Link>
                            <span>FM Reports</span>
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        )
    }
}
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LandingInfo extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="landing-info">
                <div className="section">
                    <div className = "about">
                        <i class="material-icons md-36">assignment</i>
                        <div className="text-main">
                            <h2>About Fire-Matters Marketplace</h2>
                            <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
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
                <h2>Fire Matters Marketplace Categories</h2>
                    <div className="other-services">
                        <div className="sect-1-3">
                            <Link to={`//www.firematters.com.au`} target="_blank"><i class="material-icons">restore</i></Link>
                            <span>Maintenance</span>
                            <span className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        </div>
                        <div className="sect-1-3">
                            <Link to={`//www.firematters.com.au`} target="_blank"><i class="material-icons">healing</i></Link>
                            <span>Repair</span>
                            <span className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        </div>
                        <div className="sect-1-3">
                            <Link to={`//www.firematters.com.au`} target="_blank"><i class="material-icons">directions_run</i></Link>
                            <span>Evacuation Training</span>
                            <span className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                        </div>
                    </div>
                </div>
                <br/>
            </div>
        )
    }
}

export default LandingInfo
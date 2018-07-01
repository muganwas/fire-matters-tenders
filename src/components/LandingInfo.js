import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
                <h2>Our Other Services</h2>
                    <div className="other-services">
                        <div className="sect-1-3">
                            <Link to={`//www.firematters.com.au`} target="_blank"><i class="material-icons">whatshot</i></Link>
                            <span>fire safety advisor</span>
                        </div>
                        <div className="sect-1-3">
                            <Link to={`//www.firematters.com.au`} target="_blank"><i class="material-icons">directions_run</i></Link>
                            <span>evacuation training</span>
                        </div>
                        <div className="sect-1-3">
                            <Link to={`//www.firematters.com.au`} target="_blank"><i class="material-icons">school</i></Link>
                            <span>third party certification</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
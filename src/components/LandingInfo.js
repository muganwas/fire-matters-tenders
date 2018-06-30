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
            <div className="section">
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
        )
    }
}
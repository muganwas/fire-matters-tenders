import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
//import { dispatchedSearchInfo } from 'extras/dispatchers';
import 'css/App.css';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user
    }
})
export default class HeaderMain extends Component {
    constructor(props){
        super(props)
    }
    getStarted = ()=>{

    }
    initSubscription = ()=>{

    }
    render(){
        return(
            <div className="call-to-action">
                <span id="title-text">Get it done, get a quote and protect your self and your property.</span>
                <span id="get-started">
                    <input type="text" placeholder="Are you a property owner or occupier?" onChange={ this.initSubscription } />
                    <button id="go" onClick={ this.getStarted }>Get Started</button>
                </span>
            </div>
        )
    }
}
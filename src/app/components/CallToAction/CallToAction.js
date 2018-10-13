import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
//import { dispatchedSearchInfo } from 'extras/dispatchers';
import './callToAction.css';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user
    }
})
class HeaderMain extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="call-to-action">
                <span id="title-text">Get it done, get a quote and protect your self and your property.</span>
                <span id="get-started">
                    <input id="start" type="text" placeholder="What is your location?" onChange={ this.initSubscription } />
                    <button id="go" onClick={ this.getStarted }>Get Started</button>
                </span>
            </div>
        )
    }
}

HeaderMain.defaultProps = {
    user: {},
    search: {}
}

HeaderMain.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired 
}

export default HeaderMain;
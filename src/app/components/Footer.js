import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
//import { dispatchedSearchInfo } from '../extras/dispatchers';
import { year } from '../extras/helperFunctions';
import '../css/App.css';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user
    }
})
export default class Footer extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="footer">
                <div className="footer-links">
                    <Link to={`/`}>Home</Link>
                    <Link to={`/`}>Tenders</Link>
                    <Link to={`/`}>Service Providers</Link>
                    <Link to={`/`}>About</Link>
                    <Link to={`/`}>Contact</Link>
                </div>
                <div className="social-icons">
                    <SocialIcon url="http://facebook.com/" style={{ height: 35, width: 35, margin: 5 }} color="#fff"/>
                    <SocialIcon url="http://twitter.com/" style={{ height: 35, width: 35, margin: 5  }} color="#fff"/>
                    <SocialIcon url="http://linkedin.com/" style={{ height: 35, width: 35, margin: 5  }} color="#fff"/>
                    <SocialIcon url="http://google.com/" style={{ height: 35, width: 35, margin: 5  }} color="#fff"/>
                </div>
                <div className="misc">
                    <span className="footer-phone"><i className="material-icons">phone</i><a href="tel:(07) 3071 9088">(07) 3071 9088</a></span>
                    <span className="footer-phone"><i className="material-icons">email</i><a href="mailto:info@firematters.com.au">info@firematters.com.au</a></span>
                    <span className="footer-phone"><i className="material-icons">home</i>34, Queens street. Darwin</span>
                </div>
                <div className="copy">
                    &copy;{ year } FIRE MATTERS - Fire Safety Compliance - All rights reserved.
                </div>
            </div>
        )
    }
}
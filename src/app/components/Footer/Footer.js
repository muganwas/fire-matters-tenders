import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
//import { dispatchedSearchInfo } from 'extras/dispatchers';
import { year } from 'extras/helperFunctions';
import './footer.css';

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
                    <Link to={`/home`}>Home</Link>
                    <Link to={`/listings`}>Listings</Link>
                    <Link to={`/service-providers`}>Service Providers</Link>
                    <Link to={`/about`}>About</Link>
                    <Link to={`/contact`}>Contact</Link>
                </div>
                <div className="social-icons">
                    <SocialIcon url="https://facebook.com/" style={{ height: 35, width: 35, margin: 5 }} color="#fff"/>
                    <SocialIcon url="https://twitter.com/" style={{ height: 35, width: 35, margin: 5  }} color="#fff"/>
                    <SocialIcon url="https://linkedin.com/" style={{ height: 35, width: 35, margin: 5  }} color="#fff"/>
                    <SocialIcon url="https://google.com/" style={{ height: 35, width: 35, margin: 5  }} color="#fff"/>
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
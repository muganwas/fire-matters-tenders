import React, { Component } from 'react';
import { connect } from 'react-redux';
import './headerAlt.css';
import Image from 'react-image';
import { Link } from 'react-router-dom';
//import { dispatchedSearchInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { PropTypes } from 'prop-types';
import { YelloDash } from 'components';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user,
        genInfo: store.genInfo
    }
})
class HeaderAlt extends Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    loginLink =<div><span>Already have an account?</span>  <Link to={`/login`} >Login</Link></div>;
    signupLink = <div><span>New to FireMatters?</span>  <Link to={`/signup`} >Sign Up</Link></div>;
    render(){
        return(
            <div className="App-header-alt">
                <Link to={`/`}><Image className="App-logo" src={require('images/logo.jpg')} /></Link>
                <div className="alt_links">{this.props.loc==="login"?this.signupLink :this.loginLink }</div>
                <YelloDash header = { this.props.header } sub = { this.props.sub } />
            </div>
        )
    }
}

HeaderAlt.defaultProps = {
    search: {},
    user: {},
    genInfo: {}
}

HeaderAlt.propTypes = {
    search: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default HeaderAlt;
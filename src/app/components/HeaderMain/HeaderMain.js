import React, { Component } from 'react';
import { connect } from 'react-redux';
import Image from 'react-image';
import { SocialIcon } from 'react-social-icons';
import { Link } from 'react-router-dom';
import { dispatchedSearchInfo, dispatchedGenInfo } from 'extras/dispatchers';
import './headerMain.css';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user,
        genInfo: store.genInfo
    }
})
class HeaderMain extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount = ()=>{
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }
    componentWillUnmount = () => {
      window.removeEventListener("resize", this.updateDimensions);
    }
    
    updateDimensions = ()=>{
        let winWidth = window.innerWidth;
        let info = {};
        if(winWidth >= 680){
            info['menu'] = "Main-Menu";
        }else{
            info['menu'] = "Mobile-Menu";
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    search = (event)=>{
        let searchTerm = event.target.value;
        let searchInfo = {};
        searchInfo['searchTerm'] = searchTerm;
        this.props.dispatch(dispatchedSearchInfo(searchInfo));
    }

    toggleMenu = ()=>{
        let info = {};
        let currClassName = this.props.genInfo['info']['menu'];
        if(currClassName === "Mobile-Menu"){
            info['menu'] = "Mobile-Menu shown";
        }else if(currClassName === "Mobile-Menu shown"){
            info['menu'] = "Mobile-Menu";
        }else{
            info['menu'] = currClassName;
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    socialIcons = 
                <div className="social-icons">
                    <SocialIcon url="https://facebook.com/" style={{ height: 25, width: 25, margin: 5 }} color="#475992"/>
                    <SocialIcon url="https://twitter.com/" style={{ height: 25, width: 25, margin: 5  }} color="#75A8E9"/>
                    <SocialIcon url="https://linkedin.com/" style={{ height: 25, width: 25, margin: 5  }} color="#0077B5"/>
                    <SocialIcon url="https://google.com/" style={{ height: 25, width: 25, margin: 5  }} color="#dd4b39"/>
                </div>;

    loggeInOptions = 
                <div className="signup-login">
                    <Link to={`/`}>Logout</Link>
                </div>;
    NotLoggedInOptions =
                <div className="signup-login">
                    <Link className="signup" onClick={ this.toggleMenu } to={`/signup`}>Sign up</Link><span className="div">&#124;</span>
                    <Link onClick={ this.toggleMenu } to={`/login`}>Login</Link>
                </div>;
    render(){
        return(
            <div className="App-header">
                <Image className="App-logo" src={require('images/logo.jpg')} />
                <div className="search"><input placeholder="search" type="text" onChange={this.search} /><i className="material-icons">search</i></div>
                <i class="material-icons menu-icon" onClick={ this.toggleMenu }>menu</i>
                <div className={ this.props.genInfo['info']['menu'] }>
                    <Link onClick={ this.toggleMenu } to={`/`}>Home</Link>
                    <Link onClick={ this.toggleMenu } to={`/listings`}>Listings</Link>
                    <Link onClick={ this.toggleMenu } to={`/service-providers`}>Service Providers</Link>
                    <Link onClick={ this.toggleMenu } to={`/`}>About</Link>
                    <Link onClick={ this.toggleMenu } to={`/contact`}>Contact</Link>
                <div className="login-social right">
                    { this.socialIcons }
                    { this.props.user['info']['loggedin']?this.loggeInOptions:this.NotLoggedInOptions }
                </div>                   
                </div>
            </div>
        )
    }
}

HeaderMain.defaultProps = {
    search: {},
    user: {},
    genInfo: {}
}

HeaderMain.propTypes = {
    search: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default HeaderMain;
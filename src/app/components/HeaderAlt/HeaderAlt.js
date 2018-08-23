import React, { Component } from 'react';
import { connect } from 'react-redux';
import './headerAlt.css';
import Image from 'react-image';
import { Link } from 'react-router-dom';
import { dispatchedSearchInfo, dispatchedGenInfo } from '../../extras/dispatchers';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user,
        genInfo: store.genInfo
    }
})
export default class HeaderAlt extends Component {
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

    loggeInOptions = 
                <div className="signup-login">
                    <Link to={`/`}>Logout</Link>
                </div>;
    NotLoggedInOptions =
                <div className="signup-login">
                    <Link className="signup" onClick={ this.toggleMenu } to={`/signup`}>Sign up</Link><span className="div">&#124;</span>
                    <Link onClick={ this.toggleMenu } to={`/login`}>Login</Link>
                </div>;
    loginLink =<div> <span>Already have an account?</span>  <Link to={`/login`} >Login</Link></div>;
    signupLink = <div> <span>New to FireMatters?</span>  <Link to={`/signup`} >Sign Up</Link></div>;
    render(){
        return(
            <div className="App-header">
                <Link to={`/`}><Image className="App-logo" src={require('../../images/logo-alt.jpg')} /></Link>
                <div className="alt_links">{this.props.loc==="login"?this.signupLink :this.loginLink }</div>
            </div>
        )
    }
}
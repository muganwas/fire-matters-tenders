import React, { Component } from 'react';
import { connect } from 'react-redux';
import Image from 'react-image';
import { Link } from 'react-router-dom';
import { dispatchedSearchInfo, dispatchedGenInfo } from '../extras/dispatchers';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user,
        genInfo: store.genInfo
    }
})
export default class HeaderMain extends Component {
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
    render(){
        return(
            <div className="App-header">
                <Image className="App-logo" src={require('../images/logo-alt.jpg')} />
                <div className="search"><input placeholder="search" type="text" onChange={this.search} /><i className="material-icons">search</i></div>
                <i class="material-icons menu-icon" onClick={ this.toggleMenu }>menu</i>
                <div className={ this.props.genInfo['info']['menu'] }>
                    <Link onClick={ this.toggleMenu } to={`/`}>Home</Link>
                    <Link onClick={ this.toggleMenu } to={`/`}>Tenders</Link>
                    <Link onClick={ this.toggleMenu } to={`/`}>Service Providers</Link>
                    <Link onClick={ this.toggleMenu } to={`/`}>About</Link>
                    <Link onClick={ this.toggleMenu } to={`/`}>Contact</Link>
                    { this.props.user['info']['loggedin']?this.loggeInOptions:this.NotLoggedInOptions }                    
                </div>
            </div>
        )
    }
}
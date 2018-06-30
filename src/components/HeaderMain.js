import React, { Component } from 'react';
import { connect } from 'react-redux';
import Image from 'react-image';
import { Link } from 'react-router-dom';
import { dispatchedSearchInfo } from '../extras/dispatchers';
import '../css/App.css';

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

    search = (event)=>{
        let searchTerm = event.target.value;
        let searchInfo = {};
        searchInfo['searchTerm'] = searchTerm;
        this.props.dispatch(dispatchedSearchInfo(searchInfo));
    }
    loggeInOptions = 
                <div className="signup-login">
                    <Link to={`/`}>Logout</Link>
                </div>;
    NotLoggedInOptions =
                <div className="signup-login">
                    <Link to={`/`}>Sign up</Link>|
                    <Link to={`/`}>Login</Link>
                </div>;
    render(){
        return(
            <div className="App-header">
                <Image className="App-logo" src={require('../images/logo.png')} />
                <div className="search"><input placeholder="search" type="text" onChange={this.search} /><i className="material-icons">search</i></div>
                <div className="Main-Menu">
                    <Link to={`/`}>Home</Link>
                    <Link to={`/`}>Tenders</Link>
                    <Link to={`/`}>Service Providers</Link>
                    <Link to={`/`}>About</Link>
                    <Link to={`/`}>Contact</Link>
                    { this.props.user['info']['loggedin']?this.loggeInOptions:this.NotLoggedInOptions }                    
                </div>
            </div>
        )
    }
}
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Image from 'react-image';
import { SocialIcon } from 'react-social-icons';
import { NavLink, withRouter } from 'react-router-dom';
import { dispatchedSearchInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { SearchInput } from 'components';
import { Lock } from '@material-ui/icons';
import './headerMain.css';
import { PropTypes } from 'prop-types';

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

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    componentWillMount(){
        if(sessionStorage.getItem('loginSession')){
            let genInfo = {...this.props.genInfo.info},
            loginSession = JSON.parse(sessionStorage.getItem('loginSession')),
            userId = loginSession.userId;
            genInfo.alternatingNavigation.home = '/userPage:'+ userId;  
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }
        
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    
    updateDimensions = ()=>{
        let winWidth = window.innerWidth;
        let info = {...this.props.genInfo.info};
        if(winWidth >= 680){
            info['menu'] = "Main-Menu";
        }else{
            info['menu'] = "Mobile-Menu";
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    search = (event)=>{
        let searchTerm = event.target.value;
        let searchInfo = { ...this.props.searchInfo.info };
        searchInfo['searchTerm'] = searchTerm;
        this.props.dispatch(dispatchedSearchInfo(searchInfo));
    }

    toggleMenu = ()=>{
        let info = {...this.props.genInfo.info};
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

    logOut = ()=>{
        let info = {...this.props.genInfo.info};
        info.alternatingNavigation.home = "/home";
        info.alternatingNavigation.headerClass = "App-header";
        this.props.dispatch(dispatchedGenInfo(info));
        sessionStorage.removeItem('loginSession');
        this.props.history.push('/login');
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
                    <span className="logout" onClick={ this.logOut }>
                        <Lock className="icon" />
                        <span id="btn-text">Log out</span>
                    </span>
                </div>;
    NotLoggedInOptions =
                <div className="signup-login">
                    <NavLink className="signup" onClick={ this.toggleMenu } to={`/signup`}>Sign up</NavLink><span className="div">&#124;</span>
                    <NavLink onClick={ this.toggleMenu } to={`/login`}>Login</NavLink>
                </div>;
    toggleActive = (link)=>{
        console.log(link);
        return false;       
    }

    searchSite = ()=>{
        
    }
    render(){
        let home = this.props.navigation.home,
        profileInfo = sessionStorage.getItem('profileInfo'),
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null;
        return(
            <div className={ this.props.navigation.headerClass }>
                <Image className="App-logo" src={require('images/logo.jpg')} />
                <SearchInput className="search" placeholder="search" search={ this.searchSite } />
                <i class="material-icons menu-icon" onClick={ this.toggleMenu }>menu</i>
                <div className={ this.props.genInfo['info']['menu'] }>
                    <NavLink activeClassName="active" id="home" onClick={ this.toggleMenu } to={ home }>Home</NavLink>
                    { userType === "Owner/Occupier" || userType === null
                    ?<NavLink activeClassName="active" id="listings" onClick={ this.toggleMenu } to={`/listings`}>Listings</NavLink>
                    :null }
                    <NavLink activeClassName="active" id="service-providers" onClick={ this.toggleMenu } to={`/service-providers`}>Service Providers</NavLink>
                    <NavLink activeClassName="active" id="about" onClick={ this.toggleMenu } to={`/about`}>About</NavLink>
                    <NavLink activeClassName="active" id="contact" onClick={ this.toggleMenu } to={`/contact`}>Contact</NavLink>
                <div className="login-social right">
                    { this.socialIcons }
                    { sessionStorage.getItem('loginSession')?this.loggeInOptions:this.NotLoggedInOptions }
                </div>                   
                </div>
            </div>
        )
    }
}

HeaderMain.defaultProps = {
    search: {},
    user: {},
    genInfo: {},
    profileInfo: {}
}

HeaderMain.propTypes = {
    search: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    profileInfo: PropTypes.object
}

export default connect(store=>{
    return {
        search: store.search,
        user: store.user,
        profileInfo: store.user.info.profileInfo,
        genInfo: store.genInfo,
        navigation: store.genInfo.info.alternatingNavigation
    }
})(withRouter(HeaderMain));
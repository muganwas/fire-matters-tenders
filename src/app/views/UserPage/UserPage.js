import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { dispatchedGenInfo } from 'extras/dispatchers';
import { HeaderMain, Footer, SideBar } from 'components';
import './userPage.css';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT,
tokenVerificationEndPoint = process.env.TOKEN_VERIFICATION_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class UserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let info = {...this.props.genInfo.info};
        let sessionInfo = sessionStorage.getItem('loginSession')?JSON.parse(sessionStorage.getItem('loginSession')): {},
        token = sessionInfo.token,
        tokenCheckURL = baseUrl + tokenVerificationEndPoint;
        if(!token)
            this.props.history.push('/login');
        axios.post(tokenCheckURL, {token}).
        then(res=>{
            if(!res.data.uid){
                info.alternatingNavigation.home = "/home";
                info.alternatingNavigation.headerClass = "App-header";
                this.props.dispatch(dispatchedGenInfo(info));
                sessionStorage.removeItem('loginSession');
                this.props.history.push('/login');
            }
            info.alternatingNavigation.headerClass = "App-header-loggedin";
            this.props.dispatch(dispatchedGenInfo(info));    
        }).
        catch(error=>{
            console.log(error);
            info.alternatingNavigation.home = "/home";
            info.alternatingNavigation.headerClass = "App-header";
            this.props.dispatch(dispatchedGenInfo(info));
            sessionStorage.removeItem('loginSession');
            this.props.history.push('/login');
        });
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="user-page mid">
                    <SideBar />
                </div>
                <div className="bottom-alt">
                    <Footer />
                </div>
            </div>
        )
    }
}

UserPage.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

UserPage.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default withRouter(UserPage);
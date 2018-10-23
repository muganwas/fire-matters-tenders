import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
//import { dispatchedUserInfo } from 'extras/dispatchers';
import { HeaderMain, Footer } from 'components';

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
        let sessionInfo = JSON.parse(sessionStorage.getItem('loginSession')),
        token = sessionInfo.token,
        tokenCheckURL = baseUrl + tokenVerificationEndPoint;
        axios.post(tokenCheckURL, {token}).
        then(res=>{
            if(!res.data.uid){
                sessionStorage.removeItem('loginSession');
                this.props.history.push('/login');
            }      
        });
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid">
                    userPage
                </div>
                <div className="bottom">
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
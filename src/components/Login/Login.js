import React from 'react';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from '../../extras/dispatchers';
import Header from '../HeaderMain';
import LoginForm from './LoginForm';
import Footer from '../Footer';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from './extras/helperFunctions';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class Login extends React.Component {
    constructor(props) {
        super(props);
        let user = JSON.parse(localStorage.getItem('user')) || {};
        if(Object.keys(user).length !== 0){
            let token = user.token;
            if(token !== null){
                user['loggedin'] = true;
                this.props.dispatch(dispatchedUserInfo(user));
            }
        }else{
            user['loggedin'] = false;
            this.props.dispatch(dispatchedUserInfo(user));
        }
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <Header />
                </div>
                <div className="mid">
                    <LoginForm />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Login;
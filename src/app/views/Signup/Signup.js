import React from 'react';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from 'extras/dispatchers';
import HeaderAlt from 'components/HeaderAlt/HeaderAlt';
import SignupForm from 'forms/SignupForm/SignupForm';
import Footer from 'components/Footer/Footer';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from 'extras/helperFunctions';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class Signup extends React.Component {
    constructor(props) {
        super(props);
        let user = JSON.parse(localStorage.getItem('user')) || {};
        if(Object.keys(user).length !== 0){
            let token = user.token;
            if(token !== null){
                user['loggedin'] = true;
                this.props.dispatch(dispatchedUserInfo({status: user}));
            }
        }else{
            user['loggedin'] = false;
            this.props.dispatch(dispatchedUserInfo({status: user}));
        }
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderAlt loc="signup" />
                </div>
                <div className="form mid">
                    <SignupForm />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Signup;
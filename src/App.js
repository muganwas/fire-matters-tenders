import React from 'react';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from './extras/dispatchers';
import Header from './components/HeaderMain';
import CallToAction from './components/CallToAction';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from './extras/helperFunctions';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search
    }
})
class App extends React.Component {
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
            user['Loggedin'] = false;
            this.props.dispatch(dispatchedUserInfo(user));
        }
    }
    
    render(){
        return(
            <div className="main">
                <Header />
                <CallToAction />
            </div>
        )
    }
}

export default App;
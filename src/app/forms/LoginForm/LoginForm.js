import React from 'react';
import { connect } from 'react-redux';
import { TextSpace } from 'components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';
import PropTypes from 'prop-types';
import './loginForm.css';
import 'extras/config';
import * as firebase from 'firebase/app';
import 'firebase/auth';

const auth = firebase.auth(),
baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT;

const logginbutton = {
    color: "#fff",
    backgroundColor: "#ED2431",
    margin: "2px 6px"
}

@connect((store)=>{
    return {
        user: store.user,
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info
    }
})
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount(){
        let storedLogin = sessionStorage.getItem('login')?JSON.parse(sessionStorage.getItem('login')): {},
        userInfo = {...this.props.userInfo};
        userInfo.login = storedLogin;
        this.props.dispatch(dispatchedUserInfo(userInfo));
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    login = ()=>{
        auth.signInWithEmailAndPassword(email, password).
        then(res=>{

        });
    }

    errorCheck = (e)=>{
        let info = {...this.props.genInfo},
        value = (e.target.value).trim(),
        fieldClass = e.target.name,
        id = e.target.id,
        newClass = fieldClass + " error",
        label = id + "Class",
        leng = value.length;
        if(!value){
                info[label] = newClass        
        }else{
            if(id === "loginPass" && leng < 6){
                info.errors.loginPasswordError = "Your password is too short";
            }
            info[label] = null;
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }
    
    render(){
        let genInfo = this.props.genInfo,
        userInfo = this.props.userInfo,
        loginPasswordError = genInfo.errors.loginPasswordError;
        return(
            <div className="form login">
                <div className="inputRow">
                    <TextSpace onBlur={ this.errorCheck } value={ userInfo.username } id="username" type="text" adornment="person" placeholder="John Doe" fieldClass={ genInfo.usernameClass || genInfo.textfieldClass } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.errorCheck } value={ userInfo.loginPass } id = "loginPass" type="password" adornment="lock" placeholder="Password" fieldClass={ genInfo.loginPassClass || genInfo.textfieldClass } />
                    { loginPasswordError?<span className="error-feedback">{ loginPasswordError }</span>:null }
                </div>
                <div className="inputRow">
                    <Button onClick={this.login} variant="outlined" style={ logginbutton } className="login-button" >
                        Log In
                    </Button>                
                </div>
                <div className="inputRow">
                    <span>Forgot Password?</span>  <Link to={`/login`} >Reset Password</Link>
                </div>
            </div>
        )
    }
}

LoginForm.defaultProps = {
    user: {},
    genInfo: {},
    search: {}
}

LoginForm.propTypes = {
    user: PropTypes.object,
    genInfo: PropTypes.object,
    search: PropTypes.object
}

export default LoginForm;
import React from 'react';
import { connect } from 'react-redux';
import { TextSpace } from 'components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { Info } from '@material-ui/icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import './loginForm.css';
import 'extras/config';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { emailregex } from 'extras/helperFunctions';

const auth = firebase.auth(),
baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

const logginbutton = {
    color: "#fff",
    backgroundColor: "#ED2431",
    margin: "2px 6px"
}

@connect((store)=>{
    return {
        user: store.user,
        userInfo: store.user.info,
        loginInfo: store.user.info.loginInfo,
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
        let email = this.props.loginInfo.username,
        userInfo = {...this.props.userInfo},
        password = this.props.loginInfo.password;
        auth.signInWithEmailAndPassword(email, password).
        then(res=>{
            let emailAddress = res.user.email,
            verified = res.user.emailVerified;
            if(verified){
                let userUpdateURL = baseUrl + userUpdateEndPoint;
                let userURL = baseUrl + usersEndPoint + "?emailAddress=" + emailAddress;
                axios.get(userURL).
                then(res=>{
                    let userObj = res.data[0],
                    userId = userObj.id,
                    sectTitle = "active",
                    updateData = true;
                    axios.post(userUpdateURL, { userId, sectTitle, updateData }).
                    then(res=>{
                        let data = res.data,
                        active = data.active;
                        if(active){
                            auth.currentUser.getIdToken().then(token=>{
                                let loginSession = { userId, token, emailAddress };
                                userInfo.loginInfo.userDetails = data;
                                this.props.dispatch(dispatchedUserInfo(userInfo));
                                sessionStorage.setItem("loginSession", JSON.stringify(loginSession));
                                //navigate to loggedin page
                                this.props.history.push("/userPage:" + userId);
                            }).
                            catch(error=>{
                                console.log(error.message);
                                userInfo.loginInfo.messageClass = "postSubmitError"
                                userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                                this.props.dispatch(dispatchedUserInfo(userInfo));
                            });
                        }else{
                            userInfo.loginInfo.messageClass = "postSubmitError"
                            userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                        }
                    }).
                    catch(error=>{
                        console.log(error.message);
                        userInfo.loginInfo.messageClass = "postSubmitError"
                        userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                        this.props.dispatch(dispatchedUserInfo(userInfo));
                    });
                }).
                catch(error=>{
                    console.log(error.message);
                    userInfo.loginInfo.messageClass = "postSubmitError"
                    userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                })
            }
        }).
        catch(error=>{
            userInfo.loginInfo.messageClass = "postSubmitError"
            if((error.message).includes("The user may have been deleted.")){
                userInfo.loginInfo.feedback = "Your email address was not found.";
            }else
                userInfo.loginInfo.feedback = error.message;
            this.props.dispatch(dispatchedUserInfo(userInfo));
        });
    }

    errorCheck = (e)=>{
        let info = {...this.props.genInfo},
        userInfo = {...this.props.userInfo},
        value = (e.target.value).trim(),
        fieldClass = e.target.name,
        id = e.target.id,
        newClass = fieldClass + " error",
        label = id + "Class",
        leng = value.length;
        if(!value){
                info[label] = newClass        
        }else{
            if(id === "loginPass"){
                if(leng >= 6){
                    userInfo.loginInfo.password = value;
                    info.errors.loginPasswordError = undefined;
                }else{
                    info.errors.loginPasswordError = "Your password is too short";
                    userInfo.loginInfo.password = ""; 
                }
            }else{
                if(value.match(emailregex)){
                    userInfo.loginInfo.username = value;
                    info.errors.usernameError = undefined;
                }else{
                    info.errors.usernameError = "Wrong email format";
                    userInfo.loginInfo.username = "";
                }                 
            }
            info[label] = null;
        }
        this.props.dispatch(dispatchedUserInfo(userInfo));
        this.props.dispatch(dispatchedGenInfo(info));
    }
    
    render(){
        let genInfo = this.props.genInfo,
        userInfo = this.props.userInfo,
        usernameError = genInfo.errors.usernameError,
        loginPasswordError = genInfo.errors.loginPasswordError,
        postSubmitMessage = this.props.loginInfo.feedback,
        messageClass = this.props.loginInfo.messageClass;
        return(
            <div className="form login">
                { postSubmitMessage?<span className={ messageClass }> <Info className="icon" /> { postSubmitMessage } </span>: null }
                <div className="inputRow">
                    <TextSpace onBlur={ this.errorCheck } value={ userInfo.username } id="username" type="email" adornment="person" placeholder="JohnDoe@email.com" fieldClass={ genInfo.usernameClass || genInfo.textfieldClass } />
                    { usernameError?<span className="error-feedback">{ usernameError }</span>:null }
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
    search: PropTypes.object,
    history: PropTypes.object.isRequired
}

export default LoginForm;
import React from 'react';
import { connect } from 'react-redux';
import { TextSpace, FmButton } from 'components';
import { Link } from 'react-router-dom';
import { dispatchedUserInfo, dispatchedGenInfo, dispatchedButtonInfo } from 'extras/dispatchers';
import { Info } from '@material-ui/icons';
import PropTypes from 'prop-types';
import Rebase from 're-base';
import axios from 'axios';
import './loginForm.css';
import 'extras/config';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import { emailregex } from 'extras/helperFunctions';
import { styles, altStyles} from './styles';

const auth = firebase.auth(),
storageRef = firebase.storage().ref(),
base = Rebase.createClass(firebase.database()),
baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;


@connect((store)=>{
    return {
        user: store.user,
        userInfo: store.user.info,
        loginInfo: store.user.info.loginInfo,
        search: store.search,
        buttonsInfo: store.buttonsInfo.info,
        genInfo: store.genInfo.info
    }
})
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { sWidth: null }
    }

    componentWillMount(){
        let buttonsInfo = {...this.props.buttonsInfo},
        userInfo = {...this.props.userInfo};
        userInfo.loginInfo.feedback = null;
        buttonsInfo.login.active = true;
        this.props.dispatch(dispatchedUserInfo(userInfo));
        this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
    }

    componentDidMount(){
        window.addEventListener("resize", ()=>{
            this.setState({
                sWidth: window.innerWidth
            });
        } );
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    getAvatar = (userId)=>{
        let userInfo = this.props.user.info;
        let avatarURL = "kap";
        return new Promise((resolve, reject)=>{
            base.fetch(`users/${ userId }`, {
                context: this,
                asArray: true,
                then(data){
                    let len = data.length;
                    if( len !== 0){
                        /**Deal with avatar */
                        let fl = data[0][0];
                        let avURL = data[0];
                        //easiest way I could figure out to check for an upload avatar url
                        if(fl === "h"){
                            avatarURL = userInfo.avatarProps.avatarURL = avURL;
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                            resolve({avatarURL});
                        }else{
                            storageRef.child('general/avatar.png').getDownloadURL().then((data)=>{
                                avatarURL = userInfo.avatarProps.avatarURL = data;
                                this.props.dispatch(dispatchedUserInfo(userInfo));
                                resolve({avatarURL});
                            });
                        }
                    }else{
                        storageRef.child('general/avatar.png').getDownloadURL().then((data)=>{
                            avatarURL = userInfo.avatarProps.avatarURL = data;
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                            resolve({avatarURL});
                        }); 
                    }
                }
            });
        });
    }

    login = ()=>{
        let email = this.props.loginInfo.username,
        userInfo = {...this.props.userInfo},
        password = this.props.loginInfo.password,
        buttonsInfo = {...this.props.buttonsInfo};
        buttonsInfo.login.active = false;
        this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
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
                    fullName = userObj.fullName,
                    userType = userObj.userType,
                    phoneNumber = userObj.phoneNumber,
                    emailAddress= userObj.emailAddress,
                    sectTitle = "active",
                    updateData = true;
                    axios.post(userUpdateURL, { userId, sectTitle, updateData }).
                    then(res=>{
                        let data = res.data,
                        active = data.active;
                        if(active){
                            auth.currentUser.getIdToken().then(token=>{
                                this.getAvatar(userId).then(data=>{
                                    let loginSession = { userId, avatarURL:data.avatarURL, emailAddress, userType, fullName, phoneNumber, token };
                                    let profileInfo = userObj;
                                    userInfo.loginInfo.firebaseDetails = data;
                                    userInfo.profileInfo = userObj;
                                    this.props.dispatch(dispatchedUserInfo(userInfo));
                                    sessionStorage.setItem("profileInfo", JSON.stringify(profileInfo));
                                    sessionStorage.setItem("loginSession", JSON.stringify(loginSession));
                                    //dispatch profile information
                                    this.updateProfile(userObj);
                                    //navigate to loggedin page
                                    this.props.history.push("/userPage:" + userId);
                                }).
                                catch(error=>{
                                    console.log(error);
                                    userInfo.loginInfo.messageClass = "postSubmitError"
                                    userInfo.loginInfo.feedback = "Something went wrong while connecting to server.";
                                    buttonsInfo.login.active = true;
                                    this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
                                    this.props.dispatch(dispatchedUserInfo(userInfo));
                                })
                                
                            }).
                            catch(error=>{
                                console.log(error.message);
                                userInfo.loginInfo.messageClass = "postSubmitError"
                                userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                                buttonsInfo.login.active = true;
                                this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
                                this.props.dispatch(dispatchedUserInfo(userInfo));
                            });
                        }else{
                            userInfo.loginInfo.messageClass = "postSubmitError"
                            userInfo.loginInfo.feedback = "Your account is not activated yet.";
                            buttonsInfo.login.active = true;
                            this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                        }
                    }).
                    catch(error=>{
                        console.log(error.message);
                        userInfo.loginInfo.messageClass = "postSubmitError"
                        userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                        buttonsInfo.login.active = true;
                        this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
                        this.props.dispatch(dispatchedUserInfo(userInfo));
                    });
                }).
                catch(error=>{
                    console.log(error.message);
                    userInfo.loginInfo.messageClass = "postSubmitError"
                    userInfo.loginInfo.feedback = "Something went wrong, try agian later.";
                    buttonsInfo.login.active = true;
                    this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                })
            }else{
                userInfo.loginInfo.messageClass = "postSubmitError"
                userInfo.loginInfo.feedback = "Your account is not verified yet.";
                buttonsInfo.login.active = true;
                this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
                this.props.dispatch(dispatchedUserInfo(userInfo));
            }
        }).
        catch(error=>{
            userInfo.loginInfo.messageClass = "postSubmitError"
            if((error.message).includes("The user may have been deleted.")){
                userInfo.loginInfo.feedback = "Your email address was not found.";
            }else
                userInfo.loginInfo.feedback = error.message;
            buttonsInfo.login.active = true;
            this.props.dispatch(dispatchedButtonInfo(buttonsInfo));
            this.props.dispatch(dispatchedUserInfo(userInfo));
        });
    }

    updateProfile = (userData)=>{
        let userInfo = {...this.props.userInfo};
        userInfo.profileInfo = userData;
        this.props.dispatch(dispatchedUserInfo(userInfo));
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

    checkKey = (e)=>{
        let key = e.keyCode;
        if(key === 13)
            this.login();
    }
    
    render(){
        let genInfo = this.props.genInfo,
        userInfo = this.props.userInfo,
        usernameError = genInfo.errors.usernameError,
        loginPasswordError = genInfo.errors.loginPasswordError,
        postSubmitMessage = this.props.loginInfo.feedback,
        messageClass = this.props.loginInfo.messageClass,
        buttonStyle = styles,
        isActive = this.props.buttonsInfo.login.active;
        let vw = this.state.sWidth;
        if(vw < 527){
            buttonStyle = altStyles;
        }
        return(
            <div className="form login">
                { postSubmitMessage?<span className={ messageClass }> <Info className="icon" /> { postSubmitMessage } </span>: null }
                <div className="inputRow">
                    <TextSpace onKeyDown={ this.checkKey } onBlur={ this.errorCheck } value={ userInfo.username } id="username" type="email" adornment="person" placeholder="JohnDoe@email.com" fieldClass={ genInfo.usernameClass || genInfo.textfieldClass } />
                    { usernameError?<span className="error-feedback">{ usernameError }</span>:null }
                </div>
                <div className="inputRow">
                    <TextSpace onKeyDown={ this.checkKey } onBlur={ this.errorCheck } value={ userInfo.loginPass } id = "loginPass" type="password" adornment="lock" placeholder="Password" fieldClass={ genInfo.loginPassClass || genInfo.textfieldClass } />
                    { loginPasswordError?<span className="error-feedback">{ loginPasswordError }</span>:null }
                </div>
                <div className="inputRow button">
                    <FmButton isActive={ isActive } loaderFill = "#fff" variant="contained" onClick={ this.login } styles = { buttonStyle } text="Login" />        
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
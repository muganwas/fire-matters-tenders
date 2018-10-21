import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { statesAustralia} from 'extras/config';
import { emailregex } from 'extras/helperFunctions';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { PreSignup, BasicInformation, AddressInformation } from './SignupViews';
import './signupForm.css';


const auth = firebase.auth(),
baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT;

const signupbutton = {
    color: "#fff",
    backgroundColor: "#ED2431"
}

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class SignupForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        if(sessionStorage.getItem('signup')){
            let storedUser = JSON.parse(sessionStorage.getItem('signup')),
            info = {...this.props.user.info};
            info.userType = storedUser.userType,
            info.fullName = storedUser.fullName,
            info.companyName = storedUser.companyName,
            info.phoneNumber = storedUser.phoneNumber,
            info.mobileNumber = storedUser.mobileNumber,
            info.emailAddress = storedUser.emailAddress,
            info.password = storedUser.password,
            info.state = storedUser.state,
            info.city = storedUser.city,
            info.physicalAddress = storedUser.physicalAddress;
            this.props.dispatch(dispatchedUserInfo(info));
        }  
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    inputValidate = ()=>{
        return new Promise((resolve, reject)=>{
            let event = new MouseEvent('blur');
            let fields = { fullName, companyName, phoneNumber, emailAddress, password, passwordConfirm };
            Object.keys(fields).map(key=>{
                let name = document.getElementById(key);
                setTimeout(()=>{
                    name.dispatchEvent(event);
                }, 5); 
            });
            resolve("all checked");
        });
    }

    nextView = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id;
            let info = {...this.props.genInfo.info},
            userInfo = {...this.props.user.info},
            level = info.signupFormLevel;
            let newLevel = level+1;
            info.signupFormLevel = newLevel;
            userInfo.userType = id;
            this.props.dispatch(dispatchedUserInfo(userInfo));
            this.props.dispatch(dispatchedGenInfo(info));
            resolve("pre-signup props set");
        });
    }

    toAddress = ()=>{
        this.inputValidate().then(()=>{
            let info = {...this.props.genInfo.info},
            userInfo = this.props.user.info,
            errors = info.errors,
            fullName = userInfo.fullName,
            companyName = userInfo.companyName,
            phoneNumber = userInfo.phoneNumber,
            emailAddress = userInfo.emailAddress,
            password = userInfo.password,
            passwordConfirm = userInfo.passwordConfirm,
            termsAndConditions = userInfo.termsAndConditions;

            if(fullName && companyName && phoneNumber && emailAddress && password && passwordConfirm && termsAndConditions ){
                //what to do after all the information is provided
                let alert;
                Object.keys(errors).map(key=>{
                    if(errors[key] !== null)
                        alert = errors[key];
                });
                if( alert === null || alert === undefined)
                    info.signupFormLevel = 3;      
            }else{
                if(!termsAndConditions)
                    info.errors.tmcError = "You have to agree with the TC to continue"; 
                else
                    info.errors.tmcError = null;
            }
            this.props.dispatch(dispatchedGenInfo(info));
        }).
        catch(error=>{
            console.log(error);
            throw error;
        });
    }

    setError = (e)=>{
        let info = {...this.props.genInfo.info},
        value = (e.target.value).trim(),
        fieldClass = e.target.name,
        id = e.target.id,
        newClass = fieldClass + " error",
        label = id + "Class";
        if(!value && (id !== "mobileNumber")){
                info[label] = newClass        
        }else{
            if(id === "phoneNumber" || id === "mobileNumber"){
                let leng = (value.trim()).length;
                switch(leng === 14 || leng < 1){
                    case true:
                        switch(id){
                            case "phoneNumber":
                                info.errors.phoneNumberError = null;
                                info[label] = null;
                            break;
                            case "mobileNumber":
                                info.errors.mobileNumberError = null;
                            break;
                        }
                    break;
                    case false:
                        switch(id){
                            case "phoneNumber":
                                info.errors.phoneNumberError = "Your phone number is too short";
                                info[label] = null;
                            break;
                            case "mobileNumber":
                                info.errors.mobileNumberError = "Your mobile number is too short";
                            break;
                        }
                    break;
                }
            }else{
                let password = this.props.user.info.password,
                passwordConfirm = this.props.user.info.passwordConfirm,
                emailAddress = this.props.user.info.emailAddress;
                if(id === "passwordConfirm" && (password !== passwordConfirm))
                    info.errors.passwordMatchError = "Your passwords don't match";              
                else if(id === "passwordConfirm" && (password === passwordConfirm))
                    info.errors.passwordMatchError = null;
                info[label] = null;
                if(emailAddress && !emailAddress.match(emailregex))
                    info.errors.emailFormatError = "Wrong email format";
                else if(emailAddress && emailAddress.match(emailregex))
                    info.errors.emailFormatError = null;
            }
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    signUp = ()=>{
        let info = {...this.props.user.info},
        genInfo = {...this.props.genInfo.info},
        createUser = baseUrl + usersEndPoint,
        userType = info.userType,
        fullName = info.fullName,
        companyName = info.companyName,
        phoneNumber = (info.phoneNumber).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""),
        mobileNumber = (info.mobileNumber).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""),
        emailAddress = info.emailAddress,
        state = info.state,
        city = info.city,
        physicalAddress = info.physicalAddress,
        password = info.password;
        axios.post(createUser, { userType, fullName, companyName, phoneNumber, mobileNumber, emailAddress, state, city, physicalAddress, password }).
        then(res=>{
            let message = res.data.message;
            if(message){
                genInfo.messages.postSubmitMessage = message;
            }else{
                genInfo.messages.postSubmitMessage = null;
                auth.createUserWithEmailAndPassword(emailAddress, password).
                then((res)=>{
                    console.log(res);          
                }).
                catch(err=>{
                    console.log(err);
                    throw err;
                });
            }
            this.props.dispatch(dispatchedGenInfo(genInfo));
        });        
    }

    setstate = (e)=>{
        return new Promise((resolve, reject)=>{
            let state = e.target.id,
            toBeStored = sessionStorage.getItem('signup')?JSON.parse(sessionStorage.getItem('signup')): {},
            userInfo = {...this.props.user.info};
            userInfo.state = statesAustralia[state];
            toBeStored.state = statesAustralia[state];
            sessionStorage.setItem('signup', JSON.stringify(toBeStored));
            this.props.dispatch(dispatchedUserInfo(userInfo));
            resolve("state set");
        });      
    }
    
    render(){
        let genInfo = {...this.props.genInfo.info},
        userInfo = {...this.props.user.info},
        level = genInfo.signupFormLevel,
        passwordMatchError = genInfo.errors.passwordMatchError,
        phoneNumberError = genInfo.errors.phoneNumberError,
        mobileNumberError = genInfo.errors.mobileNumberError,
        emailFormatError = genInfo.errors.emailFormatError,
        tmcError = genInfo.errors.tmcError,
        selected = userInfo.state,
        postSubmitMessage = genInfo.messages.postSubmitMessage,
        messageClass = genInfo.messages.postSubmitMessageClass;
        
        return(
            <div className="form signup">
             { 
                level === 1?
                <PreSignup nextView={ this.nextView } />:
                level === 2?
                <BasicInformation
                    userInfo={ userInfo }
                    setError={ this.setError }
                    genInfo={ genInfo }
                    phoneNumberError={ phoneNumberError }
                    mobileNumberError={ mobileNumberError }
                    emailFormatError={ emailFormatError }
                    passwordMatchError={ passwordMatchError }
                    tmcError={ tmcError }
                    toAddress={ this.toAddress }
                    signupbutton={ signupbutton }
                 />:
                 level===3?
                <AddressInformation
                    messageClass = { messageClass }
                    postSubmitMessage={ postSubmitMessage }
                    statesAustralia={ statesAustralia }
                    setError={ this.setError }
                    genInfo={ genInfo }
                    userInfo={ userInfo }
                    selected = { selected }
                    setstate = { this.setstate }
                    signup = { this.signUp }
                    signupbutton={ signupbutton }
                />:null }
            </div>
        )
    }
}

SignupForm.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SignupForm.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SignupForm;
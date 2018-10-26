import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { statesAustralia} from 'extras/config';
import { emailregex } from 'extras/helperFunctions';
import { PreSignup, BasicInformation, AddressInformation } from './SignupViews';
import './signupForm.css';


const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT;

const signupbutton = {
    color: "#fff",
    backgroundColor: "#ED2431"
}

@connect((store)=>{
    return {
        user: store.user,
        userInfo: store.user.info,
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
            info.userType = info.signupInfo.userType = storedUser.userType,
            info.fullName = info.signupInfo.fullName = storedUser.fullName,
            info.companyName = info.signupInfo.companyName = storedUser.companyName,
            info.phoneNumber = info.signupInfo.phoneNumber = storedUser.phoneNumber,
            info.mobileNumber = info.signupInfo.mobileNumber = storedUser.mobileNumber,
            info.emailAddress = info.signupInfo.emailAddress = storedUser.emailAddress,
            info.password = info.signupInfo.password = storedUser.password,
            info.state = info.signupInfo.state = storedUser.state,
            info.city = info.signupInfo.city = storedUser.city,
            info.physicalAddress = info.signupInfo.physicalAddress = storedUser.physicalAddress;
            info.termsAndConditions = info.signupInfo.termsAndConditions = storedUser.termsAndConditions;
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
    /** navigate from userType to the next level of the form( basic information ) */
    nextView = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            info = {...this.props.genInfo.info},
            userInfo = {...this.props.user.info},
            toBeStored = sessionStorage.getItem('signup')?JSON.parse(sessionStorage.getItem('signup')): {},
            level = info.signupFormLevel,
            second = info.signUpProgressBar.twoClass,
            newLevel = level+1;
            info.signupFormLevel = newLevel;
            userInfo.signupInfo.userType = toBeStored.userType = id;
            sessionStorage.setItem("signup", JSON.stringify(toBeStored));
            info.signUpProgressBar.twoClass = second + " current";
            this.props.dispatch(dispatchedUserInfo(userInfo));
            this.props.dispatch(dispatchedGenInfo(info));
            resolve("pre-signup props set");
        });
    }

    toAddress = ()=>{
        this.inputValidate().then(()=>{
            let info = {...this.props.genInfo.info},
            userInfo = this.props.user.info.signupInfo,
            errors = info.errors,
            fullName = userInfo.fullName,
            companyName = userInfo.companyName,
            phoneNumber = userInfo.phoneNumber,
            emailAddress = userInfo.emailAddress,
            password = (userInfo.password).trim(),
            passwordConfirm = userInfo.passwordConfirm,
            termsAndConditions = userInfo.termsAndConditions,
            third = info.signUpProgressBar.threeClass;
            if(fullName && companyName && phoneNumber && emailAddress && password && passwordConfirm && termsAndConditions ){   
                //what to do after all the information is provided
                let alert;
                Object.keys(errors).map(key=>{
                    if(errors[key] !== "")
                        alert = errors[key];
                });
                if( alert === "" || alert === undefined ){
                    info.signupFormLevel = 3;
                    info.signUpProgressBar.threeClass = third + " current"; 
                }   
            }else{
                if(!termsAndConditions)
                    info.errors.tmcError = "You have to agree with the TC to continue"; 
                else
                    info.errors.tmcError = undefined;
            }
            this.props.dispatch(dispatchedGenInfo(info));
        }).
        catch(error=>{
            console.log(error);
            throw error;
        });
    }
    /**should have been name errorCheck */
    setError = (e)=>{
        let info = {...this.props.genInfo.info},
        toBeStored = sessionStorage.getItem('signup')?JSON.parse(sessionStorage.getItem('signup')): {},
        userInfo = {...this.props.userInfo},
        value = (e.target.value).trim(),
        leng = value.length,
        fieldClass = e.target.name,
        id = e.target.id,
        newClass = fieldClass + " error",
        label = id + "Class";
        if(!value && (id !== "mobileNumber")){
                info[label] = newClass        
        }else{
            if(id === "phoneNumber" || id === "mobileNumber"){
                switch(leng === 14 || leng < 1){
                    case true:
                        switch(id){
                            case "phoneNumber":
                                info.errors.phoneNumberError = "";
                                info[label] = "";
                                toBeStored[id] = value;
                                sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                                leng === 14?userInfo.signupInfo[id] = value: "";
                            break;
                            case "mobileNumber":
                                info.errors.mobileNumberError = "";
                                toBeStored[id] = value;
                                sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                                leng === 14?userInfo.signupInfo[id] = value: "";
                            break;
                        }
                    break;
                    case false:
                        switch(id){
                            case "phoneNumber":
                                info.errors.phoneNumberError = "Your phone number is too short";
                                userInfo.signupInfo[id] = "";
                                toBeStored[id] = "";
                                sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                                info[label] = "";
                            break;
                            case "mobileNumber":
                                info.errors.mobileNumberError = "Your mobile number is too short";
                                toBeStored[id] = "";
                                sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                                userInfo.signupInfo[id] = "";
                            break;
                        }
                    break;
                }
            }else{
                if(id === "password" || id === "passwordConfirm"){
                    if(leng >= 6){
                        let password = this.props.user.info.password,
                        passwordConfirm = this.props.user.info.passwordConfirm;
                        if((id === "passwordConfirm" && password && (password !== passwordConfirm)) || (id === "password" && passwordConfirm && (password !== passwordConfirm))){
                            info.errors.passwordError = "";
                            info.errors.passwordMatchError = "Your passwords don't match";
                            id === "passwordConfirm"?toBeStored[id] = userInfo.signupInfo[id] = "":toBeStored[id] = userInfo.signupInfo[id] = value;
                            sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                        }          
                        else{
                            info.errors.passwordMatchError = "";
                            info.errors.passwordError = "";
                            toBeStored[id] = userInfo.signupInfo[id] = value;
                            sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                        }
                        info[label] = "";
                    }else{
                        id === "password"?info.errors.passwordError = "Your password should be 6 characters or more.":"";
                        id === "passwordConfirm"?info.errors.passwordMatchError = "There is a problem with your password":"";
                        toBeStored[id] = "";
                        sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                        userInfo.signupInfo[id] = info[label] = "";
                    }
                }else{
                    let emailAddress = this.props.user.info.emailAddress;
                    info[label] = "";
                    if(emailAddress && !emailAddress.match(emailregex)){
                        info.errors.emailFormatError = "Wrong email format";
                        toBeStored[id] ="";
                        sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                        userInfo.signupInfo[id] = "";
                    }else if(emailAddress && emailAddress.match(emailregex)){
                        info.errors.emailFormatError = "";
                        toBeStored[id] = value;
                        sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                        userInfo.signupInfo[id] = value;
                    }else{
                        toBeStored[id] = value;
                        sessionStorage.setItem('signup', JSON.stringify(toBeStored));
                        userInfo.signupInfo[id] = value;
                    }
                }
            }
        }
        this.props.dispatch(dispatchedUserInfo(userInfo));
        this.props.dispatch(dispatchedGenInfo(info));
    }

    signUp = ()=>{
        let info = {...this.props.user.info.signupInfo},
        genInfo = {...this.props.genInfo.info},
        createUser = baseUrl + usersEndPoint,
        userType = info.userType,
        message,
        fullName = info.fullName,
        companyName = info.companyName,
        phoneNumber = (info.phoneNumber).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""),
        mobileNumber = mobileNumber?(info.mobileNumber).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""):undefined,
        emailAddress = info.emailAddress,
        state = info.state,
        city = info.city,
        physicalAddress = info.physicalAddress,
        password = info.password;

        axios.post(createUser, { userType, fullName, companyName, phoneNumber, mobileNumber, emailAddress, state, city, physicalAddress, password }).
        then(res=>{
            message = res.data.message;
            if(message){
                genInfo.messages.postSubmitMessage = message;
                genInfo.messages.messageClass = "postSubmitError";
            }else{
                genInfo.messages.postSubmitMessage = undefined;
                auth.createUserWithEmailAndPassword(emailAddress, password).
                then((res)=>{
                    if(res.additionalUserInfo.isNewUser){

                        auth.currentUser.sendEmailVerification().then(res=>{
                            sessionStorage.removeItem('signup');
                            genInfo.messages.postSubmitMessage = "You signed up successfully, check your " + emailAddress + " inbox for a confirmation email.";
                            genInfo.messages.messageClass = "postSubmitMessage";
                            this.props.dispatch(dispatchedGenInfo(genInfo));
                        }).
                        catch(err=>{
                            message = err.message;
                            genInfo.messages.postSubmitMessage = message;
                            genInfo.messages.messageClass = "postSubmitError";
                            this.props.dispatch(dispatchedGenInfo(genInfo));
                        }); 

                    }else{
                        message = "Something went wrong, please try again";
                        genInfo.messages.postSubmitMessage = message;
                        genInfo.messages.messageClass = "postSubmitError";
                    }         
                }).
                catch(err=>{
                    console.log(err)
                    message = err.message;
                    genInfo.messages.postSubmitMessage = message;
                    genInfo.messages.messageClass = "postSubmitError";
                    this.props.dispatch(dispatchedGenInfo(genInfo));
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
    /** signup progress bar, click to navigate to level */
    goTo = (e)=>{
        let id = e.target.id,
        currentClassName = e.target.className,
        genInfo = {...this.props.genInfo.info},
        currentLevel = genInfo.signupFormLevel;
        if(currentLevel > id || currentClassName.includes("current")){
            genInfo.signupFormLevel = Number (id);
        }
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }
    
    render(){
        let genInfo = {...this.props.genInfo.info},
        userInfo = {...this.props.user.info},
        level = genInfo.signupFormLevel,
        passwordMatchError = genInfo.errors.passwordMatchError,
        phoneNumberError = genInfo.errors.phoneNumberError,
        passwordError = genInfo.errors.passwordError,
        mobileNumberError = genInfo.errors.mobileNumberError,
        emailFormatError = genInfo.errors.emailFormatError,
        tmcError = genInfo.errors.tmcError,
        selected = userInfo.state,
        postSubmitMessage = genInfo.messages.postSubmitMessage,
        messageClass = genInfo.messages.messageClass,
        first = genInfo.signUpProgressBar.oneClass,
        second = genInfo.signUpProgressBar.twoClass,
        third = genInfo.signUpProgressBar.threeClass;
        
        return(
            <div>
                <div className="signup-progress"><span onClick={ this.goTo } id={ 1 } className={ first }>1</span><span className="middle-line"></span><span onClick={ this.goTo } id={ 2 } className={ second }>2</span><span className="middle-line"></span><span onClick={ this.goTo } id={ 3 } className={ third }>3</span></div>
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
                            passwordError = { passwordError }
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
                        />:undefined }
                </div>
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
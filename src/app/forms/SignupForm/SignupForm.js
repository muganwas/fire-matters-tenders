import React from 'react';
import { connect } from 'react-redux';
import './signupForm.css';
import { TickBox, TextSpace, DropDown } from 'components';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { statesAustralia} from 'extras/config';
import { emailregex } from 'extras/helperFunctions';
import auth from 'firebase/auth';

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

    toAddress = ()=>{
        let info = {...this.props.genInfo.info},
        userInfo = this.props.user.info,
        fullName = userInfo.fullName,
        companyName = userInfo.companyName,
        phoneNumber = userInfo.phoneNumber,
        emailAddress = userInfo.emailAddress,
        password = userInfo.password,
        passwordConfirm = userInfo.passwordConfirm,
        termsAndConditions = userInfo.termsAndConditions;
        if(fullName && companyName && phoneNumber && emailAddress && password && passwordConfirm && termsAndConditions ){
            info.signupFormLevel = 2;            
        }else{
            let fields = { fullName: "fullName", companyName: "companyName", phoneNumber: "phoneNumber", emailAddress: "emailAddress", password: "password", passwordConfirm: "passwordConfirm"};
            Object.keys(fields).map(key=>{
                let event = new MouseEvent('blur');
                let name = document.getElementById(key);
                name.dispatchEvent(event);
            });
            if(!termsAndConditions)
                info.errors.tmcError = "You have to agree with the TC to continue"; 
            else
                info.errors.tmcError = null;
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    setError = (e)=>{
        let info = {...this.props.genInfo.info},
        value = e.target.value,
        fieldClass = e.target.name,
        id = e.target.id,
        newClass = fieldClass + " error",
        label = id + "Class";
        if(!value){
                info[label] = newClass        
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
                info.errors.emailFormatError = "You entered a wrong email Address";
            else if(emailAddress && emailAddress.match(emailregex))
                info.errors.emailFormatError = null;
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    signUp = ()=>{
        let info = {...this.props.user.info},
        email = info.emailAddress,
        password = info.password;
        auth.createUserWithEmailAndPassword(email, password).
        then(()=>{
            
        }).
        catch(err=>{
            console.log(err);
            throw err;
        })
        
    }

    setstate = (e)=>{
        return new Promise((resolve, reject)=>{
            let state = e.target.id,
            userInfo = {...this.props.user.info};
            userInfo.state = statesAustralia[state];
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
        emailFormatError = genInfo.errors.emailFormatError,
        tmcError = genInfo.errors.tmcError,
        selected = userInfo.state;
        
        return(
            <div className="form signup">
            { level === 1?
            <div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="fullName" adornment="person" type="text" placeholder="Full Name" fieldClass={ genInfo.fullNameClass || genInfo.textfieldClass } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="companyName" adornment="company" type="text" placeholder="Company Name" fieldClass = { genInfo.companyNameClass || genInfo.textfieldClass } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="phoneNumber" adornment="phone" type="number" placeholder="Phone Number" fieldClass={ genInfo.phoneNumberClass || genInfo.textfieldClass } />
                    { phoneNumberError?<span className="error-feedback">{ phoneNumberError }</span>:null }
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="emailAddress" adornment="email" type="email" placeholder="example@email.com" fieldClass={ genInfo.emailAddressClass || genInfo.textfieldClass } />
                    { emailFormatError?<span className="error-feedback">{ emailFormatError }</span>:null }
                </div> 
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id = "password" type="password" adornment="lock" placeholder="Password" fieldClass={ genInfo.passwordClass || genInfo.textfieldClass } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id = "passwordConfirm" type="password" adornment="lock" placeholder="Confirm password" fieldClass={ genInfo.passwordConfirmClass || genInfo.textfieldClass } />
                    { passwordMatchError?<span className="error-feedback">{ passwordMatchError }</span>:null }
                </div>
                <div className="inputRow">
                    <TickBox dispatcher = { dispatchedUserInfo } placement={ userInfo } id="termsAndConditions" /><span>I accept the <Link to={`/`}>Terms and Conditions</Link></span>
                    { tmcError?<span className="error-feedback">{ tmcError }</span>:null }
                </div>
                <div className="inputRow">
                    <Button onClick={this.toAddress} variant="outlined" style={ signupbutton } className="signupButton" >
                        Proceed
                    </Button>
                </div>
            </div>
            :level===2?
            <div>
                <div className="inputRow">
                    <DropDown className="select" width="300px" options={ statesAustralia } selected={ selected } onChange={ this.setstate } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="city" adornment="place" type="text" placeholder="City" fieldClass={ genInfo.cityClass || genInfo.textfieldClass } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="physicalAddress" adornment="home" type="text" placeholder="Physical Address" fieldClass={ genInfo.physicalAddressClass || genInfo.textfieldClass } />
                </div> 
                <div className="inputRow">
                    <Button onClick={this.signup} variant="outlined" style={ signupbutton } className="signupButton" >
                        Sign Up
                    </Button>
                </div>
            </div>:()=>window.URL.replace(window.origin)
            }
            </div>
        )
    }
}

export default SignupForm;
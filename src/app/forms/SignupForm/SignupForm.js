import React from 'react';
import { connect } from 'react-redux';
import './signupForm.css';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';
import { statesAustralia} from 'extras/config';
import { emailregex } from 'extras/helperFunctions';
import auth from 'firebase/auth';
import { PreSignup, BasicInformation, AddressInformation } from './SignupViews';

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
        })
    }

    phoneNumberInputMask = props=>{
        const { value } = props;
        return <InputMask 
                    value = { value }
                    mask="(+223)9 99 99 99 99"
                    maskChar=" " 
                />
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
            fullName = userInfo.fullName,
            companyName = userInfo.companyName,
            phoneNumber = userInfo.phoneNumber,
            emailAddress = userInfo.emailAddress,
            password = userInfo.password,
            passwordConfirm = userInfo.passwordConfirm,
            termsAndConditions = userInfo.termsAndConditions;

            if(fullName && companyName && phoneNumber && emailAddress && password && passwordConfirm && termsAndConditions ){
                info.signupFormLevel = info.signupFormLevel + 1;
                //what to do after all the information is provided          
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
                info.errors.emailFormatError = "Wrong email format";
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
             { 
                level === 1?
                <PreSignup nextView={ this.nextView } />:
                level === 2?
                <BasicInformation
                    userInfo={ userInfo }
                    setError={ this.setError }
                    genInfo={ genInfo }
                    phoneNumberError={ phoneNumberError }
                    emailFormatError={ emailFormatError }
                    passwordMatchError={ passwordMatchError }
                    tmcError={ tmcError }
                    toAddress={ this.toAddress }
                    signupbutton={ signupbutton }
                 />:
                 level===3?
                <AddressInformation
                    statesAustralia={ statesAustralia }
                    setError={ this.setError }
                    genInfo={ genInfo }
                    selected = { selected }
                    setstate = { this.setstate }
                    signup = { this.signUp }
                    signupbutton={ signupbutton }
                />:null }
            </div>
        )
    }
}

export default SignupForm;
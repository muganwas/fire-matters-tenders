import React from 'react';
import { connect } from 'react-redux';
import './signupForm.css';
import { TickBox, TextSpace } from 'components';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { dispatchedUserInfo, dispatchedGenInfo } from 'extras/dispatchers';

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
        this.state = { textfield: "textfield" }
    }

    toAddress = ()=>{
        let info = {...this.props.genInfo.info};
        let fullName = this.props.user.info.fullName;
        let companyName =this.props.user.info.companyName;
        let phoneNumber = this.props.user.info.phoneNumber;
        let emailAddress = this.props.user.info.emailAddress;
        let password = this.props.user.info.password;
        let passwordConfirm = this.props.user.info.passwordConfirm;
        let termsAndConditions = this.props.user.info.termsAndConditions;
        if(fullName && companyName && phoneNumber && emailAddress && password && passwordConfirm && termsAndConditions ){
            info.signupFormLevel = 2;            
        }else{
            let fields = { fullName: "fullName", companyName: "companyName", phoneNumber: "phoneNumber", emailAddress: "emailAddress", password: "password", passwordConfirm: "passwordConfirm"};
            Object.keys(fields).map(key=>{
                let event = new MouseEvent('blur');
                let name = document.getElementById(key);
                name.dispatchEvent(event);
            });
            if(!termsAndConditions){
                info.tmcError = "You have to agree with the TC to continue"; 
            }else
                info.tmcError = undefined;
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    setError = (e)=>{
        let value = e.target.value;
        let fieldClass = e.target.name;
        let id = e.target.id;
        let newClass = fieldClass + " error";
        let label = id + "Class";
        if(!value){
            this.setState({
                [label]: newClass
            });
        }else{
            this.setState({
                [label]: undefined
            });
        }
    }

    signUp = ()=>{
        
    }
    
    render(){
        let level = this.props.genInfo.info.signupFormLevel;
        let tmcError = this.props.genInfo.info.tmcError;
        return(
            <div className="form signup">
            { level === 1?
            <div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="fullName" adornment="person" type="text" placeholder="Full Name" fieldClass={ this.state.fullNameClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="companyName" adornment="company" type="text" placeholder="Company Name" fieldClass = { this.state.companyNameClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="phoneNumber" adornment="phone" type="number" placeholder="Phone Number" fieldClass={ this.state.phoneNumberClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="emailAddress" adornment="email" type="email" placeholder="example@email.com" fieldClass={ this.state.emailAddressClass || this.state.textfield } />
                </div> 
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id = "password" type="password" adornment="lock" placeholder="Password" fieldClass={ this.state.passwordClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id = "passwordConfirm" type="password" adornment="lock" placeholder="Confirm password" fieldClass={ this.state.passwordConfirmClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TickBox dispatcher = { dispatchedUserInfo } placement={ this.props.user.info } id="termsAndConditions" /><span>I accept the <Link to={`/`}>Terms and Conditions</Link></span>
                    { tmcError?<span className="tmcError">{ tmcError }</span>:null }
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
                    <TextSpace onBlur={ this.setError } id="state" adornment="none" type="text" placeholder="State" fieldClass = { this.state.stateClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="city" adornment="none" type="text" placeholder="City" fieldClass={ this.state.cityClass || this.state.textfield } />
                </div>
                <div className="inputRow">
                    <TextSpace onBlur={ this.setError } id="physicalAddress" adornment="none" type="text" placeholder="Physical Address" fieldClass={ this.state.physicalAddressClass || this.state.textfield } />
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
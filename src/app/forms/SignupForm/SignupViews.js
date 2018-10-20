import React from 'react';
import { TickBox, TextSpace, DropDown, PhoneNumber } from 'components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { dispatchedUserInfo } from 'extras/dispatchers';

export const PreSignup = props=>{
    const { nextView } = props;
    return(
        <div className="pre-signup">
            <div id="service-provider" onClick = { nextView } className="service-provider">I'm a Service Provider</div>
            <div id="owner-occupier" onClick = { nextView } className="owner-occupier">I'm an Owner/Occupier</div>
        </div>
    )
}

export const BasicInformation = props=>{
    const { setError, genInfo, phoneNumberError, emailFormatError, passwordMatchError, tmcError, toAddress, signupbutton, userInfo, phoneNumberInputMask } = props;
    return(
        <div className = "basic-information">
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="fullName" adornment="person" type="text" placeholder="Full Name" fieldClass={ genInfo.fullNameClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="companyName" adornment="company" type="text" placeholder="Company Name" fieldClass = { genInfo.companyNameClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <PhoneNumber onBlur={ setError } id="phoneNumber" adornment="phone" placeholder="Phone Number" fieldClass={ genInfo.phoneNumberClass || genInfo.textfieldClass } />
                { phoneNumberError?<span className="error-feedback">{ phoneNumberError }</span>:null }
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="emailAddress" adornment="email" type="email" placeholder="example@email.com" fieldClass={ genInfo.emailAddressClass || genInfo.textfieldClass } />
                { emailFormatError?<span className="error-feedback">{ emailFormatError }</span>:null }
            </div> 
            <div className="inputRow">
                <TextSpace onBlur={ setError } id = "password" type="password" adornment="lock" placeholder="Password" fieldClass={ genInfo.passwordClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id = "passwordConfirm" type="password" adornment="lock" placeholder="Confirm password" fieldClass={ genInfo.passwordConfirmClass || genInfo.textfieldClass } />
                { passwordMatchError?<span className="error-feedback">{ passwordMatchError }</span>:null }
            </div>
            <div className="inputRow">
                <TickBox dispatcher = { dispatchedUserInfo } placement={ userInfo } id="termsAndConditions" /><span>I accept the <Link to={`/`}>Terms and Conditions</Link></span>
                { tmcError?<span className="error-feedback">{ tmcError }</span>:null }
            </div>
            <div className="inputRow">
                <Button onClick={ toAddress } variant="outlined" style={ signupbutton } className="signupButton" >
                    Proceed
                </Button>
            </div>
        </div>
    ) 
}

export const AddressInformation = props=>{
    const { statesAustralia, selected, setstate, setError, signup, genInfo, signupbutton, } = props;
    return(
        <div>
            <div className="inputRow">
                <DropDown className="select" width="300px" options={ statesAustralia } selected={ selected } onChange={ setstate } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="city" adornment="place" type="text" placeholder="City" fieldClass={ genInfo.cityClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="physicalAddress" adornment="home" type="text" placeholder="Physical Address" fieldClass={ genInfo.physicalAddressClass || genInfo.textfieldClass } />
            </div> 
            <div className="inputRow">
                <Button onClick={ signup } variant="outlined" style={ signupbutton } className="signupButton" >
                    Sign Up
                </Button>
            </div>
        </div>
    )
}
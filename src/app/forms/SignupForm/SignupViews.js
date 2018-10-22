import React from 'react';
import { TickBox, TextSpace, DropDown, PhoneNumber } from 'components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { dispatchedUserInfo } from 'extras/dispatchers';
import { Info } from '@material-ui/icons';
import PropTypes from 'prop-types';

export const PreSignup = props=>{
    const { nextView } = props;
    return(
        <div className="pre-signup">
            <div id="service-provider" onClick = { nextView } className="service-provider">I'm a Service Provider</div>
            <div id="owner-occupier" onClick = { nextView } className="owner-occupier">I'm an Owner/Occupier</div>
        </div>
    )
}

PreSignup.defaultProps = {
    nextView: null
}

PreSignup.propTypes = {
    nextView: PropTypes.func.isRequired
}

export const BasicInformation = props=>{
    const { setError, genInfo, phoneNumberError, emailFormatError, passwordError, passwordMatchError, tmcError, toAddress, signupbutton, userInfo, mobileNumberError } = props;
    return(
        <div className = "basic-information">
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="fullName" value={ userInfo.fullName } adornment="person" type="text" placeholder="Full Name" fieldClass={ genInfo.fullNameClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="companyName" value={ userInfo.companyName} adornment="company" type="text" placeholder="Company Name" fieldClass = { genInfo.companyNameClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <PhoneNumber onBlur={ setError } id="phoneNumber" value={ userInfo.phoneNumber } mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} placeholder="Phone Number" fieldClass={ genInfo.phoneNumberClass || genInfo.textfieldClass } />
                { phoneNumberError?<span className="error-feedback">{ phoneNumberError }</span>:null }
            </div>
            <div className="inputRow">
                <PhoneNumber onBlur={ setError } id="mobileNumber" value={ userInfo.mobileNumber } mask={['(', [0], /\d/, /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]} placeholder="Mobile Number" fieldClass={ genInfo.mobileNumberClass || genInfo.textfieldClass } />
                { mobileNumberError?<span className="error-feedback">{ mobileNumberError }</span>:null }
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="emailAddress" value={ userInfo.emailAddress } adornment="email" type="email" placeholder="example@email.com" fieldClass={ genInfo.emailAddressClass || genInfo.textfieldClass } />
                { emailFormatError?<span className="error-feedback">{ emailFormatError }</span>:null }
            </div> 
            <div className="inputRow">
                <TextSpace onBlur={ setError } id = "password" value={ userInfo.password } type="password" adornment="lock" placeholder="Password" fieldClass={ genInfo.passwordClass || genInfo.textfieldClass } />
                { passwordError?<span className="error-feedback">{ passwordError }</span>:null }
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id = "passwordConfirm" value={ userInfo.passwordConfirm } type="password" adornment="lock" placeholder="Confirm password" fieldClass={ genInfo.passwordConfirmClass || genInfo.textfieldClass } />
                { passwordMatchError?<span className="error-feedback">{ passwordMatchError }</span>:null }
            </div>
            <div className="inputRow">
                <TickBox dispatcher = { dispatchedUserInfo } value={ userInfo.termsAndConditions} placement={ userInfo } id="termsAndConditions" /><span>I accept the <Link to={`/`}>Terms and Conditions</Link></span>
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

BasicInformation.defaultProps = {
    genInfo: {},
    userInfo: {}
}

BasicInformation.propTypes = {
    setError: PropTypes.func,
    genInfo: PropTypes.object.isRequired,
    phoneNumberError: PropTypes.string,
    emailFormatError: PropTypes.string,
    passwordMatchError: PropTypes.string,
    tmcError: PropTypes.string,
    toAddress: PropTypes.func.isRequired,
    signupbutton: PropTypes.object,
    userInfo: PropTypes.object,
    mobileNumberError: PropTypes.string
}

export const AddressInformation = props=>{
    const { statesAustralia, selected, setstate, setError, signup, genInfo, userInfo, signupbutton, postSubmitMessage, messageClass } = props;
    return(
        <div>
            { postSubmitMessage?<span className={ messageClass }> <Info className="icon" /> { postSubmitMessage } </span>: null }
            <div className="inputRow">
                <DropDown onBlur={ setError } id="state" className="select" init="Select state" width="300px" options={ statesAustralia } selected={ selected } onChange={ setstate } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="city" value={ userInfo.city} adornment="place" type="text" placeholder="City" fieldClass={ genInfo.cityClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="physicalAddress" value={ userInfo.physicalAddress } adornment="home" type="text" placeholder="Physical Address" fieldClass={ genInfo.physicalAddressClass || genInfo.textfieldClass } />
            </div> 
            <div className="inputRow">
                <Button onClick={ signup } variant="outlined" style={ signupbutton } className="signupButton" >
                    Sign Up
                </Button>
            </div>
        </div>
    )
}

AddressInformation.defaultProps = {
    statesAustralia: {},
    setstate: null,
    setError: null,
    signup: null,
    genInfo: {},
    signupbutton: {},
    postSubmitMessage: null
}

AddressInformation.propTypes = {
    statesAustralia: PropTypes.object.isRequired, 
    selected: PropTypes.string, 
    setstate: PropTypes.func.isRequired, 
    setError: PropTypes.func.isRequired, 
    signup: PropTypes.func.isRequired, 
    genInfo: PropTypes.object.isRequired,
    signupbutton: PropTypes.object.isRequired,
    postSubmitMessage: PropTypes.string
}
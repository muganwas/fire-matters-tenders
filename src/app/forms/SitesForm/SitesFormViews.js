import React from 'react';
import { TickBox, TextSpace, Textfield, DropDown, UserPhoneNumber, FmButton } from 'components'; 
import { Link } from 'react-router-dom';
import { dispatchedUserInfo } from 'extras/dispatchers';
import { Info } from '@material-ui/icons';
import PropTypes from 'prop-types';

const styles = {
    button: {
      margin: 2,
      padding: '3px 10px',
      fontSize: 14,
      width: "300px",
      backgroundColor: "#ED2431",
      color: "#fff",
      fontWeight: "bold",
      '&:hover': {
        background: '#ED2431',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
      }
    }
},
mandatoryInput = "This field is mandatory.";

export const AddressInformation = props=>{
    const { nextView, styles, states, attributes, onBlur, save, upload, errors, isActive } = props,
    { siteName, siteState } = attributes;
    return(
        <div>
            <div className="el" style={ styles.el }>
                <DropDown 
                    id="sites-siteState"
                    label="State" 
                    className="select" 
                    init={ siteState || "Select State" } 
                    width="330px" 
                    options={ states } 
                    selected={ siteState }
                    onBlur = { onBlur } 
                    onChange={ save }
                />
                { errors.siteContractStatus?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteName"
                    label="Site Name"
                    value={ siteName } 
                    type="text" 
                    placeholder="Your buildings name" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    onBlur = { onBlur }
                    onChange = { save } 
                />
                { errors.siteName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <FmButton
                    loaderFill = "#fff" 
                    variant="contained" 
                    styles = { styles } 
                    text="Next"
                    onClick = { nextView } 
                />
            </div>
        </div>
    )
}

AddressInformation.defaultProps = {
    nextView: null
}

AddressInformation.propTypes = {
    nextView: PropTypes.func.isRequired
}

export const EquipmentInformation = props=>{
    const { setError, 
        genInfo, 
        phoneNumberError, 
        emailFormatError, 
        passwordError, 
        passwordMatchError, 
        tmcError, 
        toAddress, 
        userInfo, 
        signup, 
        isActive,
        postSubmitMessage, 
        messageClass,
        mobileNumberError } = props;
    return(
        <div className = "basic-information">
            { postSubmitMessage?<span className={ messageClass }> <Info className="icon" /> { postSubmitMessage } </span>: null }
            {/*<div className="inputRow">
                <TextSpace onBlur={ setError } id="fullName" value={ userInfo.fullName } adornment="person" type="text" placeholder="Full Name" fieldClass={ genInfo.fullNameClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <TextSpace onBlur={ setError } id="companyName" value={ userInfo.companyName} adornment="company" type="text" placeholder="Company Name" fieldClass = { genInfo.companyNameClass || genInfo.textfieldClass } />
            </div>
            <div className="inputRow">
                <UserPhoneNumber onBlur={ setError } id="phoneNumber" value={ userInfo.phoneNumber } mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]} placeholder="Phone Number" fieldClass={ genInfo.phoneNumberClass || genInfo.textfieldClass } />
                { phoneNumberError?<span className="error-feedback">{ phoneNumberError }</span>:null }
            </div>
            <div className="inputRow">
                <UserPhoneNumber onBlur={ setError } id="mobileNumber" value={ userInfo.mobileNumber } mask={['(', [0], /\d/, /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]} placeholder="Mobile Number" fieldClass={ genInfo.mobileNumberClass || genInfo.textfieldClass } />
                { mobileNumberError?<span className="error-feedback">{ mobileNumberError }</span>:null }
            </div>*/}
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
                <FmButton isActive={ isActive } variant="contained" onClick={ signup } styles = { styles } text="Sign Up" /> 
            </div>
        </div>
    ) 
}

EquipmentInformation.defaultProps = {
    genInfo: {},
    userInfo: {}
}

EquipmentInformation.propTypes = {
    setError: PropTypes.func,
    genInfo: PropTypes.object.isRequired,
    phoneNumberError: PropTypes.string,
    emailFormatError: PropTypes.string,
    passwordMatchError: PropTypes.string,
    tmcError: PropTypes.string,
    signup: PropTypes.func.isRequired,
    signupbutton: PropTypes.object,
    userInfo: PropTypes.object,
    mobileNumberError: PropTypes.string
}

export const ContractInformation = props=>{
    const { nextView } = props;
    return(
        <div className="pre-signup">
            <div id="service_provider" onClick = { nextView } className="service-provider">I'm a Service Provider</div>
            <div id="owner_occupier" onClick = { nextView } className="owner-occupier">I'm an Owner/Occupier</div>
        </div>
    )
}

ContractInformation.defaultProps = {
    nextView: null
}

ContractInformation.propTypes = {
    nextView: PropTypes.func.isRequired
}
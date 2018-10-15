import React from 'react';
import { connect } from 'react-redux';
import './signupForm.css';
import { TickBox, TextSpace } from 'components';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { dispatchedUserInfo } from 'extras/dispatchers';

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

    signUp = ()=>{
        
    }
    
    render(){
        return(
            <div className="form signup">
            <div className="inputRow">
                <TextSpace id="full_name" adornment="person" type="text" placeholder="Full Name" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextSpace id="company_name" adornment="company" type="text" placeholder="Company Name" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextSpace id="phone_number" adornment="phone" type="number" placeholder="Phone Number" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextSpace id="email_address" adornment="email" type="email" placeholder="example@email.com" fieldClass="textfield" />
            </div> 
            <div className="inputRow">
                <TextSpace id = "password" type="password" adornment="lock" placeholder="Password" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextSpace id = "password_confirm" type="password" adornment="lock" placeholder="Confirm password" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TickBox dispatcher = { dispatchedUserInfo } placement={ this.props.user.info } id="terms_and_conditions" /><span>I accept the <Link to={`/`}>Terms and Conditions</Link></span>
            </div>
            <div className="inputRow">
                <Button onClick={this.signUp} variant="outlined" style={ signupbutton } className="signup-button" >
                    Sign Up
                </Button>
            </div>
            </div>
        )
    }
}

export default SignupForm;
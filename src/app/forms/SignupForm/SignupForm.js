import React from 'react';
import { connect } from 'react-redux';
import './signupForm.css';
import { PasswordField, CheckBox, TextField } from 'components';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

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
            <span className="form-header">Sign Up</span>
            <div className="inputRow">
                <TextField id="first_name" type="text" placeholder="First Name" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextField id="last_name" type="text" placeholder="Last Name" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextField id="company_name" type="text" placeholder="Company Name" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextField id="phone_number" type="number" placeholder="Phone Number" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextField id="email_address" type="email" placeholder="example@email.com" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <TextField id="email_confirm" type="email" placeholder="example@email.com" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <PasswordField id="password" type="password" placeholder="Password" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <PasswordField id="password_confirm" type="password" placeholder="Password" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <CheckBox id="terms_and_conditions" /><span>I accept the <Link to={`/`}>Terms and Conditions</Link></span>
            </div>
            <div className="inputRow">
                <Button onClick={this.signUp} variant="outlined" className="signup-button" >
                    Sign Up
                </Button>
            </div>
            </div>
        )
    }
}

export default SignupForm;
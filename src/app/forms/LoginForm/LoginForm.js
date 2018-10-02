import React from 'react';
import { connect } from 'react-redux';
import './loginForm.css';
import { PasswordField, TextSpace } from 'components';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const logginbutton = {
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
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    login = ()=>{
        
    }
    
    render(){
        return(
            <div className="form login">
            <div className="inputRow">
                <TextSpace id="username" adornment="person" placeholder="John Doe" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <PasswordField id="password" placeholder="Password" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <Button onClick={this.login} variant="outlined" style={ logginbutton } className="login-button" >
                    Log In
                </Button>                
            </div>
            <div className="inputRow">
                <span>Forgot Password?</span>  <Link to={`/login`} >Reset Password</Link>
            </div>
            </div>
        )
    }
}

export default LoginForm;
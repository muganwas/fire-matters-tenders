import React from 'react';
import { connect } from 'react-redux';
import './login.css';
import PasswordField from '../PasswordField/PasswordField';
import Textfield from './../TextField/Textfield';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

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
            <div className="login">
            <span className="form-header">Log in</span>
            {/*<Avatar className="avatar" >
                <i className="material-icons">face</i>
            </Avatar>*/}
            <div className="inputRow">
                <i className="material-icons left">perm_identity</i>
                <Textfield id="username" placeholder="John Doe" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <i className="material-icons left">lock_open</i>
                <PasswordField id="password" placeholder="Password" fieldClass="textfield" />
            </div>
            <div className="inputRow">
                <i className="material-icons left white">lock_open</i>
                <Button onClick={this.login} variant="outlined" className="login-button" >
                    Log In
                </Button>                
            </div>
            <div className="inputRow">
                <i className="material-icons left white">lock_open</i>
                <span>Forgot Password?</span>  <Link to={`/login`} >Reset Password</Link>
            </div>
            </div>
        )
    }
}

export default LoginForm;
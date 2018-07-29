import React from 'react';
import './passwordField.css';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from '../../extras/dispatchers';
import TextField from '@material-ui/core/TextField';

@connect((store)=>{
    return {
        user: store.user
    }
})
class PasswordField extends React.Component {
    handleText=(e)=>{
        let fieldValue = e.target.value;
        let currLoginInfo = {...this.props.user.info.logins};
        let label = this.props.id;
        currLoginInfo[label] = fieldValue;
        this.props.dispatch(dispatchedUserInfo({logins:currLoginInfo}));
    }
    
    render(){
        return(
            <div>
                <TextField
                    id={this.props.id}
                    InputProps={{
                        disableUnderline: true,
                        classes: {
                            root: this.props.fieldClass,
                        },
                    }}
                    placeholder={this.props.placeholder}
                    onChange={this.handleText}
                    type="password"
                >
                </TextField>
            </div>
        )
    }
}

export default PasswordField;
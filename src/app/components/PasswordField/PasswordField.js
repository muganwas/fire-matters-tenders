import React from 'react';
import './passwordField.css';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from 'extras/dispatchers';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Lock from '@material-ui/icons/Lock';

@connect((store)=>{
    return {
        user: store.user
    }
})
class PasswordField extends React.Component {
    componentWillMount(){
        
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    
    handleText=(e)=>{
        let fieldValue = e.target.value;
        let currUserInfo = {...this.props.user.info};
        let label = this.props.id;
        currUserInfo[label] = fieldValue;
        this.props.dispatch(dispatchedUserInfo(currUserInfo));
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
                        startAdornment: (<InputAdornment className="gray" position="start">{<Lock />}</InputAdornment>)
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
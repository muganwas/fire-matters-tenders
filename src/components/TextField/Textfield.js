import React from 'react';
import './textfield.css';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from '../../extras/dispatchers';
import TextField from '@material-ui/core/TextField';

@connect((store)=>{
    return {
        user: store.user
    }
})
class Textfield extends React.Component {
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
                    className={this.props.fieldClass}
                    InputProps={{
                        disableUnderline: true,
                        classes: {
                            root: this.props.fieldClass,
                        },
                    }}
                    onChange={this.handleText}
                    placeholder={this.props.placeholder}
                    type="text"
                >
                </TextField>
            </div>
        )
    }
}

export default Textfield;
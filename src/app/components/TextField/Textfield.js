import React from 'react';
import './textField.css';
import { connect } from 'react-redux';
import { dispatchedTextFieldInfo } from 'extras/dispatchers';
import TextField from '@material-ui/core/TextField';

@connect((store)=>{
    return {
        user: store.user
    }
})
export default class Textfield extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    handleText=(e)=>{
        let fieldValue = e.target.value;
        let currUserInfo = {...this.props.user.info};
        let label = this.props.id;
        currUserInfo[label] = fieldValue;
        this.props.dispatch(dispatchedTextFieldInfo(currUserInfo));
    }

    render(){
        return(
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
                type={this.props.type}
            >
            </TextField>
        )
    }
}
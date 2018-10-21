import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import './textSpace.css';
import { dispatchedUserInfo } from 'extras/dispatchers';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Email, Work, Phone, Lock, Map, Place, Home } from '@material-ui/icons';


@connect((store)=>{
    return {
        user: store.user
    }
})
class TextSpace extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    adornment = ()=>{
        let adornment;
        switch(this.props.adornment){
            case "person":
                adornment = <AccountCircle />;
                break;
            case "company":
                adornment = <Work />;
                break;
            case "email":
                adornment = <Email />;
                break;
            case "phone":
                adornment = <Phone />;
                break;
            case "lock":
                adornment = <Lock />;
                break;
            case "map":
                adornment = <Map />;
                break;
            case "place":
                adornment = <Place />;
                break;
            case "home":
                adornment = <Home />;
                break;
            case "none":
                adornment = "";
                break;
            default:
                adornment = "0_0";          
        }
        return adornment;
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    handleText=(e)=>{
        let fieldValue = e.target.value,
        toBeStored = sessionStorage.getItem('signup')?JSON.parse(sessionStorage.getItem('signup')): {},
        currUserInfo = {...this.props.user.info},
        label = this.props.id;
        currUserInfo[label] = fieldValue;
        toBeStored[label] = fieldValue;
        sessionStorage.setItem('signup', JSON.stringify(toBeStored));
        this.props.dispatch(dispatchedUserInfo(currUserInfo));
    }

    render(){
        return(
            <TextField
                id={this.props.id}
                className={ this.props.fieldClass }
                InputProps={{
                    disableUnderline: true,
                    classes: {
                        root: this.props.fieldClass,
                    },
                    startAdornment: (<InputAdornment className="gray" position="start">{this.adornment()}</InputAdornment>)
                }}
                value = { this.props.value }
                name = {this.props.fieldClass}
                onBlur = { this.props.onBlur }
                onChange = {this.handleText}
                placeholder = {this.props.placeholder}
                type = {this.props.type}
            >
            </TextField>
        )
    }
}

TextSpace.defaultProps = {
    user: {},
    adornment: "0_0",
    type: "text",
    value: ""
}

TextSpace.propTypes = {
    user: PropTypes.object.isRequired,
    adornment: PropTypes.string,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    value: PropTypes.string
}

export default TextSpace;
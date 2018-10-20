import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import './phoneNumber.css';
import { dispatchedUserInfo } from 'extras/dispatchers';
import MaskedInput from 'react-text-mask';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Phone } from '@material-ui/icons';


@connect((store)=>{
    return {
        user: store.user
    }
})
class PhoneNumber extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    handleText=(e)=>{
        let fieldValue = e.target.value;
        let currUserInfo = {...this.props.user.info};
        let label = this.props.id;
        currUserInfo[label] = fieldValue;
        if(fieldValue)
            this.props.dispatch(dispatchedUserInfo(currUserInfo));
    }

    render(){
        return(
            <MaskedInput
                id={this.props.id}
                className={ this.props.fieldClass }
                name = {this.props.fieldClass}
                onBlur = { this.props.onBlur }
                onChange={this.handleText}
                placeholder={this.props.placeholder}
                mask={['(', 0, /[0-9]/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                placeholderChar={'\u2000'}
            />
        )
    }
}

PhoneNumber.defaultProps = {
    user: {},
    adornment: "0_0",
    type: "text"
}

PhoneNumber.propTypes = {
    user: PropTypes.object.isRequired,
    adornment: PropTypes.string,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    onBlur: PropTypes.func
}

export default PhoneNumber;
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import './phoneNumber.css';
import { dispatchedUserInfo } from 'extras/dispatchers';
import MaskedInput from 'react-text-mask';

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
            <MaskedInput
                id={this.props.id}
                className={ this.props.fieldClass }
                name = {this.props.fieldClass}
                onBlur = { this.props.onBlur }
                value={ this.props.value }
                onChange={this.handleText}
                placeholder={this.props.placeholder}
                mask={this.props.mask}
                placeholderChar={'\u2000'}
            />
        )
    }
}

PhoneNumber.defaultProps = {
    user: {},
    adornment: "0_0",
    type: "text",
    value: null
}

PhoneNumber.propTypes = {
    user: PropTypes.object.isRequired,
    adornment: PropTypes.string,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    mask: PropTypes.array.isRequired,
    value: PropTypes.string
}

export default PhoneNumber;
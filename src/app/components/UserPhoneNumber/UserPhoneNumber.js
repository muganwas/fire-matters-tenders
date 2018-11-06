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
class UserPhoneNumber extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
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
            <div>
                { this.props.label?<span className="label">{ this.props.label }</span>: null }
                <div className={ this.props.fieldClass }>
                    <MaskedInput
                        id={this.props.id}
                        title="number"
                        style={{
                                width: "90%",
                                border: "none",
                                boxShadow: "none"
                            }}
                        name = {this.props.fieldClass}
                        onBlur = { this.props.onBlur }
                        value={ this.props.value }
                        onChange={this.handleText}
                        placeholder={this.props.placeholder}
                        mask={this.props.mask}
                        placeholderChar={'\u2000'}
                    />
                </div>
            </div>
        )
    }
}

UserPhoneNumber.defaultProps = {
    user: {},
    adornment: "0_0",
    type: "text",
    value: "",
    label: null,
}

UserPhoneNumber.propTypes = {
    user: PropTypes.object.isRequired,
    adornment: PropTypes.string,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    mask: PropTypes.array.isRequired,
    value: PropTypes.string,
    label: PropTypes.string
}

export default UserPhoneNumber;
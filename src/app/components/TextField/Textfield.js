import React from 'react';
import { connect } from 'react-redux';

import './textField.css';
import { PropTypes } from 'prop-types';

import { dispatchedTextFieldInfo } from 'extras/dispatchers';
import TextField from '@material-ui/core/TextField';


@connect((store)=>{
    return {
        user: store.user,
        textFields: store.textFields.info
    }
})
class Textfield extends React.Component {
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
            <div>
                { this.props.label?<span className="label">{ this.props.label }</span>: null }
                <div className={this.props.fieldClass}>
                    <TextField
                        id={this.props.id}
                        style={{width: "100%"}}
                        InputProps={{
                            disableUnderline: true,
                            classes: {
                                root: this.props.root,
                            },
                        }}
                        value={this.props.value}
                        onChange={this.handleText}
                        placeholder={this.props.placeholder}
                        type={this.props.type}
                    >
                    </TextField>
                </div>
            </div>
        )
    }
}

Textfield.defaultProps = {
    user: {},
    type: "text",
    value: "",
    label: null
}

Textfield.propTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string
}

export default Textfield;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './messageForm.css';
import { Textfield, FmButton } from 'components';

const MessageForm = props=>{
    const { 
        feedback,
        feedbackClass,
        styles, 
        close, 
        attributes,
        upload, 
        save,
        onBlur,  
        errors
    } = props,
    { 
        messageBody,
        submitButton 
    } = attributes,
    mandatoryInput = "This field is mandatory.",
    isActive = submitButton.isActive;

    return(
        <div className="listing-form-container">
            <div className="listing-form-subcontainer">
                <div className="header">
                    <span id="header-text">Post Comment</span>
                    <span className="right" onClick={ close } id="close">&#x2716;</span>
                </div>
                <div className="listing-form">
                    <div className="information" style={ styles.information }>
                    <div className="el" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="messages-messageBody"
                                label="Comment Body"
                                value={ messageBody } 
                                type="text" 
                                multiline
                                placeholder="Compose comment" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.messageBody?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <FmButton
                                isActive={ isActive } 
                                loaderFill = "#fff" 
                                variant="contained" 
                                styles = { styles } 
                                text="Submit Comment"
                                onClick = { upload } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

MessageForm.defaultProps = {
    states: null,
    close: undefined,
}

MessageForm.propTypes = {
    close: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    upload: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
}

export default connect(store=>{
    return {
        userInfo: store.user.info,
        messagesInfo: store.messages.info
    }
})(MessageForm);
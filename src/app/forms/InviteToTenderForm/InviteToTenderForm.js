import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import './inviteToTenderForm.css';
import { Textfield, FmButton } from 'components';
import { styles } from './styles';
import { dispatchedTendersInfo } from 'extras/dispatchers';

const baseUrl = process.env.BACK_END_URL,
sendEmailEndPoint = process.env.SEND_EMAIL_END_POINT;

class InviteToTenderForm extends React.Component { 

    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    sendTenderInvite = ()=>{
        let tendersInfo = {...this.props.tendersInfo},
        sender = tendersInfo.inviteToTender.sender,
        recipient = tendersInfo.inviteToTender.recipient,
        currTenderType = tendersInfo.inviteToTender.currTenderType,
        currLister = tendersInfo.inviteToTender.currLister,
        subject = "INVITE TO SUBMIT TENDER BY " + currLister,
        message = tendersInfo.inviteToTender.message,
        body = "<span>" + message + "</span>",
        url = baseUrl + sendEmailEndPoint;
        if(message === undefined || message.length === 0){
            tendersInfo.inviteToTender.error = true;
            this.props.dispatch(dispatchedTendersInfo(tendersInfo));
            this.forceUpdate();
        }else{
            tendersInfo.inviteToTender.submitButton.isActive = false;
            this.props.dispatch(dispatchedTendersInfo(tendersInfo));
            this.forceUpdate();
            axios.post(url, { sender, recipient, subject, body }).then(res=>{
                if(res.data.message){
                    tendersInfo.inviteToTender.feedback = "Tender Invite Sent";
                    tendersInfo.inviteToTender.feedbackClass = "success";
                    tendersInfo.inviteToTender.submitButton.isActive = true;
                    this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                    this.forceUpdate();
                }            
            }).
            catch(err=>{
                console.log(err);
            });
        }
    }

    render(){
        let { 
            save,
            inviteToTender,
            close,
            dummy,
            tendersInfo,
            submitButton,
        } = this.props,
        messageBody = inviteToTender?inviteToTender.message: "",
        text = submitButton?submitButton.text:"",
        mandatoryInput = "This field is mandatory",
        feedbackClass = tendersInfo.inviteToTender.feedbackClass,
        feedback = tendersInfo.inviteToTender.feedback,
        error = tendersInfo.inviteToTender.error,
        isActive = submitButton?submitButton.isActive:true;
        return(
            <div className="listing-form-container">
                <div className="listing-form-subcontainer">
                    <div className="header">
                        <span id="header-text">Send Tender Invite</span>
                        <span className="right" onClick={ close } id="close">&#x2716;</span>
                    </div>
                    <div className="listing-form">
                        <div className="information" style={ styles.information }>
                        <div className="el" style={ styles.el }>
                            { 
                                feedback?
                                <span className={ feedbackClass }>
                                    { feedback }
                                </span>:
                                null 
                            }
                        </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="tenders-inviteToTender"
                                    label="Message Body"
                                    value={ messageBody } 
                                    type="text" 
                                    multiline
                                    placeholder="Compose Message" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    upload = { dummy }
                                    save = { save } 
                                />
                                { error?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <FmButton
                                    isActive={ isActive } 
                                    loaderFill = "#fff" 
                                    variant="contained" 
                                    styles = { styles } 
                                    text={ text }
                                    onClick = { this.sendTenderInvite } 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

InviteToTenderForm.defaultProps = {
    save: undefined,
    close: undefined,
    inviteToTender: {}
}

InviteToTenderForm.propTypes = {
    close: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    inviteToTender: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        userInfo: store.user.info,
        tendersInfo: store.tenders.info,
        submitButton: store.tenders.info.inviteToTender.submitButton,
        inviteToTender: store.tenders.info.inviteToTender
    }
})(InviteToTenderForm);
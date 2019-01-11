import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber, FmButton } from 'components';
import { dispatchedUserInfo } from 'extras/dispatchers';
import {  statesAustralia } from 'extras/config';
import { submit_styles } from './styles';
import axios from 'axios';
import './companyTab.css';

const baseURL = process.env.BACK_END_URL,
sendEmailEndPoint = process.env.SEND_EMAIL_END_POINT,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

class CompanyTab extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillMount(nextProps){
        this.props = {...nextProps}
    }

    sendAdditionRequest = ()=>{
        let { userInfo, user } = this.props,
        companyInformation = userInfo,
        recipient = companyInformation.companyAddUser,
        companyName = companyInformation.companyName,
        emailAddress = companyInformation.emailAddress,
        companyId = companyInformation.id,
        sender  = companyInformation.emailAddress,
        currAddress = window.location.hostname,
        addAddress = currAddress + "/addUser?companyId=" + companyId + "&email=" + recipient,
        subject = "INVITATION TO FIRE-MATTERS TENDERS",
        body = "<p> You have been invited by " 
        + emailAddress 
        + " to subscribe as a company user.<br/> Click the link below to accept the invitation. <br/> <a href='"
        + addAddress 
        +"'>"
        + addAddress 
        + "</a> </p>",
        url = baseURL + sendEmailEndPoint;
        
        if(recipient){
            user.addCompanyUser.submitButton.isActive = false;
            this.props.dispatch(dispatchedUserInfo(user));
            this.forceUpdate();
            axios.post(url, { sender, recipient, subject, body }).then(res=>{
                if(res.data.message){
                    console.log(res.data.message)
                    user.addCompanyUser.submitButton.text = "Email Sent, Send Another";
                    user.addCompanyUser.submitButton.isActive = true;
                    this.props.dispatch(dispatchedUserInfo(user));
                    this.forceUpdate();
                }else{
                    user.addCompanyUser.submitButton.text = "There was Error, Resend";
                    user.addCompanyUser.submitButton.isActive = true;
                    this.props.dispatch(dispatchedUserInfo(user));
                    this.forceUpdate();
                }
            }).
            catch(err=>{
                console.log(err);
                user.addCompanyUser.submitButton.text = "There was Error, Resend";
                user.addCompanyUser.submitButton.isActive = true;
                this.props.dispatch(dispatchedUserInfo(user));
                this.forceUpdate();
            });
        }  
    }

    removeCompnayUser = (e)=>{
        let { userInfo, user } = this.props;
        userInfo = userInfo?userInfo:JSON.parse(sessionStorage.getItem('profileInfo'));
        let companyInformation = userInfo,
        companyUsers = companyInformation.companyUsers || {},
        updateURL = baseURL + userUpdateEndPoint,
        mainUserId = companyInformation.id,
        userId = e.target.id;

        Object.keys(companyUsers).map(key=>{
            if(key === userId){
                delete companyUsers[key];
            }
        });

        user.profileInfo.companyUsers = companyUsers;
        axios.post(updateURL, { userId: mainUserId, sectTitle: "companyUsers", updateData: companyUsers }).
        then(res=>{
            if(res.data){
                this.props.dispatch(dispatchedUserInfo(user));
                this.forceUpdate();
            }
        });
    }

    renderCompanyUsers = (key)=>{
        let { userInfo } = this.props;
        userInfo = userInfo?userInfo:JSON.parse(sessionStorage.getItem('profileInfo'));
        let companyInformation = userInfo,
        companyUsers = companyInformation.companyUsers || {};
        if(companyUsers[key]){
            return(
                <div className="serviceCategory" key = { key }>
                    { key }
                    <span 
                        className="close right"  
                        onClick = { this.removeCompnayUser } 
                        id={ key }
                    >
                        &#x2716;
                    </span>
                </div>
            )
        }else
            return null;

    }

    render(){

        let { userInfo, user } = this.props;
        userInfo = userInfo?userInfo:JSON.parse(sessionStorage.getItem('profileInfo'));
        let companyInformation = userInfo || {},
        emailAddress = companyInformation.companyEmailAddress,
        companyUsers = companyInformation.companyUsers || {},
        companyUsersCount = Object.keys(companyUsers).length,
        phoneNumber = companyInformation.companyPhoneNumber?(companyInformation.companyPhoneNumber).toString():undefined,
        website = companyInformation.companyWebsite,
        state = companyInformation.companyState,
        city = companyInformation.companyCity,
        physicalAddress = companyInformation.companyPhysicalAddress,
        postCode = companyInformation.companyPostCode,
        acn_abn = companyInformation.company_acn_abn,
        companyName = companyInformation.companyName,
        contactName = companyInformation.companyRepFullName,
        contactEmail = companyInformation.companyRepEmailAddress,
        contactPhone = companyInformation.companyRepPhoneNumber,
        contactPosition = companyInformation.companyRepPosition,
        userToBeAdded = companyInformation.companyAddUser,
        isActive = user?user.addCompanyUser.submitButton.isActive:true,
        inviteUser = user?user.addCompanyUser.submitButton.text: "Invite User";

        const upload=(sectTitle, updateData)=>{
            return new Promise((resolve, reject)=>{
                let userId = userInfo.id,
                updateInfoUrl = baseURL + userUpdateEndPoint,
                updateObject = {userId, sectTitle, updateData};
                axios.post(updateInfoUrl, updateObject).
                then(res=>{
                    resolve(res);
                }).
                catch(err=>{
                    reject(err);
                })
            });
        };
        const save=(e)=>{
            e.persist();
            return new Promise((resolve, reject)=>{
                let userInfo = {...user},
                id = e.target.id,
                origName = e.target.getAttribute("category");
                origName = origName?origName:id;
                let nameArr = origName.split("-"),
                name = nameArr[1],
                value = e.target.getAttribute('value');
                value = value?value:e.target.value;
                userInfo.profileInfo[name] = value;
                if(userInfo)                     
                    resolve(userInfo);
                else
                    reject({message: "No data"});
            });
        };

        return(
            <div className="main-content">
                <div className="half left">
                    <div className="heading">Company Information(Optional) <div className="bottom-border"></div></div>
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="profile-companyName"
                                label="Company Name"
                                value={ companyName } 
                                type="text" 
                                placeholder="J & J Doe" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyEmailAddress" 
                                value={ emailAddress }
                                label="Email Address"
                                type="email" 
                                placeholder="Johndoe@email.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save } 
                            />
                        </div>
                        <div className="el">
                            <PhoneNumber 
                                id="profile-companyPhoneNumber"
                                label = "Phone Number"
                                value={ phoneNumber }  
                                mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder="(07) 9999-9999"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyWebsite" 
                                value={ website }
                                label="Website"
                                type="text" 
                                placeholder="www.website.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }  
                            />
                        </div>
                        <div className="el">
                                <DropDown 
                                    label="State" 
                                    id="profile-companyState" 
                                    className="select" 
                                    init={ state } 
                                    width="330px" 
                                    options={ statesAustralia } 
                                    selected={ state || "Qld" } 
                                    onChange={ save }
                                    onBlur={ upload }
                                    onChange = { save }
                                />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyCity"
                                label="City/Suburb"
                                value={ city } 
                                type="text" 
                                placeholder="City/Suburb" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyStreet"
                                label="Physical Address"
                                value={ physicalAddress } 
                                type="text" 
                                placeholder="Street Address" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }  
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyPostCode"
                                label="Post Code"
                                value={ postCode } 
                                type="text" 
                                placeholder="POST/ZIP CODE" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }  
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-company_acn_abn"
                                label="ACN/ABN"
                                value={ acn_abn } 
                                type="text" 
                                placeholder="Bank Account Number" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save } 
                            />
                        </div>
                        
                    </div>
                </div>
                <div className="half left">
                    <div className="heading">Company Contact Person(Optional) <div className="bottom-border"></div></div>
                        <div className="information">
                            <div className="el">
                                <Textfield 
                                    id="profile-companyRepFullName"
                                    label="Full Name"
                                    value={ contactName } 
                                    type="text" 
                                    placeholder="John Doe" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-companyRepEmailAddress" 
                                    value={ contactEmail }
                                    label="Email Address"
                                    type="email" 
                                    placeholder="Johndoe@email.com" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            <div className="el">
                                <PhoneNumber 
                                    id="profile-companyRepPhoneNumber"
                                    label = "Phone Number"
                                    value={ contactPhone }  
                                    mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    placeholder="(07) 9999-9999"
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-companyRepPosition" 
                                    value={ contactPosition }
                                    label="Contact Position"
                                    type="text" 
                                    placeholder="eg. Head of sales" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save } 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="half left">
                    <div className="information">
                        <div className="heading">Company users<div className="bottom-border"></div></div>
                            <div className="el">
                            { 
                                companyUsersCount < 1?<span className="no-info">There are no company users to display</span>
                                :Object.keys(companyUsers).map(this.renderCompanyUsers)
                            }
                            
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-companyAddUser" 
                                    value={ userToBeAdded }
                                    label="Persons Email Address"
                                    type="email" 
                                    placeholder="example@email.com" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    upload={ ()=>{} }
                                    onChange = { save } 
                                />
                            </div>
                            <div>
                                <FmButton
                                    id="sendEmail"
                                    variant="contained"
                                    onClick = { this.sendAdditionRequest }
                                    styles={ submit_styles}
                                    isActive = { isActive }
                                    text={ inviteUser }
                                />
                            </div>
                        </div>
                    </div>
                <div className="clear"></div>
            </div>
        )
    }

}

CompanyTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

CompanyTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info.profileInfo,
        currentHorizontalTab: store.genInfo.info.sideBar.currenthorizontalTab,
    }
})(CompanyTab);

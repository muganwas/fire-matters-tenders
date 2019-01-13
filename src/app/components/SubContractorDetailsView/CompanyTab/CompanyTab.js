import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber } from 'components';
import { dispatchedSubContractorsInfo, dispatchedProfileInfo  } from 'extras/dispatchers';
import {  statesAustralia } from 'extras/config';
import axios from 'axios';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.SUB_CONTRACTORS_UPDATE_END_POINT;

class CompanyTab extends React.Component {
    constructor(props){
        super(props)
    }

    upload=(sectTitle, updateData)=>{
        let userInfo = {...this.props.currSub};
        return new Promise((resolve, reject)=>{
            let userId = userInfo.id,
            updateInfoUrl = baseURL + userUpdateEndPoint,
            updateObject = {userId, sectTitle, updateData};
            console.log(updateObject)
            axios.post(updateInfoUrl, updateObject).
            then(res=>{
                console.log(res);
                resolve(res);
            }).
            catch(err=>{
                reject(err);
            });
        });
    }

    save=(e)=>{
        e.persist();
        let { subContractorsInfo } = this.props;
        return new Promise(resolve=>{
            let userInfo = {...subContractorsInfo},
            origUser = {...this.props.user},
            id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.getAttribute('value');
            value = value?value:e.target.value;
            userInfo.currentSub[name] = value;
            this.props.dispatch(dispatchedSubContractorsInfo(userInfo));
            if(userInfo)                     
                resolve(origUser);
            else
                reject({message: "No data"});
        }); 
    }

    toggleEdit = (e)=>{
        e.persist();
        let { activeProfile } = this.props,
        id = e.target.id;
        if(id === "enable-edit"){
            activeProfile.editing.company.edit = "disabled";
            activeProfile.editing.company.disabled = false;
        }else if(id === "disable-edit" && activeProfile.editing.company.edit === "disabled"){
            activeProfile.editing.company.edit = "enabled";
            activeProfile.editing.company.disabled = true;
        }
        this.props.dispatch(dispatchedProfileInfo(activeProfile));
        this.forceUpdate();
    }

    render(){
        let { currSub } = this.props;
        let companyInformation = currSub,
        emailAddress = companyInformation.companyEmailAddress,
        phoneNumber = companyInformation.companyPhoneNumber?(companyInformation.companyPhoneNumber).toString():undefined,
        activeProfile = this.props.activeProfile || { activeProfile: {}, editing: { company:{}}},
        disabled = activeProfile.editing.company.disabled,
        edit = activeProfile.editing.company.edit,
        website = companyInformation.companyWebsite,
        state = companyInformation.companyState,
        city = companyInformation.companyCity,
        physicalAddress = companyInformation.companyPhysicalAddress,
        postCode = companyInformation.companyPostCode,
        acn_abn = companyInformation.company_acn_abn,
        contactName = companyInformation.companyRepFullName,
        contactEmail = companyInformation.companyRepEmailAddress,
        contactPhone = companyInformation.companyRepPhoneNumber,
        contactPosition = companyInformation.companyRepPosition;

        const createClass = edit === "enabled"?" enabled":" disabled",
        disableClass = edit !== "enabled"?" enabled":" disabled";

        return(
            <div className="main-content">
                <div id="edit">
                    <i id="enable-edit" onClick={ this.toggleEdit } class={"material-icons edit" + createClass}>
                        create
                    </i>
                    <i id ="disable-edit" onClick={ this.toggleEdit } class={"material-icons save" + disableClass}>
                        save
                    </i>
                </div>
                <div className="half left">
                    <div className="heading">Company Information(Optional) <div className="bottom-border"></div></div>
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="profile-companyEmailAddress-subContractor" 
                                value={ emailAddress }
                                label="Email Address"
                                type="email"
                                disabled = { disabled }
                                placeholder="Johndoe@email.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save } 
                            />
                        </div>
                        <div className="el">
                            <PhoneNumber 
                                id="profile-companyPhoneNumber"
                                label = "Phone Number"
                                value={ phoneNumber }  
                                mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder="(07) 9999-9999"
                                disabled = { disabled }
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyWebsite-subContractor" 
                                value={ website }
                                label="Website"
                                type="text" 
                                placeholder="www.website.com"
                                disabled = { disabled } 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }  
                            />
                        </div>
                        <div className="el">
                                <DropDown 
                                    label="State" 
                                    id="profile-companyState-subContractor" 
                                    className="select" 
                                    init={ state }
                                    disabled = { disabled }
                                    width="330px" 
                                    options={ statesAustralia } 
                                    selected={ state || "Qld" } 
                                    onBlur={ this.upload }
                                    onChange= { this.save }
                                />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyCity"
                                label="City"
                                value={ city } 
                                type="text"
                                disabled = { disabled }
                                placeholder="City" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyPhysicalAddress-subContractor"
                                label="Physical Address"
                                value={ physicalAddress } 
                                type="text" 
                                placeholder="Street Address"
                                disabled = { disabled }
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyPostCode-subContractor"
                                label="Post Code"
                                value={ postCode } 
                                type="text"
                                disabled = { disabled }
                                placeholder="POST/ZIP CODE" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }  
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-company_acn_abn-subContractor"
                                label="ACN/ABN"
                                value={ acn_abn }
                                disabled = { disabled }
                                type="text" 
                                placeholder="Bank Account Number" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }
                            />
                        </div>
                        
                    </div>
                </div>
                <div className="half left">
                    <div className="heading">Company Contact Person(Optional) <div className="bottom-border"></div></div>
                        <div className="information">
                            <div className="el">
                                <Textfield 
                                    id="profile-companyRepFullName-subContractor"
                                    label="Full Name"
                                    value={ contactName } 
                                    type="text" 
                                    placeholder="John Doe"
                                    disabled = { disabled } 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-companyRepEmailAddress-subContractor" 
                                    value={ contactEmail }
                                    label="Email Address"
                                    type="email"
                                    disabled = { disabled }
                                    placeholder="Johndoe@email.com" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save }  
                                />
                            </div>
                            <div className="el">
                                <PhoneNumber 
                                    id="profile-companyRepPhoneNumber"
                                    label = "Phone Number"
                                    value={ contactPhone }  
                                    mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    placeholder="(07) 9999-9999"
                                    disabled = { disabled }
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-companyRepPosition-subContractor" 
                                    value={ contactPosition }
                                    label="Contact Position"
                                    type="text"
                                    disabled = { disabled }
                                    placeholder="eg. Head of sales" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save } 
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
    currSub: {},
    subContractorsInfo: {}
}

CompanyTab.propTypes = {
    user: PropTypes.object.isRequired,
    currSub: PropTypes.object.isRequired,
    subContractorsInfo: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        user: store.user.info,
        subContractorsInfo: store.subContractors.info,
        activeProfile: store.profile.info,
        currSub: store.subContractors.info.currentSub
    }
})(CompanyTab);

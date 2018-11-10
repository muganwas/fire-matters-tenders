import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber } from 'components';
//import { dispatchedGenInfo } from 'extras/dispatchers';
import {  statesAustralia } from 'extras/config';
import axios from 'axios';
import './companyTab.css'

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

function CompanyTab(props){

    let { userInfo, user } = props;
    userInfo = userInfo?userInfo:JSON.parse(sessionStorage.getItem('profileInfo'));
    let companyInformation = userInfo || {},
    emailAddress = companyInformation.companyEmailAddress,
    phoneNumber = companyInformation.companyPhoneNumber?(companyInformation.companyPhoneNumber).toString():undefined,
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
            <div className="clear"></div>
        </div>
    )

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

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber, FmButton } from 'components';
import { userTypes, statesAustralia, serviceCategories } from 'extras/config';
import { dispatchedUserInfo, dispatchedProfileInfo } from 'extras/dispatchers';
import axios from 'axios';
import { submit_styles } from './styles';
import './personnelTab.css'


const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

class PersonnelTab extends React.Component{
    constructor(props){
        super(props)
    }

    toggleCategory = (e)=>{
        let { user } = this.props,
        serviceCategory = user.profileInfo.serviceCategory,
        elId = e.target.id,
        userInfo = {...user},
        currCategory = !elId?serviceCategory:elId,
        userId = userInfo.profileInfo.id,
        url = baseURL + userUpdateEndPoint;
        userInfo.profileInfo.profile.categoriesOfService[currCategory] = !userInfo.profileInfo.profile.categoriesOfService[currCategory];
        userInfo.addServiceCategory.submitButton.isActive = false;
        this.props.dispatch(dispatchedUserInfo(userInfo));
        axios.post(url, {userId, sectTitle: "profile", updateData: userInfo.profileInfo.profile }).then(res=>{
            if(res){
                userInfo.addServiceCategory.submitButton.isActive = true;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                this.forceUpdate();
            }   
        }).
        catch(err=>{
            userInfo.addServiceCategory.submitButton.isActive = true;
            this.props.dispatch(dispatchedUserInfo(userInfo));
            this.forceUpdate();
            throw err;
        });
    }

    renderActiveCategories = (key)=>{
        let currCategories = this.props.profile.categoriesOfService;
        if(currCategories[key]){
            return(
                <div className="serviceCategory" key = { key }>
                    { key }
                    <span 
                        className="close right"  
                        onClick = { this.toggleCategory } 
                        id={ key }
                    >
                        &#x2716;
                    </span>
                </div>
            )
        }else
            return null;
        
    }

    toggleEdit = (e)=>{
        let { activeProfile } = this.props,
        id = e.target.id;
        if(id === "enable-edit"){
            activeProfile.editing.personnel.edit = "disabled";
            activeProfile.editing.personnel.disabled = false;
        }else if(id === "disable-edit" && activeProfile.editing.personnel.edit === "disabled"){
            activeProfile.editing.personnel.edit = "enabled";
            activeProfile.editing.personnel.disabled = true;
        }
        this.props.dispatch(dispatchedProfileInfo(activeProfile));
        this.forceUpdate();
    }

    render(){
        let { userInfo, user, profile, activeProfile } = this.props;
        let userlen = Object.keys(userInfo).length;
        userInfo = userlen > 0?userInfo:JSON.parse(sessionStorage.getItem('profileInfo'));
        let userType = userInfo.userType,
        disabled = activeProfile.editing.personnel.disabled,
        edit = activeProfile.editing.personnel.edit,
        userName = userInfo.fullName,
        phoneNumber = userInfo.phoneNumber?(userInfo.phoneNumber).toString():undefined,
        mobileNumber = userInfo.mobileNumber?(userInfo.mobileNumber).toString():undefined,
        website = userInfo.website,
        state = userInfo.state,
        area = userInfo.area,
        suburb = userInfo.suburb,
        street = userInfo.street,
        serviceCategory = userInfo.serviceCategory,
        categoriesOfService = profile.categoriesOfService || {},
        city = userInfo.city,
        isActive = user.addServiceCategory.submitButton.isActive,
        emailAddress = userInfo.emailAddress;

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
                value = e.target.value;
                value = value?value:e.target.getAttribute('value');
                userInfo.profileInfo[name] = value;
                if(userInfo)                     
                    resolve(userInfo);
                else
                    reject({message: "No data"});
            });
        };

        const dummy = ()=>{
            return new Promise(resolve=>resolve())
        }

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
                    <div className="heading">Basic Information <div className="bottom-border"></div></div>
                    <div className="information">
                        {/*<div className="el">
                            <DropDown 
                                label="Account Type" 
                                id="profile-userType" 
                                className="select" 
                                init={ userType } 
                                width="330px" 
                                options={ userTypes } 
                                selected={ userType } 
                                onChange={ save }
                                onBlur={ upload }
                            />
                        </div>*/}
                        <div className="el">
                            <Textfield 
                                id="profile-fullName"
                                label="Full Name"
                                value={ userName } 
                                type="text"
                                disabled = { disabled }
                                placeholder="John Doe" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-emailAddress" 
                                value={ emailAddress }
                                label="Email Address"
                                type="email"
                                disabled = { disabled }
                                placeholder="Johndoe@email.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }
                            />
                        </div>
                        <div className="el">
                            <PhoneNumber 
                                id="profile-phoneNumber"
                                label = "Phone Number"
                                value={ phoneNumber }
                                disabled = { disabled }
                                mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder="(07) 9999-9999"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save } 
                            />
                        </div>
                        <div className="el">
                            <PhoneNumber 
                                id="profile-mobileNumber"
                                label = "Mobile Number"
                                value={ mobileNumber }
                                disabled = { disabled } 
                                mask={['(', [0], /\d/, /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]}
                                root="inner-textfield"
                                placeholder="(0799) 999 999"
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-website" 
                                value={ website }
                                label="Website"
                                type="text"
                                disabled = { disabled }
                                placeholder="www.website.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload } 
                                onChange = { save }
                            />
                        </div>
                        {/*<div className="el">
                            <Textfield 
                                id="profile-companyName"
                                label="Company Name"
                                value={ companyName } 
                                type="text" 
                                placeholder="John Doe" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save }
                            />
                        </div>*/}
                    </div>
                </div>
                <div className="half left">
                    <div className="heading">Contact Information <div className="bottom-border"></div></div>
                        <div className="information">
                            <div className="el">
                                <DropDown 
                                    onBlur={ upload }
                                    label="State" 
                                    id="profile-state" 
                                    className="select" 
                                    init={ state } 
                                    width="330px" 
                                    options={ statesAustralia } 
                                    selected={ state } 
                                    onChange={ save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-city" 
                                    value={ city }
                                    label="City"
                                    disabled = { disabled }
                                    type="text" 
                                    placeholder="ie.Your city" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            
                            <div>
                            <div className="el">
                                <Textfield 
                                    id="profile-area" 
                                    value={ area }
                                    label="Area"
                                    type="text" 
                                    disabled = { disabled }
                                    placeholder="ie.Your Area" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-suburb" 
                                    value={ suburb }
                                    label="Suburb"
                                    type="text"
                                    disabled = { disabled } 
                                    placeholder="ie.Your suburb" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-street" 
                                    value={ street }
                                    label="Street"
                                    type="text" 
                                    disabled = { disabled }
                                    placeholder="ie.Your street" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ upload }
                                    onChange = { save }  
                                />
                            </div>
                            </div>
                        </div>
                    </div>
                    {userType === "service_provider"?
                    <div className="half left">
                        <div className="heading">Service Categories<div className="bottom-border"></div></div>
                        <div className="information">
                            <div className="el">
                                { categoriesOfService?<div>{ Object.keys(categoriesOfService).map(this.renderActiveCategories) }</div>
                                :null }
                            </div>
                            <div className="el">
                                <DropDown 
                                    onBlur={ dummy }
                                    label="Add service" 
                                    id="profile-serviceCategory" 
                                    className="select" 
                                    init={ serviceCategory || "Add Service" } 
                                    width="330px" 
                                    options={ serviceCategories } 
                                    selected={ serviceCategory } 
                                    onChange={ save } 
                                />
                            </div>
                            <div className="addEquip">
                                <FmButton 
                                    id="addServiceCategory" 
                                    text="Add/Delete" 
                                    onClick = { this.toggleCategory } 
                                    isActive = { isActive }  
                                    styles={ submit_styles }
                                    variant = "contained"
                                />
                            </div>
                        </div>
                    </div>
                    : null}
                <div className="clear"></div>
            </div>
        )
    }

}

PersonnelTab.defaultProps = {
    userInfo: {},
    profile: {}
}

PersonnelTab.propTypes = {
    userInfo: PropTypes.object.isRequired,
    currentHorizontalTab: PropTypes.string,
    profile: PropTypes.object
}

export default connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info.profileInfo,
        profile: store.user.info.profileInfo.profile,
        activeProfile: store.profile.info,
        currentHorizontalTab: store.genInfo.info.sideBar.currenthorizontalTab,
    }
})(PersonnelTab);

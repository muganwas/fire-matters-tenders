import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber } from 'components';
import { statesAustralia } from 'extras/config';
import axios from 'axios';
import { dispatchedSubContractorsInfo, dispatchedProfileInfo } from 'extras/dispatchers';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.SUB_CONTRACTORS_UPDATE_END_POINT;

class PersonnelTab extends React.Component {
    constructor(props){
        super(props)
    }

    upload=(sectTitle, updateData)=>{
        let userInfo = {...this.props.currSub};
        return new Promise((resolve, reject)=>{
            let userId = userInfo.id,
            updateInfoUrl = baseURL + userUpdateEndPoint;
            let updateObject = {userId, sectTitle, updateData};
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

    resetProfileEditing = ()=>{
        this.props.dispatch(dispatchedProfileInfo("reset"));
    }

    dummy = ()=>{
        return new Promise(resolve=>resolve())
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
        let { currSub } = this.props,
        userInfo = currSub,
        activeProfile = this.props.activeProfile || { activeProfile: {}, editing: { personnel:{}}},
        companyName = userInfo.companyName,
        disabled = activeProfile.editing.personnel.disabled,
        edit = activeProfile.editing.personnel.edit,
        userName = userInfo.fullName,
        phoneNumber = userInfo.phoneNumber?(userInfo.phoneNumber).toString():undefined,
        mobileNumber = userInfo.mobileNumber?(userInfo.mobileNumber).toString():undefined,
        website = userInfo.website,
        state = userInfo.state,
        city = userInfo.city,
        area = userInfo.area,
        suburb = userInfo.suburb,
        street = userInfo.street,
        emailAddress = userInfo.emailAddress;

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
                        <div className="el">
                            <Textfield 
                                id="profile-fullName-subContractor"
                                label="Full Name"
                                value={ userName } 
                                type="text"
                                disabled = { disabled }
                                placeholder="John Doe" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-emailAddress-subContractor" 
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
                                id="profile-phoneNumber"
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
                            <PhoneNumber 
                                id="profile-mobileNumber"
                                label = "Mobile Number"
                                value={ mobileNumber }
                                disabled = { disabled }  
                                mask={['(', [0], /\d/, /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]}
                                root="inner-textfield"
                                placeholder="(0799) 999 999"
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-website-subContractor" 
                                value={ website }
                                label="Website"
                                disabled = { disabled }
                                type="text" 
                                placeholder="www.website.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-companyName-subContractor"
                                label="Company Name"
                                value={ companyName }
                                disabled = { disabled }
                                type="text" 
                                placeholder="John Doe" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ this.upload }
                                onChange= { this.save }
                            />
                        </div>
                    </div>
                </div>
                <div className="half left">
                    <div className="heading">Contact Information <div className="bottom-border"></div></div>
                        <div className="information">
                            <div className="el">
                                <DropDown 
                                    onBlur={ this.upload }
                                    label="State" 
                                    id="profile-state-subContractor" 
                                    className="select" 
                                    init={ state } 
                                    width="330px" 
                                    options={ statesAustralia } 
                                    selected={ state } 
                                    onChange={ this.save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-city-subContractor" 
                                    value={ city }
                                    disabled = { disabled }
                                    label="City"
                                    type="text" 
                                    placeholder="ie.Your city or suburb" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-area-subContractor" 
                                    value={ area }
                                    label="Area"
                                    type="text"
                                    disabled = { disabled }
                                    placeholder="ie.Sub-contractors' area" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-suburb-subContractor" 
                                    value={ suburb }
                                    label="Suburb"
                                    type="text"
                                    disabled = { disabled }
                                    placeholder="ie.Sub-contractors' suburb" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ this.upload }
                                    onChange= { this.save } 
                                />
                            </div>
                            <div className="el">
                                <Textfield 
                                    id="profile-street-subContractor" 
                                    value={ street }
                                    label="Street"
                                    type="text"
                                    disabled = { disabled }
                                    placeholder="ie.Sub-contractors' suburb" 
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

PersonnelTab.defaultProps = {
    user: {},
    currSub: {},
    subContractorsInfo: {}
}

PersonnelTab.propTypes = {
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
})(PersonnelTab);

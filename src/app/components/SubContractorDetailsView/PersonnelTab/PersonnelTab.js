import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber } from 'components';
import { statesAustralia } from 'extras/config';
import axios from 'axios';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

function PersonnelTab(props){
    let { currSub, user } = props,
    userInfo = currSub,
    companyName = userInfo.companyName,
    userName = userInfo.fullName,
    phoneNumber = userInfo.phoneNumber?(userInfo.phoneNumber).toString():undefined,
    mobileNumber = userInfo.mobileNumber?(userInfo.mobileNumber).toString():undefined,
    website = userInfo.website,
    state = userInfo.state,
    city = userInfo.city,
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
                <div className="heading">Basic Information <div className="bottom-border"></div></div>
                <div className="information">
                    <div className="el">
                        <Textfield 
                            id="profile-fullName"
                            label="Full Name"
                            value={ userName } 
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
                            id="profile-emailAddress" 
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
                            id="profile-phoneNumber"
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
                        <PhoneNumber 
                            id="profile-mobileNumber"
                            label = "Mobile Number"
                            value={ mobileNumber }  
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
                            placeholder="www.website.com" 
                            root="inner-textfield" 
                            fieldClass="textfield"
                            onBlur={ upload } 
                            onChange = { save }
                        />
                    </div>
                    <div className="el">
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
                    </div>
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
                                label="City/Suburb"
                                type="text" 
                                placeholder="ie.Your city or suburb" 
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
        currSub: store.subContractors.info.currentSub
    }
})(PersonnelTab);

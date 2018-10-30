import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield, PhoneNumber } from 'components';
//import { dispatchedGenInfo } from 'extras/dispatchers';
import { userTypes, statesAustralia } from 'extras/config';
import './companyTab.css'


function CompanyTab(props){
    const { userProfile } = props;
    let userType = JSON.parse(sessionStorage.getItem('loginSession')).userType,
    userName = JSON.parse(sessionStorage.getItem('loginSession')).fullName,
    phoneNumber = (JSON.parse(sessionStorage.getItem('loginSession')).phoneNumber).toString(),
    mobileNumber = JSON.parse(sessionStorage.getItem('loginSession')).mobileNumber,
    website = JSON.parse(sessionStorage.getItem('loginSession')).website,
    state = JSON.parse(sessionStorage.getItem('loginSession')).state,
    city = JSON.parse(sessionStorage.getItem('loginSession')).city,
    emailAddress = JSON.parse(sessionStorage.getItem('loginSession')).emailAddress;

    const validate=()=>{
        return new Promise((resolve, reject)=>{
            resolve();
        });
    };
    const save=()=>{
        return new Promise((resolve, reject)=>{
            resolve();
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
                            value={ userName } 
                            type="text" 
                            placeholder="John Doe" 
                            root="inner-textfield" 
                            fieldClass="textfield"  
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
                        />
                    </div>
                    <div className="el">
                            <DropDown 
                                onBlur={ validate }
                                label="State" 
                                id="profile-companyState" 
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
                            id="profile-companyCity"
                            label="City/Suburb"
                            value={ userName } 
                            type="text" 
                            placeholder="John Doe" 
                            root="inner-textfield" 
                            fieldClass="textfield"  
                        />
                    </div>
                    <div className="el">
                        <Textfield 
                            id="profile-companyStreet"
                            label="Street"
                            value={ userName } 
                            type="text" 
                            placeholder="John Doe" 
                            root="inner-textfield" 
                            fieldClass="textfield"  
                        />
                    </div>
                    <div className="el">
                        <Textfield 
                            id="profile-companyPostaCode"
                            label="Post Code"
                            value={ userName } 
                            type="text" 
                            placeholder="John Doe" 
                            root="inner-textfield" 
                            fieldClass="textfield"  
                        />
                    </div>
                    <div className="el">
                        <Textfield 
                            id="profile-companyABN"
                            label="ACN/ABN"
                            value={ userName } 
                            type="text" 
                            placeholder="John Doe" 
                            root="inner-textfield" 
                            fieldClass="textfield"  
                        />
                    </div>
                    
                </div>
            </div>
            <div className="half left">
                <div className="heading">Company Contact Person(Optional) <div className="bottom-border"></div></div>
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="profile-repFullName"
                                label="Full Name"
                                value={ userName } 
                                type="text" 
                                placeholder="John Doe" 
                                root="inner-textfield" 
                                fieldClass="textfield"  
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-repEmailAddress" 
                                value={ emailAddress }
                                label="Email Address"
                                type="email" 
                                placeholder="Johndoe@email.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"  
                            />
                        </div>
                        <div className="el">
                            <PhoneNumber 
                                id="profile-repPhoneNumber"
                                label = "Phone Number"
                                value={ phoneNumber }  
                                mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                placeholder="(07) 9999-9999"
                                root="inner-textfield" 
                                fieldClass="textfield"  
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="profile-repPosition" 
                                value={ emailAddress }
                                label="Contact Position"
                                type="text" 
                                placeholder="Johndoe@email.com" 
                                root="inner-textfield" 
                                fieldClass="textfield"  
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
        search: store.search,
        genInfo: store.genInfo.info,
        userProfile: store.user.info.profileInfo,
    }
})(CompanyTab);

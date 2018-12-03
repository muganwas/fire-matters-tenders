import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Rebase from 're-base';
import axios from 'axios';
import PropTypes from 'prop-types';
import { PublicProfileImage, FmButton, Loader } from 'components';
import * as firebase from 'firebase/app';
import 'extras/config';
import 'firebase/storage';
import 'firebase/database';
import { dispatchedProfileInfo } from 'extras/dispatchers';
import './profileInfo.css';
import styles from './styles';

const base = Rebase.createClass(firebase.database()),
storage = firebase.storage(),
storageRef = storage.ref(),
baseURL = process.env.BACK_END_URL,
sitesEndPoint = process.env.SITES_END_POINT,
userEndPoint = process.env.USERS_END_POINT;

@connect(store=>{
    return{
        profileInfo: store.profile.info
    }
})
class ProfileInfo extends Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        let profileInfo = {...this.props.profileInfo},
        activeProfile = {...profileInfo.activeProfile},
        userId = ((this.props.match.params.uid).split(':'))[1],
        activeProfileInfoLen = Object.keys(activeProfile).length;

        this.getAvatar(userId);

        if(activeProfileInfoLen < 5){
            axios.get(baseURL + userEndPoint + "?userId=" + userId).then(res=>{
                profileInfo.activeProfile = res.data[0];
                this.props.dispatch(dispatchedProfileInfo(profileInfo));
            });
        }

        this.fetchSitesInfo();
    }

    getAvatar = (userId)=>{
        return new Promise(resolve=>{
            base.fetch(`users/${ userId }`, {
                context: this,
                asArray: true,
                then(data){
                    let len = data.length;
                    if( len !== 0){
                        /**Deal with avatar */
                        let fl = data[0][0];
                        let avURL = data[0];
                        //easiest way I could figure out to check for an upload avatar url
                        if(fl === "h"){
                            let profileInfo = {...this.props.profileInfo};
                            profileInfo.activeProfile.avatarURL = avURL;
                            this.props.dispatch(dispatchedProfileInfo(profileInfo));
                        }else{
                            storageRef.child('general/avatar.png').getDownloadURL().then((data)=>{
                                let profileInfo = {...this.props.profileInfo};
                                profileInfo.activeProfile.avatarURL = data
                                this.props.dispatch(dispatchedProfileInfo(profileInfo));
                            });
                        }
                    }else{
                        storageRef.child('general/avatar.png').getDownloadURL().then((data)=>{
                            let profileInfo = {...this.props.profileInfo};
                            profileInfo.activeProfile.avatarURL = data
                            this.props.dispatch(dispatchedProfileInfo(profileInfo));
                        }); 
                    } 
                }
            });
            resolve("Image fetched and stored");
        });
    }

    fetchSitesInfo(){
        return new Promise(resolve=>{
            let profileInfo = {...this.props.profileInfo},
            activeProfile = {...profileInfo.activeProfile},
            userEmail = activeProfile.emailAddress,
            siteCount = 0,
            url = baseURL + sitesEndPoint + "?emailAddress=" + userEmail;
            axios.get(url).then(res=>{
                if(res){
                    siteCount = res.data.length;
                    activeProfile.sites = res.data;
                    activeProfile.siteCount = siteCount;
                }
            });
            this.props.dispatch(dispatchedProfileInfo(profileInfo));
            resolve("fetched");
        });
    }

    verifyLicense = (e)=>{
        let id = e.target.id;
        console.log(id);
    }

    displayLicenses = (key)=>{
        let verificationCount = 0;
        return(
            <div className="category-of-service" key={key}>
                { key }
                <span id="verification-count"><span id="num">{ verificationCount }</span> Verifications</span>
                <span className="verify-license" id={ key } onClick={ this.verifyLicense }>Verify License</span>
            </div>
        )
    }

    displayAverateRating(count){
        if(count < 1){
            return "There is no rating available"
        }else{
            return <span>star</span>
        }
    }

    displayTendersWon(tenders){
        if(!tenders || tenders < 1){
            return "No tenders have been won yet."
        }else{
            return <span>Tenders</span>
        }
    }

    render(){

        let profileInfo = {...this.props.profileInfo},
        activeProfile = {...profileInfo.activeProfile},
        activeProfileLen = Object.keys(activeProfile).length,
        profile = {...activeProfile.profile},
        licenses = {...activeProfile.licenses},
        userType = activeProfile.userType,
        avatarURL = activeProfile.avatarURL,
        licenseCategories = {},
        userTypeString;

        Object.keys(licenses).map(key=>{
            if(licenses[key].checked){
                licenseCategories[key] = licenses[key];
            }
        });

        if(userType){
            if(userType === "service_provider")
                userTypeString = "Service Provider";
            else
                userTypeString = "owner_occupier";
        }
        return(
            <div className="main">
                {activeProfileLen > 0
                ?<div>
                    <div className="personalInfo">
                        <div id="user-category">{ userTypeString }</div>
                        <PublicProfileImage avatarURL = { avatarURL } />
                        <div className="info">
                            <div id="name">{ activeProfile.fullName }</div>
                            <div id="location">
                                <i id="location-profile" className="material-icons">room</i>{ activeProfile.city }, { activeProfile.state }
                            </div>
                        </div>
                        <div className="clear"></div>
                    </div>
                    <div className="action">
                        <FmButton variant="contained" styles={ styles } text="Invite to Tender" />
                    </div>
                    <div className="profileInfo">
                        <div id="intro">
                            <h3>Introduction</h3>
                            <span className="detail" >{ profile.introduction }</span>
                            <h3>Licenses</h3>
                            <span className="detail">{ Object.keys(licenseCategories).map(this.displayLicenses) }</span>
                            <h3>Average Rating</h3>
                            <span className="detail">{ this.displayAverateRating(profile.averageRating) }</span>
                            <h3>Tenders Won</h3>
                            <span className="detail">{ profile.tendersWon }</span>
                        </div> 
                    </div>
                    <div className="clear"></div>
                </div>
                :<div className="profileLoader"><Loader fill="#F79A50" /></div>}
            </div>
        )        
    }
}

ProfileInfo.defaultProps = {
    profileInfo: {}
}

ProfileInfo.propTypes = {
    profileInfo: PropTypes.object.isRequired
}

export default withRouter(ProfileInfo);
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './profileTab.css'
import { PersonnelTab, CompanyTab } from 'components';
import { ownerOccupierProfileTabs, serviceProviderProfileTabs } from 'extras/config';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        currentHorizontalTab: store.genInfo.info.sideBar.currentHorizontalTab,
    }
})
class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //fetch user info
        this.fetchUserProfile();
        //set initial attributes
        let userType = JSON.parse(sessionStorage.getItem('loginSession')).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "owner-occupier")
            genInfo.sideBar.profilePage.tabs = ownerOccupierProfileTabs;
        else
            genInfo.sideBar.profilePage.tabs = serviceProviderProfileTabs;
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    fetchUserProfile=()=>{
        let emailAddress = JSON.parse(sessionStorage.getItem('loginSession')).emailAddress,
        userURL = baseUrl + usersEndPoint + "?emailAddress=" + emailAddress;
        axios.get(userURL).
        then(res=>{
            let userInfo = {...this.props.user},
            userData = res.data[0];
            userInfo.profileInfo = userData;
            this.props.dispatch(dispatchedUserInfo(userInfo));
        });
    }
    
    render(){
        let currentTab = this.props.currentHorizontalTab;
        return(
            <div>
                {currentTab==="personnel"?<PersonnelTab />:currentTab==="company"?<CompanyTab/>:null}
            </div>
        )
    }
}

ProfilePage.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ProfilePage.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ProfilePage;
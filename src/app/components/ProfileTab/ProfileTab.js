import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './profileTab.css'
import { PersonnelTab, CompanyTab, InsuranceTab, LicenseTab } from 'components';
import { ownerOccupierProfileTabs, serviceProviderProfileTabs } from 'extras/config';


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
        //set initial attributes
        let userType = JSON.parse(sessionStorage.getItem('profileInfo')).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "Owner/Occupier" || userType === "owner-occupier" || userType === "owner_occupier")
            genInfo.sideBar.profilePage.tabs = ownerOccupierProfileTabs;
        else
            genInfo.sideBar.profilePage.tabs = serviceProviderProfileTabs;
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        let currentTab = this.props.currentHorizontalTab;
        return(
            <div>
                {currentTab==="personnel"?
                <PersonnelTab />:
                currentTab==="company"?
                <CompanyTab />:
                currentTab==="insurance"?
                <InsuranceTab />
                :currentTab==="license"?
                <LicenseTab />:null}
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
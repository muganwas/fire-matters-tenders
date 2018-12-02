import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './profileTab.css'
import { PersonnelTab, CompanyTab, InsuranceTab, LicenseTab, EquipmentTab } from 'components';
import { ownerOccupierProfileTabs, serviceProviderProfileTabs } from 'extras/config';


@connect((store)=>{
    return {
        user: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        tabs: store.genInfo.info.sideBar.profilePage.tabs,
        currentHorizontalTab: store.genInfo.info.sideBar.currentHorizontalTab,
    }
})
class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
        let userType = JSON.parse(sessionStorage.getItem('profileInfo')).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "owner_occupier" || userType === "owner-occupier" || userType === "owner_occupier")
            genInfo.sideBar.profilePage.tabs = ownerOccupierProfileTabs;
        else
            genInfo.sideBar.profilePage.tabs = serviceProviderProfileTabs;
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    activate = (e)=>{
        let id = e.target.id,
        genInfo = {...this.props.genInfo},
        tabs = this.props.tabs;
        genInfo.sideBar.currentHorizontalTab = id;
        this.props.dispatch(dispatchedGenInfo(genInfo));
        document.getElementById(id).className="active";
        setTimeout(()=>{
            Object.keys(tabs).map(key=>{
                if(key === id)
                    document.getElementById(key).className="active";
                else
                    document.getElementById(key).className="";        
            });
        }, 20);
    }
    
    tabTitle=(key)=>{
        let tabs = this.props.tabs,
        selected = this.props.currentHorizontalTab;
        return (
            <span id={key} onClick={ this.activate } className={ key===selected?"active":null} key={ key }>{ tabs[key] }</span>
        )
    }

    render(){
        let tabs = this.props.tabs, currentTab = this.props.currentHorizontalTab;
        return(
            <div>
                <div className="tabs">{ Object.keys(tabs).map(this.tabTitle) }</div>
                {currentTab==="personnel"?
                <PersonnelTab />:
                currentTab==="company"?
                <CompanyTab />:
                currentTab==="insurance"?
                <InsuranceTab />
                :currentTab==="license"?
                <LicenseTab />
                :currentTab==="equipment"?
                <EquipmentTab />:null}
            </div>
        )
    }
}

ProfileTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ProfileTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ProfileTab;
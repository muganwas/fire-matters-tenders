import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './subContractorDetails.css'
import { PersonnelTab, CompanyTab, InsuranceTab, LicenseTab, EquipmentTab } from 'components';
import { subContractorProfileTabs } from 'extras/config';


@connect((store)=>{
    return {
        user: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        subContractorsInfo: store.subContractors.info,
        tabs: store.genInfo.info.sideBar.profilePage.tabs,
    }
})
class SubContractorDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
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
        let tabs = subContractorProfileTabs,
        selected = this.props.currentTab;
        return (
            <span id={key} onClick={ this.activate } className={ key===selected?"active":null} key={ key }>{ tabs[key] }</span>
        )
    }

    render(){
        let { currentTab } = this.props;
        return(
            <div className="subcontractors-container">
                <div className="sub-container">
                    <div className="tabs">{ Object.keys(subContractorProfileTabs).map(this.tabTitle) }</div>
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
            </div>
        )
    }
}

SubContractorDetails.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SubContractorDetails.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SubContractorDetails;
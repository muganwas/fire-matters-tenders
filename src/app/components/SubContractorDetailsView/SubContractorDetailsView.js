import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedSubContractorsInfo } from 'extras/dispatchers';
import './subContractorDetailsView.css';
import PersonnelTab from './PersonnelTab/PersonnelTab'; 
import CompanyTab from './CompanyTab/CompanyTab'; 
import InsuranceTab from './InsuranceTab/InsuranceTab';
import LicenseTab from './LicenseTab/LicenseTab'; 
import EquipmentTab from './EquipmentTab/EquipmentTab';
import { subContractorProfileTabs } from 'extras/config';


@connect((store)=>{
    return {
        user: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        subContractorsInfo: store.subContractors.info,
        currentTab: store.subContractors.info.currentTab,
    }
})
class SubContractorDetailsView extends React.Component {
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
        subContractorsInfo = {...this.props.subContractorsInfo},
        tabs = subContractorProfileTabs;
        subContractorsInfo.currentTab = id;
        this.props.dispatch(dispatchedSubContractorsInfo(subContractorsInfo));
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
                <div className = "clear"></div>
            </div>
        )
    }
}

SubContractorDetailsView.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SubContractorDetailsView.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SubContractorDetailsView;
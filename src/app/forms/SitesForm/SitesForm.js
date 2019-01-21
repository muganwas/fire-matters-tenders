import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './sitesForm.css';
import { submit_styles } from './styles';
import { AddressInformation, EquipmentInformation, ContractInformation } from './SitesFormViews';
import { statesAustralia } from 'extras/config';

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info,
        listingsInfo: store.listingsInfo.info,
        genInfo: store.genInfo.info,
        sitesInfo: store.sites.info
    }
})
class SitesForm extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    nextView = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            info = {...this.props.genInfo},
            level = info.createSiteProgress.createSiteFormLevel,
            first = info.createSiteProgress.createSiteProgress.oneClass,
            second = info.createSiteProgress.createSiteProgress.twoClass,
            third = info.createSiteProgress.createSiteProgress.threetwoClass,
            newLevel = level+1;
            info.createSiteProgress.createSiteFormLevel = newLevel;
            if(level === 1){
                info.signUpProgressBar.twoClass = second + " current";
                info.signUpProgressBar.oneClass = "one";
                info.signUpProgressBar.threeClass = "three";
            }
            else if(level === 2){
                info.signUpProgressBar.threeClass = third + " current";
                info.signUpProgressBar.twoClass = "two";
                info.signUpProgressBar.oneClass = "one";
            }else{
                info.signUpProgressBar.threeClass = "three";
                info.signUpProgressBar.twoClass = "two";
                info.signUpProgressBar.oneClass = first + " current";
            }
            this.props.dispatch(dispatchedGenInfo(info));
            resolve("pre-signup props set");
        });
    }

    goTo = (e)=>{
        let id = e.target.id,
        genInfo = {...this.props.genInfo},
        currentClassName = e.target.className,
        currentLevel = genInfo.createSiteProgress.createSiteFormLevel;
        if(currentLevel > id || currentClassName.includes("current")){
            genInfo.createSiteProgress.createSiteFormLevel = Number (id);
        }
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    render(){
        const { 
            feedback,
            feedbackClass,
            styles, 
            close, 
            attributes,
            upload, 
            save, 
            contractStatusOptions, 
            onBlur,  
            errors,
            genInfo,
        } = this.props,
        { 
            siteName,
            siteState,
            siteCity,
            siteArea,
            siteStreet, 
            currentContractor, 
            siteContractStatus, 
            submitButton 
        } = attributes,
        first = genInfo.createSiteProgress.oneClass,
        second = genInfo.createSiteProgress.twoClass,
        third = genInfo.createSiteProgress.threeClass,
        level = genInfo.createSiteProgress.createSiteFormLevel,
        mandatoryInput = "This field is mandatory.",   
        isActive = submitButton.isActive;
        
        return(
            <div className="listing-form-container">
                    
                <div className="listing-form-subcontainer">
                    <div className="headerAlt">
                        <span id="header-text">Register Site</span>
                        <span className="right" onClick={ close } id="close">&#x2716;</span>
                    </div>
                    <div className="signup-progress">
                        <span onClick={ this.goTo } id={ 1 } className={ first }>1</span>
                        <span className="middle-lineAlt"></span>
                        <span onClick={ this.goTo } id={ 2 } className={ second }>2</span>
                        <span className="middle-lineAlt"></span>
                        <span onClick={ this.goTo } id={ 3 } className={ third }>3</span>
                    </div>
                    <div className="listing-form">
                        <div className="information" style={ styles.information }>
                        <div className="el" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                        { level === 1?
                            <AddressInformation
                                styles = { submit_styles }
                                states = { statesAustralia }
                                onBlur = { onBlur }
                                upload = { upload }
                                save = { save }
                                errors = { errors }
                                attributes = { {siteName, siteState} }
                                nextView = { this.nextView }
                            />
                        :null }
                        </div>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        )
    }
}

SitesForm.defaultProps = {
    states: null,
    close: undefined,
}

SitesForm.propTypes = {
    close: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    upload: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
}

export default SitesForm;
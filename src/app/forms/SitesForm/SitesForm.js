import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './sitesForm.css';
import { Textfield, DropDown, FmButton } from 'components';

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info,
        listingsInfo: store.listingsInfo.info,
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
            errors
        } = this.props,
        { 
            siteName, 
            siteLocation, 
            currentContractor, 
            siteContractStatus, 
            submitButton 
        } = attributes,
        mandatoryInput = "This field is mandatory.",   
        isActive = submitButton.isActive;

        console.log(this.props)
        
        return(
            <div className="listing-form-container">
                <div className="listing-form-subcontainer">
                    <div className="header">
                        <span id="header-text">Post Site</span>
                        <span className="right" onClick={ close } id="close">&#x2716;</span>
                    </div>
                    <div className="listing-form">
                        <div className="information" style={ styles.information }>
                        <div className="el" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="sites-siteName"
                                    label="Site Name"
                                    value={ siteName } 
                                    type="text" 
                                    placeholder="Your buildings name" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.siteName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="sites-siteLocation"
                                    label="Site Location"
                                    value={ siteLocation } 
                                    type="text" 
                                    placeholder="Site address" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.siteLocation?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="sites-currentContractor"
                                    label="Current Contractor"
                                    value={ currentContractor } 
                                    type="text" 
                                    placeholder="Name of your current contractor" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.currentContractor?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <DropDown 
                                    id="sites-siteContractStatus"
                                    label="Current Contract Staus" 
                                    className="select" 
                                    init={ siteContractStatus || "Not active" } 
                                    width="330px" 
                                    options={ contractStatusOptions } 
                                    selected={ siteContractStatus }
                                    onBlur = { onBlur } 
                                    onChange={ save }
                                />
                                { errors.siteContractStatus?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <FmButton
                                    isActive={ isActive } 
                                    loaderFill = "#fff" 
                                    variant="contained" 
                                    styles = { styles } 
                                    text="Submit Site Details"
                                    onClick = { upload } 
                                />
                            </div>
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
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './sitesForm.css';
import { Textfield, DropDown, FmButton } from 'components';

const SitesForm = props=>{
    const { 
        feedback,
        feedbackClass,
        userInfo, 
        styles, 
        close, 
        attributes, 
        upload, 
        save, 
        states, 
        contractStatusOptions, 
        onBlur, 
        equipCategories, 
        equipmentCollection,
        contractTypes,
        errors
    } = props,
    { 
        listingCompanyName, 
        listingState, 
        listingCity, 
        listingCategory, 
        listingCategoryOther, 
        listingEquipmentCategory, 
        listingEquipment, 
        listingEquipmentQuantity,
        listingContractType,
        listingStartDate,
        submitButton 
    } = attributes,
    mandatoryInput = "This field is mandatory.",
    isActive = submitButton.isActive,
    key= userInfo.createListing.listingEquipmentCategory_key,
    equipment = equipmentCollection[key];

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
                                value={ listingCompanyName } 
                                type="text" 
                                placeholder="Your buildings name" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingCompanyName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="sites-siteLocation"
                                label="Site Location"
                                value={ listingCompanyName } 
                                type="text" 
                                placeholder="Site address" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingCompanyName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="sites-currentContractor"
                                label="Current Contractor"
                                value={ listingCompanyName } 
                                type="text" 
                                placeholder="Name of your current contractor" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingCompanyName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <DropDown 
                                id="sites-sitesContractStatus"
                                label="Current Contract Staus" 
                                className="select" 
                                init={ "Not active" } 
                                width="330px" 
                                options={ contractStatusOptions } 
                                selected={ listingCategory }
                                onBlur = { onBlur } 
                                onChange={ save }
                            />
                            { errors.listingCategory?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <FmButton
                                isActive={ isActive } 
                                loaderFill = "#fff" 
                                variant="contained" 
                                styles = { styles } 
                                text="Submit Listing"
                                onClick = { upload } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

SitesForm.defaultProps = {
    states: null,
    close: undefined,
}

SitesForm.propTypes = {
    states: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    upload: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
}

export default connect(store=>{
    return {
        userInfo: store.user.info,
        listingsInfo: store.listingsInfo.info,
        sitesInfo: store.sites.info
    }
})(SitesForm);
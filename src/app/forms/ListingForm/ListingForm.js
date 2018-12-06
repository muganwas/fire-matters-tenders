import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './listingForm.css';
import { Textfield, DropDown, FmButton } from 'components';

const ListingForm = props=>{
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
        listingCategories, 
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

    console.log(equipmentCollection)
    console.log(key)
    return(
        <div className="listing-form-container">
            <div className="listing-form-subcontainer">
                <div className="header">
                    <span id="header-text">Post New Listing </span>
                    <span className="right" onClick={ close } id="close">&#x2716;</span>
                </div>
                <div className="listing-form">
                    <div className="information" style={ styles.information }>
                    <div className="el" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-listingCompanyName"
                                label="Company Name"
                                value={ listingCompanyName } 
                                type="text" 
                                placeholder="eg. Company.Inc" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingCompanyName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <DropDown 
                                label="State" 
                                id="tenders-listingState" 
                                className="select" 
                                init={ listingState || "Select State" } 
                                width="330px" 
                                options={ states } 
                                selected={ listingState }
                                onBlur = { onBlur } 
                                onChange={ save }
                            />
                            { errors.listingState?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-listingCity"
                                label="City/Suburb"
                                value={ listingCity } 
                                type="text" 
                                placeholder="eg. Brisbane" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingCity?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <DropDown 
                                label="Tender Category" 
                                id="tenders-listingCategory" 
                                className="select" 
                                init={ listingCategory || "Select Category" } 
                                width="330px" 
                                options={ listingCategories } 
                                selected={ listingCategory }
                                onBlur = { onBlur } 
                                onChange={ save }
                            />
                            { errors.listingCategory?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        {listingCategory==="Other"
                        ?<div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-listingCategoryOther"
                                label="Category Name"
                                value={ listingCategoryOther } 
                                type="text" 
                                placeholder="Enter name of category." 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingCategoryOther?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        :null}
                        <div className="el" style={ styles.el }>
                            <DropDown 
                                label="Equipment Category" 
                                id="tenders-listingEquipmentCategory" 
                                className="select" 
                                init={ listingEquipmentCategory || "Select Category" } 
                                width="330px" 
                                options={ equipCategories } 
                                selected={ listingEquipmentCategory }
                                onBlur = { onBlur } 
                                onChange={ save }
                            />
                            { errors.listingEquipmentCategory?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        {listingEquipmentCategory?<div className="el" style={ styles.el }>
                            <DropDown 
                                label="Equipment" 
                                id="tenders-listingEquipment" 
                                className="select" 
                                init={ listingEquipment || "Select Equipment" } 
                                width="330px" 
                                options={ equipment } 
                                selected={ listingEquipment }
                                onBlur = { onBlur } 
                                onChange={ save }
                            />
                            { errors.listingEquipment?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>:null}
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-listingEquipmentQuantity"
                                label="Equipment Quantity"
                                value={ listingEquipmentQuantity } 
                                type="number" 
                                placeholder="" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingEquipmentQuantity?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <DropDown 
                                label="Contract Types" 
                                id="tenders-listingContractType" 
                                className="select" 
                                init={ listingContractType || "Select Category" } 
                                width="330px" 
                                options={ contractTypes } 
                                selected={ listingContractType }
                                onBlur = { onBlur } 
                                onChange={ save }
                            />
                            { errors.listingContractType?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-listingStartDate"
                                label="Expected Start Date"
                                value={ listingStartDate } 
                                type="date" 
                                placeholder="MM/dd/yyyy" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.listingStartDate?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
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

ListingForm.defaultProps = {
    states: null,
    close: undefined,
}

ListingForm.propTypes = {
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
    }
})(ListingForm);
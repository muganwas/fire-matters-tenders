import React from 'react';
import { Textfield, DropDown, SecondarySelect, FmButton } from 'components'; 
import { dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import { equipmentCategories, equipmentCategoriesFull } from 'extras/config';
import PropTypes from 'prop-types';

const mandatoryInput = "This field is mandatory.";

export const AddressInformation = props=>{
    const { 
        nextView, 
        styles, 
        states, 
        attributes, 
        onBlur, 
        onChange, 
        errors, 
        isActive 
    } = props,
    { 
        siteName, 
        siteState, 
        siteCity, 
        siteArea, 
        siteSuburb, 
        siteStreet 
    } = attributes;
    return(
        <div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteName"
                    label="Site Name"
                    value={ siteName } 
                    type="text" 
                    placeholder="Sites' name" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { onChange } 
                />
                { errors.siteName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <DropDown 
                    id="sites-siteState"
                    label="State" 
                    className="select" 
                    init={ siteState || "Select State" } 
                    width="330px" 
                    options={ states } 
                    selected={ siteState }
                    upload = { onBlur } 
                    save={ onChange }
                />
                { errors.siteState?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteCity"
                    label="Site City"
                    value={ siteCity } 
                    type="text" 
                    placeholder="City where site is located" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { onChange } 
                />
                { errors.siteCity?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteArea"
                    label="Site Area"
                    value={ siteArea } 
                    type="text" 
                    placeholder="Area where site is located" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { onChange } 
                />
                { errors.siteArea?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteSuburb"
                    label="Site Suburb"
                    value={ siteSuburb } 
                    type="text" 
                    placeholder="Suburb where site is located" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { onChange } 
                />
                { errors.siteSuburb?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteStreet"
                    label="Site Street"
                    value={ siteStreet } 
                    type="text" 
                    placeholder="Street where site is located" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { onChange } 
                />
                { errors.siteStreet?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <FmButton
                    loaderFill = "#fff" 
                    variant="contained" 
                    styles = { styles } 
                    text="Next"
                    onClick = { nextView } 
                />
            </div>
        </div>
    )
}

AddressInformation.defaultProps = {
    nextView: null
}

AddressInformation.propTypes = {
    nextView: PropTypes.func.isRequired
}

export const EquipmentInformation = props=>{
    var { 
        nextView, 
        styles,
        removeSelectedEquipment,
        secondarySelect,
        getCategory, 
        getCategoryAlt 
    } = props,
    selectedArr = secondarySelect.selectedOptions;
    return(
        <div>
            <div className="equipment">
                <div className="add">
                    { selectedArr.length > 0?<div className="site subCategories">
                        <h4>Selected Equipment</h4>
                        <div className="body">
                            { Object.keys(selectedArr).map(key=>{
                                let selectedArr = secondarySelect.selectedOptions,
                                selected = selectedArr[key];
                                return(
                                    <div key={key}>
                                        { Object.keys(selected).map(key1=>{
                                            return (
                                                <div key={key1}>
                                                    { equipmentCategoriesFull[key1][selected[key1]] }
                                                    <span 
                                                        className="close right" 
                                                        pos={ key }  
                                                        onClick={ removeSelectedEquipment } 
                                                        id="close"
                                                    >
                                                        &#x2716;
                                                    </span>
                                                </div>
                                            )
                                        }) }
                                    </div>
                                )
                            }) }
                        </div>
                    </div>: null }
                </div>
            <div className="el" style={ styles.elAlt }>
                <SecondarySelect 
                    categories = { equipmentCategories }
                    categoriesFull = { equipmentCategoriesFull }
                    selectWidth = "240px"
                    selectWidthAlt = "240px"
                    double = { true }
                    dropDownWidth = "255px"
                    dropDownWidthAlt = "255px"
                    categoryTitle = "searchEquipmentSelectedCategories"
                    categoryTitleAlt = "searchEquipmentSelectedSubCategories"
                    onChange = { getCategory }
                    onChangeAlt = { getCategoryAlt }
                    dispatcher = { dispatchedSecondarySelectInfo }
                    dispatcherAlt =  { dispatchedSecondarySelectInfo }
                    
                />
            </div>
            <div className="el" style={ styles.el }>
                <FmButton
                    loaderFill = "#fff" 
                    variant="contained" 
                    styles = { styles } 
                    text="Next"
                    onClick = { nextView } 
                />
            </div>
        </div>
    </div>
    ) 
}

EquipmentInformation.propTypes = {
    nextView: PropTypes.func,
    getCategory: PropTypes.func,
    getCategoryAlt: PropTypes.func,
}

export const ContractInformation = props=>{
    const { 
        styles, 
        attributes, 
        onBlur, 
        save, 
        upload,
        feedback,
        isActive,
        errors 
    } = props,
    {
        contractPeriod, 
        offerValidity, 
        siteContact 
    } = attributes;
    return(
        <div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-siteContact"
                    label="Site Contact"
                    value={ siteContact } 
                    type="text"
                    multiline
                    placeholder= "Site contact" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { save } 
                />
                { errors.siteContact?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-offerValidity"
                    label="Offer Validity(Days)"
                    value={ offerValidity } 
                    type="number" 
                    placeholder="Offer validity" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { save } 
                />
                { errors.offerValidity?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <Textfield 
                    id="sites-contractPeriod"
                    label="Contract Period(Years)"
                    value={ contractPeriod } 
                    type="number"
                    placeholder="Period of contract duration" 
                    root="inner-textfield" 
                    fieldClass="textfield"
                    upload = { onBlur }
                    onChange = { save } 
                />
                { errors.contractPeriod?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
            </div>
            <div className="el" style={ styles.el }>
                <FmButton
                    loaderFill = "#fff" 
                    variant="contained" 
                    styles = { styles } 
                    text={ feedback?feedback:"Register Site" }
                    isActive = { isActive }
                    onClick = { upload } 
                />
            </div>
        </div>
    )
}

ContractInformation.defaultProps = {
    upload: null,
    attributes: {}
}

ContractInformation.propTypes = {
    upload: PropTypes.func.isRequired,
    attributes: PropTypes.object,
    onBlur: PropTypes.func,
    save: PropTypes.func
}
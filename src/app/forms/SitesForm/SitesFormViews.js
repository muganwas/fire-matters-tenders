import React from 'react';
import { TickBox, TextSpace, Textfield, DropDown, SecondarySelect, FmButton } from 'components'; 
import { Link } from 'react-router-dom';
import { dispatchedUserInfo, dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import { Info } from '@material-ui/icons';
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
                    onBlur = { onBlur } 
                    onChange={ onChange }
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
                    onBlur = { onBlur }
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
                    onBlur = { onBlur }
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
                    onBlur = { onBlur }
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
                    onBlur = { onBlur }
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
    const { 
        nextView, 
        styles, 
        states, 
        attributes, 
        onBlur, 
        save, 
        upload, 
        errors, 
        isActive, 
        addEquipment, 
        getCategory, 
        getCategoryAlt 
    } = props;
    return(
        <div>
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
                    id="addCategory" 
                    text="Add" 
                    onClick = { addEquipment } 
                    isActive = { isActive }  
                    styles={ styles }
                    variant = "contained"
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
    ) 
}

EquipmentInformation.propTypes = {
    nextView: PropTypes.func,
    getCategory: PropTypes.func,
    getCategoryAlt: PropTypes.func,
}

export const ContractInformation = props=>{
    const { nextView } = props;
    return(
        <div className="pre-signup">
            <div id="service_provider" onClick = { nextView } className="service-provider">I'm a Service Provider</div>
            <div id="owner_occupier" onClick = { nextView } className="owner-occupier">I'm an Owner/Occupier</div>
        </div>
    )
}

ContractInformation.defaultProps = {
    nextView: null
}

ContractInformation.propTypes = {
    nextView: PropTypes.func.isRequired
}
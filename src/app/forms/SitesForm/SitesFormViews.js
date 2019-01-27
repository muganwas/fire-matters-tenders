import React from 'react';
import { Textfield, DropDown, SecondarySelect, FmButton } from 'components'; 
import { dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import { equipmentCategories, equipmentCategoriesFull } from 'extras/config';
import PropTypes from 'prop-types';

const mandatoryInput = "This field is mandatory.";

const RenderEquipment = props => {
    let { currCat, onClose, id } = props;
    return (
        <div>{
            Object.keys(currCat).map(key=>{
                if(currCat[key] && key !== "equipCount"){
                    return (
                        <div className="equipListed" key={key}>
                            { equipmentCategoriesFull[id][key] }
                            <span 
                                className="close right" 
                                category={ id } 
                                subcategory={ key } 
                                onClick={ onClose } 
                                id="close"
                            >
                                &#x2716;
                            </span>
                        </div>
                    );
                }else
                    return null;
            })
        }</div>  
    ) 
}

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
        removeSubCategory,
        secondarySelect,
        addEquipment,
        equipment,
        getCategory, 
        getCategoryAlt 
    } = props,
    selectedArr = secondarySelect.selectedOptions,
    detectionCount = [],
    mechanicalCount = [],
    hazardCount = [],
    portableCount = [],
    passiveCount = [],
    emergencyCount = [],
    {
        detectionAndWarningSystem,
        portableFireFightingEquipment,
        passiveFireProtection,
        mechanicalEquipment,
        specialHazard,
        emergencyExitLighting
    } = equipment;

    Object.keys(detectionAndWarningSystem).map(key=>{
        if(detectionAndWarningSystem[key] && key !== "equipCount"){
            detectionCount.push(key);
        }
    });

    Object.keys(mechanicalEquipment).map(key=>{
        if(mechanicalEquipment[key] && key !== "equipCount"){
            mechanicalCount.push(key);
        }
    });

    Object.keys(specialHazard).map(key=>{
        if(specialHazard[key] && key !== "equipCount"){
            hazardCount.push(key);
        }
    });

    Object.keys(portableFireFightingEquipment).map(key=>{
        if(portableFireFightingEquipment[key] && key !== "equipCount"){
            portableCount.push(key);
        }
    });

    Object.keys(passiveFireProtection).map(key=>{
        if(passiveFireProtection[key] && key !== "equipCount"){
            passiveCount.push(key);
        }
    });

    Object.keys(emergencyExitLighting).map(key=>{
        if(emergencyExitLighting[key] && key !== "equipCount"){
            emergencyCount.push(key);
        }
    });
    return(
        <div>
            <div className="equipment">
            <div className="heading">Equipment Available On-site<div className="bottom-border"></div></div>
                    <div className="information equipment">
                        <div className="site categories">
                            {detectionCount.length>0
                            ?<div className="subCategories">
                                <h3>Detection and Warning System</h3>
                                <div className="body">
                                    <RenderEquipment id="detectionAndWarningSystem" currCat={detectionAndWarningSystem} onClose={ removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {portableCount.length>0
                            ?<div className="subCategories">
                                <h3>Portable Fire-Fighting Equipment</h3>
                                <div className="body">
                                    <RenderEquipment id="portableFireFightingEquipment" currCat={portableFireFightingEquipment} onClose={ removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {passiveCount.length>0
                            ?<div className="subCategories">
                                <h3>Passive Fire Protection</h3>
                                <div className="body">
                                    <RenderEquipment id="passiveFireProtection" currCat={passiveFireProtection} onClose={ removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {mechanicalCount.length>0
                            ?<div className="subCategories">
                                <h3>Mechanical Equipment</h3>
                                <div className="body">
                                    <RenderEquipment id="mechanicalEquipment" currCat={mechanicalEquipment} onClose={ removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {emergencyCount.length>0
                            ?<div className="subCategories">
                                <h3>Emergency Exit Lighting</h3>
                                <div className="body">
                                    <RenderEquipment id="emergencyExitLighting" currCat={emergencyExitLighting} onClose={ removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {hazardCount.length>0
                            ?<div className="subCategories">
                                <h3>Special Hazard Equipment</h3>
                                <div className="body">
                                    <RenderEquipment id="specialHazard" currCat={specialHazard} onClose={ removeSubCategory } />
                                </div>
                            </div>
                            :null}
                        </div>
                    </div>
                <div className="add">
                    { selectedArr.length > 0?<div className="site subCategories">
                    <div className="wizard-feedback">Click add equipment to add the equipment below to your site</div>
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
                    id="addCategory" 
                    text="Add Equipment" 
                    onClick = { addEquipment } 
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
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SecondarySelect, FmButton  } from 'components';
import axios from 'axios';
import 'extras/config';
import { submit_styles } from './styles';
import { dispatchedUserInfo, dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import { equipmentCategories, equipmentCategoriesFull } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.SUB_CONTRACTORS_UPDATE_END_POINT;

const RenderEquipment = props => {
    let { currCat, onClose, id } = props;
    return (
        <div>{
            Object.keys(currCat).map(key=>{
                if(currCat[key]){
                    return (
                        <div key={key}>
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

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.subContractors.info.currentSub,
        equipment: store.subContractors.info.currentSub.equipment,
        subContractorsInfo: store.subContractors.info,
        secondarySelect: store.secondarySelect.info
    }
})
class EquipmentTab extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props= {...nextProps};
    }

    removeSubCategory = (e)=>{
        let userInfo = {...this.props.user},
        userId = userInfo.profileInfo.id,
        equipment = {...userInfo.profileInfo.equipment},
        equipmentCategory = e.target.getAttribute('category'),
        url = baseURL + userUpdateEndPoint,
        equipmentName = e.target.getAttribute('subcategory');
        equipment[equipmentCategory][equipmentName] = false;
        userInfo.addEquipment.submitButton.isActive = false;
        this.props.dispatch(dispatchedUserInfo(userInfo));
        axios.post(url, {userId, sectTitle: "equipment", updateData: equipment}).then(res=>{
            if(res){
                userInfo.addEquipment.submitButton.isActive = true;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                this.forceUpdate();
            }   
        }).
        catch(err=>{
            userInfo.addEquipment.submitButton.isActive = true;
            this.props.dispatch(dispatchedUserInfo(userInfo));
            this.forceUpdate();
            throw err;
        });
    }

    getCategory = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            categoryTitle = "subEquipmentSelectedCategories",
            categoryTitleKey = "subEquipmentSelectedCategoriesKey",
            categoryTitleAlt = "subEquipmentSelectedSubCategories",
            categoryTitleAltKey = "subEquipmentSelectedSubCategoriesKey",
            searchCategories = equipmentCategories,
            selectInfo = {...this.props.secondarySelect};
            selectInfo[categoryTitle] = searchCategories[id];
            selectInfo[categoryTitleKey] = id;
            selectInfo[categoryTitleAlt] = null;
            selectInfo[categoryTitleAltKey] = null;
            resolve(selectInfo);
        });
    }

    getCategoryAlt = (e)=>{
        let categoryTitle = "subEquipmentSelectedCategories",
        categoryTitleAlt = "subEquipmentSelectedSubCategories",
        categoryTitleAltKey = "subEquipmentSelectedSubCategoriesKey",
        selected = this.props.secondarySelect[categoryTitle],
        selectedKey ="";
        Object.keys(equipmentCategories).map(key=>{
            if(equipmentCategories[key] === selected)
                selectedKey = key;
        });
        let secondaryOptions = equipmentCategoriesFull[selectedKey];
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            searchCategories = secondaryOptions,
            selectInfo = {...this.props.secondarySelect};
            selectInfo[categoryTitleAlt] = searchCategories[id];
            selectInfo[categoryTitleAltKey] = id;
            resolve(selectInfo);
        });
    }

    addEquipment = ()=>{
        let selectInfo = {...this.props.secondarySelect},
        userInfo = {...this.props.userInfo},
        user = {...this.props.user},
        userId = userInfo.id,
        equipment = {...userInfo.equipment},
        equipmentCategory = selectInfo.subEquipmentSelectedCategoriesKey,
        url = baseURL + userUpdateEndPoint,
        equipmentName = selectInfo.subEquipmentSelectedSubCategoriesKey;
        equipment[equipmentCategory][equipmentName] = true;
        user.addEquipment.submitButton.isActive = false;
        this.props.dispatch(dispatchedUserInfo(user));
        axios.post(url, {userId, sectTitle: "equipment", updateData: equipment}).then(res=>{
            if(res){
                user.addEquipment.submitButton.isActive = true;
                this.props.dispatch(dispatchedUserInfo(user));
                this.forceUpdate();
            }   
        }).
        catch(err=>{
            user.addEquipment.submitButton.isActive = true;
            this.props.dispatch(dispatchedUserInfo(user));
            this.forceUpdate();
            throw err;
        });
    }

    render(){
        let { equipment }= this.props,
        detectionCount = [],
        portableCount = [],
        passiveCount = [],
        emergencyCount = [],
        {
            detectionAndWarningSystem,
            portableFireFightingEquipment,
            passiveFireProtection,
            emergencyExitLighting
        } = equipment;

        Object.keys(detectionAndWarningSystem).map(key=>{
            if(detectionAndWarningSystem[key]){
                detectionCount.push(key);
            }
        });

        Object.keys(portableFireFightingEquipment).map(key=>{
            if(portableFireFightingEquipment[key]){
                portableCount.push(key);
            }
        });

        Object.keys(passiveFireProtection).map(key=>{
            if(passiveFireProtection[key]){
                passiveCount.push(key);
            }
        });

        Object.keys(emergencyExitLighting).map(key=>{
            if(emergencyExitLighting[key]){
                emergencyCount.push(key);
            }
        });

        let userInfo = this.props.user,
        isActive = userInfo.addEquipment.submitButton.isActive;

        return(
            <div className="main-content">
                <div className="half left">
                    <div className="heading">Equipment Licenses Available<div className="bottom-border"></div></div>
                    <div className="information equipment">
                        <div className="categories">
                            {detectionCount.length>0
                            ?<div className="subCategories">
                                <h3>Detection and Warning System</h3>
                                <div className="body">
                                    <RenderEquipment id="detectionAndWarningSystem" currCat={detectionAndWarningSystem} onClose={ this.removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {portableCount.length>0
                            ?<div className="subCategories">
                                <h3>Portable Fire-Fighting Equipment</h3>
                                <div className="body">
                                    <RenderEquipment id="portableFireFightingEquipment" currCat={portableFireFightingEquipment} onClose={ this.removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {passiveCount.length>0
                            ?<div className="subCategories">
                                <h3>Passive Fire Protection</h3>
                                <div className="body">
                                    <RenderEquipment id="passiveFireProtection" currCat={passiveFireProtection} onClose={ this.removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {emergencyCount.length>0
                            ?<div className="subCategories">
                                <h3>Emergency Exit Lighting</h3>
                                <div className="body">
                                    <RenderEquipment id="emergencyExitLighting" currCat={emergencyExitLighting} onClose={ this.removeSubCategory } />
                                </div>
                            </div>
                            :null}
                        </div>
                        <div className="add">
                                <div className="heading">Add licensed Equipment <div className="bottom-border"></div></div>
                                <div className="body">
                                    <SecondarySelect 
                                        categories = { equipmentCategories }
                                        categoriesFull = { equipmentCategoriesFull }
                                        selectWidth = "240px"
                                        selectWidthAlt = "240px"
                                        dropDownWidth = "260px"
                                        double = { true }
                                        dropDownWidthAlt = "260px"
                                        categoryTitle = "subEquipmentSelectedCategories"
                                        categoryTitleAlt = "subEquipmentSelectedSubCategories"
                                        onChange = { this.getCategory }
                                        onChangeAlt = { this.getCategoryAlt }
                                        dispatcher = { dispatchedSecondarySelectInfo }
                                        dispatcherAlt =  { dispatchedSecondarySelectInfo }
                                        
                                    />
                                    <div className="addEquip">
                                        <FmButton 
                                            id="addCategory" 
                                            text="Add" 
                                            onClick = { this.addEquipment } 
                                            isActive = { isActive }  
                                            styles={ submit_styles }
                                            variant = "contained"
                                        />
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        )
    }
}

EquipmentTab.defaultProps = {
    userInfo: {}
}

EquipmentTab.propTypes = {
    userInfo: PropTypes.object.isRequired,
    licenses: PropTypes.object,
    equipment: PropTypes.object
}

export default EquipmentTab;
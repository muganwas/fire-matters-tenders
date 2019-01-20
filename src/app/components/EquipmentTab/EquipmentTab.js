import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SecondarySelect, FmButton  } from 'components';
import axios from 'axios';
import 'extras/config';
import './equipmentTab.css';
import { submit_styles } from './styles';
import { dispatchedUserInfo, dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import { equipmentCategories, equipmentCategoriesFull } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

const RenderEquipment = props => {
    let { currCat, onClose, id } = props;
    return (
        <div>{
            Object.keys(currCat).map(key=>{
                if(currCat[key]){
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

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info.profileInfo,
        equipment: store.user.info.profileInfo.equipment,
        licenses: store.user.info.profileInfo.licenses,
        secondarySelect: store.secondarySelect.info,
        currentHorizontalTab: store.genInfo.info.sideBar.currenthorizontalTab,
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
            categoryTitle = "searchEquipmentSelectedCategories",
            categoryTitleKey = "searchEquipmentSelectedCategoriesKey",
            categoryTitleAlt = "searchEquipmentSelectedSubCategories",
            categoryTitleAltKey = "searchEquipmentSelectedSubCategoriesKey",
            searchCategories = equipmentCategories,
            selectInfo = {...this.props.secondarySelect};
            selectInfo[categoryTitle] = searchCategories[id];
            selectInfo[categoryTitleKey] = id;
            selectInfo[categoryTitleAlt] = null;
            selectInfo[categoryTitleAltKey] = null;
            selectInfo.selectedOptions = [];
            resolve(selectInfo);
        });
    }

    getCategoryAlt = (e)=>{
        let categoryTitle = "searchEquipmentSelectedCategories",
        categoryTitleAlt = "searchEquipmentSelectedSubCategories",
        categoryTitleAltKey = "searchEquipmentSelectedSubCategoriesKey",
        selected = this.props.secondarySelect[categoryTitle],
        selectedKey ="";
        Object.keys(equipmentCategories).map(key=>{
            if(equipmentCategories[key] === selected)
                selectedKey = key;
        });
        let secondaryOptions = equipmentCategoriesFull[selectedKey];
        return new Promise(resolve=>{
            let id = e.target.id,
            searchCategories = secondaryOptions,
            selectInfo = {...this.props.secondarySelect};
            //check if equipment already selected
            Object.keys(selectInfo.selectedOptions).map(key=>{
                Object.keys(selectInfo.selectedOptions[key]).map(key1=>{
                    let equipment = selectInfo.selectedOptions[key][key1];
                    if(equipment === id){
                        delete selectInfo.selectedOptions[key][key1];
                    }
                });
            });
            selectInfo.selectedOptions.push({[selectedKey]:id});
            selectInfo[categoryTitleAlt] = searchCategories[id];
            selectInfo[categoryTitleAltKey] = id;
            resolve(selectInfo);
        });
    }

    addEquipment = ()=>{
        let selectInfo = {...this.props.secondarySelect},
        userInfo = {...this.props.user},
        userId = userInfo.profileInfo.id,
        equipment = {...userInfo.profileInfo.equipment},
        equipmentCategory = selectInfo.searchEquipmentSelectedCategoriesKey,
        url = baseURL + userUpdateEndPoint;
        //equipmentName = selectInfo.searchEquipmentSelectedSubCategoriesKey;
        if(equipment[equipmentCategory]){
            //update equipment object according to selected options
            Object.keys(selectInfo.selectedOptions).map(key=>{
                Object.keys(selectInfo.selectedOptions[key]).map(key1=>{
                    let equipmentAlt = selectInfo.selectedOptions[key][key1];
                    equipment[key1][equipmentAlt] = true;
                });
            });
                
            //equipment[equipmentCategory][equipmentName] = true;
            selectInfo.selectedOptions = [];
            userInfo.addEquipment.submitButton.isActive = false;
            this.props.dispatch(dispatchedSecondarySelectInfo(selectInfo));
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
    }

    removeSelectedEquipment = (e)=>{
        let position = e.target.getAttribute('pos'),
        secondarySelect = {...this.props.secondarySelect};
        secondarySelect.selectedOptions.splice(position,1);
        this.props.dispatch(dispatchedSecondarySelectInfo(secondarySelect));
        this.forceUpdate();
    }

    render(){
        let { equipment }= this.props,
        selectedArr = this.props.secondarySelect.selectedOptions,
        detectionCount = [],
        mechanicalCount = [],
        hazardCount = [],
        planningCount = [],
        portableCount = [],
        passiveCount = [],
        emergencyCount = [],
        {
            detectionAndWarningSystem,
            portableFireFightingEquipment,
            passiveFireProtection,
            mechanicalEquipment,
            specialHazard,
            emergencyPlanning,
            emergencyExitLighting
        } = equipment;

        Object.keys(detectionAndWarningSystem).map(key=>{
            if(detectionAndWarningSystem[key]){
                detectionCount.push(key);
            }
        });

        Object.keys(mechanicalEquipment).map(key=>{
            if(mechanicalEquipment[key]){
                mechanicalCount.push(key);
            }
        });

        Object.keys(specialHazard).map(key=>{
            if(specialHazard[key]){
                hazardCount.push(key);
            }
        });

        Object.keys(emergencyPlanning).map(key=>{
            if(emergencyPlanning[key]){
                planningCount.push(key);
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
                            {mechanicalCount.length>0
                            ?<div className="subCategories">
                                <h3>Mechanical Equipment</h3>
                                <div className="body">
                                    <RenderEquipment id="mechanicalEquipment" currCat={mechanicalEquipment} onClose={ this.removeSubCategory } />
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
                            {hazardCount.length>0
                            ?<div className="subCategories">
                                <h3>Special Hazard Equipment</h3>
                                <div className="body">
                                    <RenderEquipment id="specialHazard" currCat={specialHazard} onClose={ this.removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            {planningCount.length>0
                            ?<div className="subCategories">
                                <h3>Emergency Planning</h3>
                                <div className="body">
                                    <RenderEquipment id="emergencyPlanning" currCat={emergencyPlanning} onClose={ this.removeSubCategory } />
                                </div>
                            </div>
                            :null}
                            
                        </div>
                        <div className="add">
                                <div className="heading">Add licensed Equipment <div className="bottom-border"></div></div>
                                { selectedArr.length > 0?<div className="subCategories">
                                    <h4>Selected Equipment</h4>
                                    <div className="body">
                                        { Object.keys(selectedArr).map(key=>{
                                            let selectedArr = this.props.secondarySelect.selectedOptions,
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
                                                                    onClick={ this.removeSelectedEquipment } 
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
                                <div className="body">
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
    currentHorizontalTab: PropTypes.string,
    licenses: PropTypes.object
}

export default EquipmentTab;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SecondarySelect, FmButton, DropDown, Textfield } from 'components';
import { dispatchedSitesInfo, dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import axios from 'axios';
import { submit_styles } from './styles';
import {  
    equipmentCategories,
    equipmentCategoriesFull
} from 'extras/config';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.SITE_UPDATE_END_POINT;
 
const RenderEquipment = props => {
    let { currCat, onClose, id, onIncrease, onDecrease, currSite } = props;
    return (
        <div>{
            Object.keys(currCat).map(key=>{
                if(currCat[key] === true && key !== "equipCount"){
                    let currCount = currCat.equipCount[key],
                    postedClass = currSite.postedClass,
                    currExClass = postedClass?
                    postedClass[id]?
                    postedClass[id][key]:
                    undefined:
                    undefined,
                    equipCountContainerClass = currExClass?"equipCount " + currExClass:"equipCount",
                    properName = equipmentCategoriesFull[id][key];
                    console.log(key)
                    console.log(id)
                    return (
                        <div key={key}>
                            <div className="equipListed">
                                { properName }
                                <span 
                                    className="close right" 
                                    category={ id } 
                                    subcategory={ key } 
                                    onClick={ onClose } 
                                    id="close"
                                >
                                    &#x2716;
                                </span>
                                <span className={equipCountContainerClass}>
                                    <span className="countAlter">
                                        <span category = { id } equipment={ key } className="decriment" onClick={ onDecrease }>&lsaquo;</span>
                                        <span className="countDigit">{ currCount }</span>
                                        <span category = { id } equipment={ key }  className="increment" onClick={ onIncrease }>&rsaquo;</span>
                                    </span>
                                </span>
                            </div>
                            <div className="clear"></div>
                        </div>
                    );
                }else
                    return null;
            })
        }</div>  
    ) 
}

class ListedPostedSiteDetails extends React.Component {
    constructor(props){
        super(props)
    }

    upload=(e)=>{
        e.persist();
        let { currSite } = this.props,
        id = e.target.id,
        value = e.target.value;
        value = value?value:e.target.getAttribute('value');
        let origName = e.target.getAttribute('category');
        id = origName?origName:id;
        let idArr = id.split("-"),
        sectTitle = idArr[1],
        userInfo = currSite;
        return new Promise((resolve, reject)=>{
            let siteId = userInfo.id,
            updateData = currSite,
            updateInfoUrl = baseURL + userUpdateEndPoint,
            updateObject = {siteId, updateData};

            axios.post(updateInfoUrl, updateObject).
            then(res=>{
                console.log(res);
                resolve(res);
            }).
            catch(err=>{
                reject(err);
            });
        });
    }

    save=(e)=>{
        e.persist();
        let { sitesInfo } = this.props;
        return new Promise(resolve=>{
            let id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.value;
            value = value?value:getAttribute('value');
            sitesInfo.activeSite[name] = value;
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            if(sitesInfo)                     
                resolve(sitesInfo);
            else
                reject({message: "No data"});
        }); 
    }

    removeSubCategory = (e)=>{
        let sitesInfo = {...this.props.sitesInfo},
        currSite = {...this.props.currSite},
        siteId = currSite.id,
        equipment = {...currSite.equipment},
        equipmentCategory = e.target.getAttribute('category'),
        url = baseURL + userUpdateEndPoint,
        equipmentName = e.target.getAttribute('subcategory');
        equipment[equipmentCategory][equipmentName] = false;
        sitesInfo.addEquipment.submitButton.isActive = false;
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
        axios.post(url, {siteId, sectTitle: "equipment", updateData: equipment}).then(res=>{
            if(res){
                sitesInfo.addEquipment.submitButton.isActive = true;
                this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                this.forceUpdate();
            }   
        }).
        catch(err=>{
            sitesInfo.addEquipment.submitButton.isActive = true;
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            this.forceUpdate();
            throw err;
        });
    }

    getCategory = (e)=>{
        return new Promise(resolve=>{
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
        currSite = {...this.props.currSite},
        sitesInfo = {...this.props.sitesInfo},
        siteId = currSite.id,
        equipment = {...currSite.equipment},
        equipmentCategory = selectInfo.searchEquipmentSelectedCategoriesKey,
        url = baseURL + userUpdateEndPoint,
        equipmentName = selectInfo.searchEquipmentSelectedSubCategoriesKey;
        equipment[equipmentCategory][equipmentName] = true;
        sitesInfo.addEquipment.submitButton.isActive = false;
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
        axios.post(url, { siteId, sectTitle: "equipment", updateData: equipment}).then(res=>{
            if(res){
                sitesInfo.addEquipment.submitButton.isActive = true;
                this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                this.forceUpdate();
            }   
        }).
        catch(err=>{
            sitesInfo.addEquipment.submitButton.isActive = true;
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            this.forceUpdate();
            throw err;
        });
    }

    onIncrease = (e)=>{
        let equipment = e.target.getAttribute('equipment'),
        category = e.target.getAttribute('category'),
        sitesInfo = {...this.props.sitesInfo},
        currSite = {...this.props.currSite},
        siteId = currSite.id,
        url = baseURL + userUpdateEndPoint,
        siteKey = this.props.siteKey,
        currCount = sitesInfo.sites[siteKey].equipment[category].equipCount[equipment];
        sitesInfo.sites[siteKey].equipment[category].equipCount[equipment] = currCount + 1;
        let equipmentObj = sitesInfo.sites[siteKey].equipment;
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
        axios.post(url, { siteId, sectTitle: "equipment", updateData: equipmentObj }).then(res=>{
            if(res){
                sitesInfo.sites[siteKey].postedClass = {};
                sitesInfo.sites[siteKey].postedClass[category] = {};
                sitesInfo.sites[siteKey].postedClass[category][equipment] = "successfulPost";
                this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                this.forceUpdate();
            }   
        }).
        catch(err=>{
            sitesInfo.sites[siteKey].postedClass = {};
            sitesInfo.sites[siteKey].postedClass[category] = {};
            sitesInfo.sites[siteKey].postedClass[category][equipment] = "successfulPost";
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            this.forceUpdate();
            throw err;
        });      
    }

    onDecrease = (e)=>{
        let equipment = e.target.getAttribute('equipment'),
        category = e.target.getAttribute('category'),
        sitesInfo = {...this.props.sitesInfo},
        currSite = {...this.props.currSite},
        url = baseURL + userUpdateEndPoint,
        siteId = currSite.id,
        siteKey = this.props.siteKey,
        currCount = sitesInfo.sites[siteKey].equipment[category].equipCount[equipment];

        if(currCount > 1){
            sitesInfo.sites[siteKey].equipment[category].equipCount[equipment] = currCount - 1;
            let equipmentObj = sitesInfo.sites[siteKey].equipment;
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            axios.post(url, { siteId, sectTitle: "equipment", updateData: equipmentObj }).then(res=>{
                if(res){
                    sitesInfo.sites[siteKey].postedClass = {};
                    sitesInfo.sites[siteKey].postedClass[category] = {};
                    sitesInfo.sites[siteKey].postedClass[category][equipment] = "successfulPost";
                    this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                    this.forceUpdate();
                }   
            }).
            catch(err=>{
                sitesInfo.sites[siteKey].postedClass = {};
                sitesInfo.sites[siteKey].postedClass[category] = {};
                sitesInfo.sites[siteKey].postedClass[category][equipment] = "successfulPost";
                this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                this.forceUpdate();
                throw err;
            });
        }
    }

    render(){
        let { currSite } = this.props,
        { siteName, siteLocation, currentContractor, contractStatus, equipment } = currSite,
        detectionCount = [],
        specialCount = [],
        portableCount = [],
        passiveCount = [],
        mechanicalCount = [],
        emergencyCount = [],
        sitesInfo = {...this.props.sitesInfo},
        {
            detectionAndWarningSystem,
            portableFireFightingEquipment,
            passiveFireProtection,
            emergencyExitLighting,
            specialHazard,
            mechanicalEquipment
        } = equipment;

        Object.keys(specialHazard).map(key=>{
            if(specialHazard[key]){
                specialCount.push(key);
            }
        });

        Object.keys(mechanicalEquipment).map(key=>{
            if(mechanicalEquipment[key]){
                mechanicalCount.push(key);
            }
        });

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

        let isActive = sitesInfo.addEquipment.submitButton.isActive;

        return(
            <div className="sub-container">
                <div className="half left">
                    <div className="heading">Current Site: { siteName }<div className="bottom-border"></div></div>
                    <br />
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="sites-siteName" 
                                value={ siteName }
                                label="Site Name"
                                type="text" 
                                placeholder="Input site name"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="sites-siteLocation"
                                label = "Site Location"
                                value={ siteLocation } 
                                type = "text"
                                placeholder="Input site location"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="sites-currentContractor" 
                                value={ currentContractor }
                                label="Contractor"
                                type="text" 
                                placeholder="Input current contractor" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save }  
                            />
                        </div>
                        <div className="el">
                                <DropDown 
                                    label="Contract Status" 
                                    id="sites-contractStatus" 
                                    className="select" 
                                    init={ contractStatus } 
                                    width="330px" 
                                    options={{inactive: "Not Active", active: "Active"}} 
                                    selected={ contractStatus || "Not active" } 
                                    upload={ this.upload }
                                    save={ this.save }
                                />
                        </div>                        
                    </div>
                </div>
                <div className="half left">
                    <div className="heading">Equipment Available On-Site<div className="bottom-border"></div></div>
                    <div className="information equipment">
                        <div className="categories">
                            {detectionCount.length>1
                            ?<div className="subCategories">
                                <h3>Detection and Warning System</h3>
                                <div className="body">
                                    <div className="equip-title-bar">
                                        <div className="equipListed">
                                            Equipment
                                            <span className="equipCount title">
                                                <span className="countAlter">
                                                    <span className="decriment"></span>
                                                    <span className="countDigit">Quantity</span>
                                                    <span  className="increment"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <RenderEquipment 
                                        onIncrease={ this.onIncrease } 
                                        onDecrease={ this.onDecrease } 
                                        id="detectionAndWarningSystem" 
                                        currCat={detectionAndWarningSystem}
                                        currSite={this.props.currSite}
                                        onClose={ this.removeSubCategory } 
                                    />
                                </div>
                            </div>
                            :null}
                            {mechanicalCount.length>1
                            ?<div className="subCategories">
                                <h3>Mechanical Equipment</h3>
                                <div className="body">
                                    <div className="equip-title-bar">
                                        <div className="equipListed">
                                            Equipment
                                            <span className="equipCount title">
                                                <span className="countAlter">
                                                    <span className="decriment"></span>
                                                    <span className="countDigit">Quantity</span>
                                                    <span  className="increment"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <RenderEquipment 
                                        onIncrease={ this.onIncrease } 
                                        onDecrease={ this.onDecrease } 
                                        id="mechanicalEquipment" 
                                        currCat={ mechanicalEquipment }
                                        currSite={this.props.currSite}
                                        onClose={ this.removeSubCategory } 
                                    />
                                </div>
                            </div>
                            :null}
                            {specialCount.length>1
                            ?<div className="subCategories">
                                <h3>Special Hazard</h3>
                                <div className="body">
                                    <div className="equip-title-bar">
                                        <div className="equipListed">
                                            Equipment
                                            <span className="equipCount title">
                                                <span className="countAlter">
                                                    <span className="decriment"></span>
                                                    <span className="countDigit">Quantity</span>
                                                    <span  className="increment"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <RenderEquipment 
                                        onIncrease={ this.onIncrease } 
                                        onDecrease={ this.onDecrease } 
                                        id="specialHazard" 
                                        currCat={ specialHazard }
                                        currSite={this.props.currSite}
                                        onClose={ this.removeSubCategory } 
                                    />
                                </div>
                            </div>
                            :null}
                            {portableCount.length>1
                            ?<div className="subCategories">
                                <h3>Portable Fire-Fighting Equipment</h3>
                                <div className="body">
                                    <div className="equip-title-bar">
                                        <div className="equipListed">
                                            Equipment
                                            <span className="equipCount title">
                                                <span className="countAlter">
                                                    <span className="decriment"></span>
                                                    <span className="countDigit">Quantity</span>
                                                    <span  className="increment"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <RenderEquipment
                                        onIncrease={ this.onIncrease } 
                                        onDecrease={ this.onDecrease } 
                                        id="portableFireFightingEquipment" 
                                        currCat={portableFireFightingEquipment}
                                        currSite={this.props.currSite}
                                        onClose={ this.removeSubCategory } 
                                    />
                                </div>
                            </div>
                            :null}
                            {passiveCount.length>1
                            ?<div className="subCategories">
                                <h3>Passive Fire Protection</h3>
                                <div className="body">
                                    <div className="equip-title-bar">
                                        <div className="equipListed">
                                            Equipment
                                            <span className="equipCount title">
                                                <span className="countAlter">
                                                    <span className="decriment"></span>
                                                    <span className="countDigit">Quantity</span>
                                                    <span  className="increment"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <RenderEquipment
                                        onIncrease={ this.onIncrease } 
                                        onDecrease={ this.onDecrease } 
                                        id="passiveFireProtection" 
                                        currCat={passiveFireProtection}
                                        currSite={this.props.currSite}
                                        onClose={ this.removeSubCategory } 
                                    />
                                </div>
                            </div>
                            :null}
                            {emergencyCount.length>1
                            ?<div className="subCategories">
                                <h3>Emergency Exit Lighting</h3>
                                <div className="body">
                                    <div className="equip-title-bar">
                                        <div className="equipListed">
                                            Equipment
                                            <span className="equipCount title">
                                                <span className="countAlter">
                                                    <span className="decriment"></span>
                                                    <span className="countDigit">Quantity</span>
                                                    <span  className="increment"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="clear"></div>
                                    </div>
                                    <RenderEquipment
                                        onIncrease={ this.onIncrease } 
                                        onDecrease={ this.onDecrease } 
                                        id="emergencyExitLighting" 
                                        currCat={emergencyExitLighting}
                                        currSite={this.props.currSite}
                                        onClose={ this.removeSubCategory }
                                     />
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
                                    double = { true }
                                    dropDownWidth = "260px"
                                    dropDownWidthAlt = "260px"
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

ListedPostedSiteDetails.defaultProps = {
    user: {},
    sitesInfo: {},
    currentSite: {}
}

ListedPostedSiteDetails.propTypes = {
    user: PropTypes.object.isRequired,
    sitesInfo: PropTypes.object.isRequired,
    currentSite: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        user: store.user.info,
        sitesInfo: store.sites.info,
        currSite: store.sites.info.activeSite,
        secondarySelect: store.secondarySelect.info,
    }
})(ListedPostedSiteDetails);

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    dispatchedGenInfo, 
    dispatchedSitesInfo, 
    dispatchedUserInfo,
    dispatchedSecondarySelectInfo
} from 'extras/dispatchers';
import './sitesForm.css';
import { submit_styles } from './styles';
import { AddressInformation, EquipmentInformation, ContractInformation } from './SitesFormViews';
import { equipmentCategories, equipmentCategoriesFull, statesAustralia} from 'extras/config';

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info,
        listingsInfo: store.listingsInfo.info,
        secondarySelect: store.secondarySelect.info,
        equipment: store.sites.info.createSite.defaultEquipmentObject,
        genInfo: store.genInfo.info,
        sitesInfo: store.sites.info
    }
})
class SitesForm extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillMount(){
        
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    removeSubCategory = (e)=>{
        let userInfo = {...this.props.user},
        sitesInfo = {...this.props.sitesInfo},
        equipment = sitesInfo.createSite.defaultEquipmentObject,
        equipmentCategory = e.target.getAttribute('category'),
        equipmentName = e.target.getAttribute('subcategory');
        equipment[equipmentCategory][equipmentName] = false;
        userInfo.addEquipment.submitButton.isActive = false;
        this.props.dispatch(dispatchedUserInfo(userInfo));
        /*axios.post(url, {userId, sectTitle: "equipment", updateData: equipment}).then(res=>{
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
        });*/
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
            /*Theres no need to reset selectedOptions*/
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
        sitesInfo = {...this.props.sitesInfo},
        equipment = sitesInfo.createSite.defaultEquipmentObject,
        equipmentCategory = selectInfo.searchEquipmentSelectedCategoriesKey;
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
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            this.forceUpdate();
            /*axios.post(url, {userId, sectTitle: "equipment", updateData: equipment}).then(res=>{
                if(res){
                    userInfo.addEquipment.submitButton.isActive = true;
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    
                }   
            }).
            catch(err=>{
                userInfo.addEquipment.submitButton.isActive = true;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                this.forceUpdate();
                throw err;
            });*/
        }  
    }

    removeSelectedEquipment = (e)=>{
        let position = e.target.getAttribute('pos'),
        secondarySelect = {...this.props.secondarySelect};
        secondarySelect.selectedOptions.splice(position,1);
        this.props.dispatch(dispatchedSecondarySelectInfo(secondarySelect));
        this.forceUpdate();
    }

    inputValidate = (e)=>{
        return new Promise((resolve)=>{
            let genInfo = {...this.props.genInfo},
            userInfo = {...this.props.user},
            level = genInfo.createSiteProgress.createSiteFormLevel,
            siteDits = userInfo.submitSite.siteDits,
            errors = userInfo.submitSite.errors;
            if(e){
                let id = e.target.getAttribute('category');
                id = id?id:e.target.id;
                let sIdArr = id.split("-"),
                value = e.target.value;
                value = value?value: e.target.getAttribute('value');
                let sId = sIdArr[1]?sIdArr[1]:sIdArr[0];
                console.log(value)
                console.log(sId)
                if(!value || value.length === 0)
                    errors[sId] = true;
                else
                    delete errors[sId];

                this.props.dispatch(dispatchedUserInfo(userInfo));
                this.forceUpdate();
                resolve("one checked");
            }else{
                let addressFields = [
                    "siteName", 
                    "siteState", 
                    "siteCity", 
                    "siteArea",
                    "siteSuburb",
                    "siteStreet"
                ],
                contractInfoFields = [
                    "siteContact",
                    "offerValidity",
                    "contractPeriod"
                ];
                if(level === 1){
                    Object.keys(addressFields).map(key=>{
                        let currDit = siteDits[addressFields[key]];
                        if(!currDit){
                            errors[addressFields[key]] = true;
                        }else
                            delete errors[addressFields[key]];
                    });
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                }
                else if(level === 3){
                    Object.keys(contractInfoFields).map(key=>{
                        let currDit = siteDits[contractInfoFields[key]];
                        if(!currDit){
                            errors[contractInfoFields[key]] = true;
                        }else
                            delete errors[contractInfoFields[key]];
                    });
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                }
                resolve("all checked");
            }
        });
    }

    nextView = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            info = {...this.props.genInfo},
            selectedEquip = this.props.secondarySelect.selectedOptions,
            selectedEquipObj= {},
            userInfo = {...this.props.userInfo},
            errors = userInfo.submitSite.errors,
            level = info.createSiteProgress.createSiteFormLevel;

            for(let count =0; count < selectedEquip.length; count++){
                Object.keys(selectedEquip[count]).map(key=>{
                      selectedEquipObj[selectedEquip[count][key]] = selectedEquip[count][key];
                });
            }

            userInfo.submitSite.selectedEquip = {...selectedEquipObj};
            if(level === 1){
                this.inputValidate().then(res=>{
                    if(res === "all checked"){
                        let presErrorsCount = Object.keys(errors).length;
                        if(presErrorsCount === 0){
                            let newLevel = level+1;
                            info.createSiteProgress.createSiteFormLevel = newLevel;
                            info.createSiteProgress.twoClass = "two current";
                            this.props.dispatch(dispatchedGenInfo(info));
                            this.forceUpdate();
                        }
                    }
                });
            }
            else if(level === 2){
                let newLevel = level+1;
                info.createSiteProgress.createSiteFormLevel = newLevel;
                info.createSiteProgress.threeClass = "three current";
                this.props.dispatch(dispatchedUserInfo(userInfo));
                this.props.dispatch(dispatchedGenInfo(info));
                this.forceUpdate();
            }
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
            errors,
            genInfo,
            submitButton,
            sitesInfo,
            equipment
        } = this.props,
        { 
            siteName,
            siteState,
            siteCity,
            siteArea,
            siteSuburb,
            siteStreet,
            siteContact,
            offerValidity,
            contractPeriod
        } = attributes,
        first = genInfo.createSiteProgress.oneClass,
        second = genInfo.createSiteProgress.twoClass,
        third = genInfo.createSiteProgress.threeClass,
        level = genInfo.createSiteProgress.createSiteFormLevel,
        isActive = submitButton.isActive,
        addEquipmentButton =  sitesInfo.createSite.addEquipmentButton.isActive;
        
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
                                onBlur = { this.inputValidate }
                                onChange = { save }
                                errors = { errors }
                                attributes = { { siteName, siteState, siteCity, siteArea, siteSuburb, siteArea, siteStreet } }
                                nextView = { this.nextView }
                            />
                        : level === 2?
                            <EquipmentInformation 
                                styles = { submit_styles }
                                getCategory = { this.getCategory }
                                save = { save }
                                secondarySelect = { this.props.secondarySelect}
                                removeSelectedEquipment = { this.removeSelectedEquipment }
                                removeSubCategory = { this.removeSubCategory }
                                getCategoryAlt = { this.getCategoryAlt }
                                addEquipment = { this.addEquipment }
                                isActive = { addEquipmentButton }
                                equipment = { equipment }
                                nextView = { this.nextView }
                            />
                        : level === 3?
                            <ContractInformation
                                onBlur = { this.inputValidate }
                                save = { save }
                                upload = { upload }
                                feedback = { feedback }
                                errors = { errors }
                                styles = { submit_styles }
                                isActive = { isActive }
                                attributes = { { siteContact, offerValidity, contractPeriod } }
                            />
                        : null }
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
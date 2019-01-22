import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
    dispatchedGenInfo, 
    dispatchedSitesInfo, 
    dispatchedUserInfo 
} from 'extras/dispatchers';
import './sitesForm.css';
import { submit_styles } from './styles';
import { AddressInformation, EquipmentInformation, ContractInformation } from './SitesFormViews';
import { equipmentCategories, equipmentCategoriesFull } from 'extras/config';
import { statesAustralia } from 'extras/config';

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info,
        listingsInfo: store.listingsInfo.info,
        genInfo: store.genInfo.info,
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

    inputValidate = (e)=>{
        return new Promise((resolve)=>{
            let id = e.target.id,
            
            value = e.target.value;
            value = value?value: e.target.getAttribute('value');
            if(value.length>0){
                console.log("there")
            }
            resolve("all checked");
        });
    }

    nextView = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            info = {...this.props.genInfo},
            level = info.createSiteProgress.createSiteFormLevel,
            first = info.createSiteProgress.oneClass,
            second = info.createSiteProgress.twoClass,
            third = info.createSiteProgress.threetwoClass,
            newLevel = level+1;
            info.createSiteProgress.createSiteFormLevel = newLevel;
            if(level === 1){
                info.signUpProgressBar.twoClass = second + " current";
                info.signUpProgressBar.oneClass = "one";
                info.signUpProgressBar.threeClass = "three";
            }
            else if(level === 2){
                info.signUpProgressBar.threeClass = third + " current";
                info.signUpProgressBar.twoClass = "two";
                info.signUpProgressBar.oneClass = "one";
            }else{
                info.signUpProgressBar.threeClass = "three";
                info.signUpProgressBar.twoClass = "two";
                info.signUpProgressBar.oneClass = first + " current";
            }
            this.props.dispatch(dispatchedGenInfo(info));
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
            contractStatusOptions, 
            onBlur,  
            errors,
            genInfo,
            sitesInfo
        } = this.props,
        { 
            siteName,
            siteState,
            siteCity,
            siteArea,
            siteStreet, 
            currentContractor, 
            siteContractStatus, 
            submitButton 
        } = attributes,
        first = genInfo.createSiteProgress.oneClass,
        second = genInfo.createSiteProgress.twoClass,
        third = genInfo.createSiteProgress.threeClass,
        level = genInfo.createSiteProgress.createSiteFormLevel,
        mandatoryInput = "This field is mandatory.",   
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
                                attributes = { {siteName, siteState} }
                                nextView = { this.nextView }
                            />
                        : level === 2?
                            <EquipmentInformation 
                                styles = { submit_styles }
                                getCategory = { this.getCategory }
                                getCategoryAlt = { this.getCategoryAlt }
                                addEquipment = { this.addEquipment }
                                isActive = { addEquipmentButton }
                                nextView = { this.nextView }
                            />
                        :null }
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
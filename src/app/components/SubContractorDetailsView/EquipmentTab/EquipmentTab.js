import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SecondarySelect, FmButton  } from 'components';
import axios from 'axios';
import * as firebase from 'firebase/app';
import 'extras/config';
import 'firebase/storage';
import 'firebase/database';
import { submit_styles } from './styles';
import { dispatchedUserInfo, dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import { equipmentCategories, equipmentCategoriesFull } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
userEndPoint = process.env.USERS_END_POINT,
storage = firebase.storage(),
storageRef = storage.ref(),
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

const RenderEquipment = props => {
    let { currCat, onClose, id } = props;
    return (
        <div>{
            Object.keys(currCat).map(key=>{
                if(currCat[key] === true){
                    return (
                        <div key={key}>
                            { key }
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

    componentWillMount(){
        let emailAddress = (JSON.parse(sessionStorage.getItem('profileInfo'))).emailAddress,
        userInfoURL = baseURL + userEndPoint + "?emailAddress=" + emailAddress,
        licenses = (JSON.parse(sessionStorage.getItem('profileInfo'))).licenses;
        axios.get(userInfoURL).then(res=>{
            if(res){
                let newLicense = res.data[0].licenses,
                userInfo = {...this.props.user};
                userInfo.profileInfo.licenses = newLicense;
                if(JSON.stringify(licenses) !== JSON.stringify(newLicense)){
                    this.props.dispatch(dispatchedUserInfo(newLicense));
                }
            }     
        }).
        catch(err=>{
            console.log(err)
        });
    }

    upload=()=>{
        let sectTitle = "licenses";
        let updateData = {...this.props.licenses};
        return new Promise((resolve, reject)=>{
            let userId = this.props.userInfo.id,
            updateInfoUrl = baseURL + userUpdateEndPoint,
            updateObject = {userId, sectTitle, updateData};
            axios.post(updateInfoUrl, updateObject).
            then(res=>{
                resolve(res);
            }).
            catch(err=>{
                reject(err);
            })
        });
    };

    save=(e)=>{
        return new Promise((resolve, reject)=>{
            let userInfo = {...this.props.user},
            id = e.target.id,
            origName = id;
            let nameArr = origName.split("-"),
            key = nameArr[0],
            name = nameArr[1],
            value = e.target.getAttribute('value');
            value = value?value:e.target.value;
            userInfo.profileInfo.licenses[key][name] = value;
            if(userInfo)                     
                resolve(userInfo);
            else
                reject({message: "No data"});
        });
    };

    toggleDisplay = (e)=>{
        let userInfo = {...this.props.user};
        let licenses = userInfo.profileInfo.licenses;
        let insurancePolicy = e.target.id;
        if(licenses[insurancePolicy].className === "hidden"){
            userInfo.profileInfo.licenses[insurancePolicy].className = "";
            userInfo.profileInfo.licenses[insurancePolicy].checked = true;
        }   
        else{
            userInfo.profileInfo.licenses[insurancePolicy].className = "hidden"
            userInfo.profileInfo.licenses[insurancePolicy].checked = false;
        } 
        this.props.dispatch(dispatchedUserInfo(userInfo)); 
    }

    showLoader=(e)=>{
        e.persist(); 
        let id = e.target.id,
        tagArr = id.split('_'),
        tag = tagArr[1],
        { user } = this.props; 
        console.log(tag)
        this.uploadCert(e).then(res=>{
            console.log(res)
            user.profileInfo.licenses[tag].uploadingCert = res.loading;              
            this.props.dispatch(dispatchedUserInfo(user));
            setTimeout(this.forceUpdate(), 50);
        }).
        catch(err=>{
            console.log(err)
        });
    }

    uploadCert = (e)=>{
        return new Promise((resolve, reject)=>{
            let userId = (JSON.parse(sessionStorage.getItem('loginSession'))).userId,
            { user } = this.props,
            id = e.target.id,
            tagArr = id.split('_'),
            tag = tagArr[1],
            file = e.target.files[0],
            fname = file.name,
            fnameArr = fname.split('.'),
            fnameExt = fnameArr.pop();
            if(fnameExt === "pdf"){
                let newCertRef = storageRef.child(`${ userId }/${ tag }.${ fnameExt }`);
                newCertRef.put(file).then(()=>{
                    user.profileInfo.licenses[tag].uploadingCert = true;              
                    this.props.dispatch(dispatchedUserInfo(user));
                    newCertRef.getDownloadURL().then((url)=>{
                        if(url){
                            user.profileInfo.licenses[tag].certURL = url;
                            this.props.dispatch(dispatchedUserInfo(user));
                            let licenses = {...user.profileInfo.licenses};
                            this.upload(licenses).then(res=>{
                                if(res){
                                    let obj = {loading: false};
                                    resolve(obj);
                                }
                            });
                        }
                    });
                }, ()=>{
                    console.log("err")
                    let avatarProps = {
                        feedback: 'There was an error!, try again.',
                    };
                    user.profileInfo.licenses.feedback = avatarProps.feedback;              
                    this.props.dispatch(dispatchedUserInfo(user));
                    reject({message: "There was an error", loading: false});
                });
            }else{
                let avatarProps = {
                    feedback: `only PDFs are allowed!`,
                };
                user.profileInfo.insurancefeedback = avatarProps.feedback;
                this.props.dispatch(dispatchedUserInfo(user));
                reject({message: "There was an error", loading: false});
            }
        });
    }

    clickUploadCert = (e)=>{
        let id = e.target.id,
        idArr = id.split('-'),
        desId = idArr[1];
        if(desId){
            let uploadB = document.getElementById(desId);
            uploadB.click();
        }else
            console.log('no desId')   
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
        userInfo = {...this.props.user},
        userId = userInfo.profileInfo.id,
        equipment = {...userInfo.profileInfo.equipment},
        equipmentCategory = selectInfo.searchEquipmentSelectedCategoriesKey,
        url = baseURL + userUpdateEndPoint,
        equipmentName = selectInfo.searchEquipmentSelectedSubCategoriesKey;
        equipment[equipmentCategory][equipmentName] = true;
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

EquipmentTab.defaultProps = {
    userInfo: {}
}

EquipmentTab.propTypes = {
    userInfo: PropTypes.object.isRequired,
    currentHorizontalTab: PropTypes.string,
    licenses: PropTypes.object
}

export default EquipmentTab;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textfield, ChckBox, Loader } from 'components';
import axios from 'axios';
import * as firebase from 'firebase/app';
import 'extras/config';
import 'firebase/storage';
import 'firebase/database';
import './licenseTab.css'
import { dispatchedUserInfo } from 'extras/dispatchers';

const baseURL = process.env.BACK_END_URL,
userEndPoint = process.env.USERS_END_POINT,
storage = firebase.storage(),
storageRef = storage.ref(),
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

@connect(store=>{
    return {
        user: store.user.info,
        userInfo: store.user.info.profileInfo,
        licenses: store.user.info.profileInfo.licenses,
        currentHorizontalTab: store.genInfo.info.sideBar.currenthorizontalTab,
    }
})
class LicenseTab extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props= {...nextProps};
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
            value = e.target.value;
            value = value?value:e.target.getAttribute('value');
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

    renderLicenses = (key)=>{
        let { licenses, userInfo }= this.props,
        className = licenses[key].className,
        uploadingCert = userInfo.licenses[key].uploadingCert,
        licenseType = licenses[key].type,
        licenseNumber = licenses[key].licenseNumber,
        expiryDate = licenses[key].expiryDate,
        name = licenses[key].name,
        certURL = licenses[key].certURL,
        value = licenses[key].checked;
        if(key !== "other"){
            return(
                <div key={ key } className="el">
                    <ChckBox handleChange={ this.toggleDisplay } dispatcher = { dispatchedUserInfo } value={ value } id={ key } />
                    <span>{name}</span>
                    <div className={ className }>
                        <Textfield 
                            id={ key + "-type" }
                            label="Licence Type"
                            value={ licenseType }
                            subCategory={"licenses"} 
                            type="text" 
                            placeholder="License Type" 
                            root="inner-textfield" 
                            fieldClass="textfield"
                            onBlur={ this.upload }
                            onChange = { this.save } 
                        />
                        <Textfield 
                            id={ key + "-licenseNumber" }
                            label="License Number"
                            value={ licenseNumber }
                            subCategory={"licenses"} 
                            type="text" 
                            placeholder="License Number" 
                            root="inner-textfield" 
                            fieldClass="textfield"
                            onBlur={ this.upload }
                            onChange = { this.save } 
                        />
                        <form method="POST" encType="multipart/form-data">
                            <input className="hidden" type="file" id={`upload_` + key } name="certificate" onChange={ this.showLoader } ></input>
                            <div className="main-certificate">
                                {certURL?<span className="download-cert">Download <a href={certURL}>{ name }</a> certificate</span>:null}
                                {uploadingCert?<div className="loader"><Loader /></div>:null}
                                <div className="textfield uploadCert" id={`pre-upload_` + key } alt="" title="click to upload certificate" onClick={ this.clickUploadCert }>
                                { "Upload " + name + " license copy." }
                                </div>
                            </div>
                        </form>
                        <Textfield 
                            id={ key + "-expiryDate"}
                            label="Expiry Date"
                            value={ expiryDate }
                            subCategory={"licenses"}  
                            type="date" 
                            placeholder={ expiryDate }
                            root="inner-textfield" 
                            fieldClass="textfield"
                            onBlur={ this.upload }
                            onChange = { this.save } 
                        />
                    </div>
                </div>
            )
        }
        else
            return null;
        
    }

    render(){
        let { licenses }= this.props,
        other = licenses?licenses.other:{};

        return(
            <div className="main-content">
                <div className="half left">
                    <div className="heading">License Details<div className="bottom-border"></div></div>
                    <div className="information">
                        {Object.keys(licenses).map(this.renderLicenses)}
                    </div>
                </div>
                <div className="clear"></div>
            </div>
        )
    }
}

LicenseTab.defaultProps = {
    userInfo: {}
}

LicenseTab.propTypes = {
    userInfo: PropTypes.object.isRequired,
    currentHorizontalTab: PropTypes.string,
    licenses: PropTypes.object
}

export default LicenseTab;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textfield, ChckBox, Loader, DropDown } from 'components';
import axios from 'axios';
import * as firebase from 'firebase/app';
import 'extras/config';
import 'firebase/storage';
import 'firebase/database';
import './insuranceTab.css'
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
        insurance: store.user.info.profileInfo.insurance,
        currentHorizontalTab: store.genInfo.info.sideBar.currenthorizontalTab,
    }
})
class InsuranceTab extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props= {...nextProps};
    }

    componentWillMount(){
        let emailAddress = (JSON.parse(sessionStorage.getItem('profileInfo'))).emailAddress,
        userInfoURL = baseURL + userEndPoint + "?emailAddress=" + emailAddress,
        insurance = (JSON.parse(sessionStorage.getItem('profileInfo'))).insurance;
        axios.get(userInfoURL).then(res=>{
            if(res){
                let newInsurance = res.data[0].insurance,
                userInfo = {...this.props.user};
                userInfo.profileInfo.insurance = newInsurance;
                if(JSON.stringify(insurance) !== JSON.stringify(newInsurance)){
                    this.props.dispatch(dispatchedUserInfo(newInsurance));
                }
            }     
        }).
        catch(err=>{
            console.log(err)
        });
    }

    upload=()=>{
        let sectTitle = "insurance";
        let updateData = {...this.props.insurance};
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
            });
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
            userInfo.profileInfo.insurance[key][name] = value;
            this.props.dispatch(dispatchedUserInfo(userInfo));
            if(userInfo)                     
                resolve(userInfo);
            else
                reject({message: "No data"});
        });
    };

    toggleDisplay = (e)=>{
        let userInfo = {...this.props.user};
        let insurance = userInfo.profileInfo.insurance;
        let insurancePolicy = e.target.id;
        if(insurance[insurancePolicy].className === "hidden"){
            userInfo.profileInfo.insurance[insurancePolicy].className = "";
            userInfo.profileInfo.insurance[insurancePolicy].checked = true;
        }   
        else{
            userInfo.profileInfo.insurance[insurancePolicy].className = "hidden"
            userInfo.profileInfo.insurance[insurancePolicy].checked = false;
        }
        this.props.dispatch(dispatchedUserInfo(userInfo));
        this.upload();
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
            user.profileInfo.insurance[tag].uploadingCert = res.loading;              
            this.props.dispatch(dispatchedUserInfo(user));
            setTimeout(this.forceUpdate(), 50);
        }).
        catch(err=>{
            console.log(err);
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
                user.profileInfo.insurance[tag].uploadingCert = true;              
                this.props.dispatch(dispatchedUserInfo(user));
                newCertRef.put(file).then(()=>{
                    newCertRef.getDownloadURL().then((url)=>{
                        if(url){
                            user.profileInfo.insurance[tag].certURL = url;
                            this.props.dispatch(dispatchedUserInfo(user));
                            let insurance = {...user.profileInfo.insurance};
                            this.upload(insurance).then(res=>{
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
                    user.profileInfo.insurance.feedback = avatarProps.feedback;              
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

    renderInsurance = (key)=>{
        let { insurance, userInfo }= this.props,
        className = insurance[key].className,
        uploadingCert = userInfo.insurance[key].uploadingCert,
        policyNumber = insurance[key].policyNumber,
        expiryDate = insurance[key].expiryDate,
        name = insurance[key].name,
        certURL = insurance[key].certURL,
        value = insurance[key].checked,
        date = new Date(),
        month = parseInt(date.getMonth()),
        year = parseInt(date.getFullYear()),
        storedDateArr = expiryDate.split("-"),
        storedYear = parseInt(storedDateArr[0]),
        storedMonth = parseInt(storedDateArr[1]),
        percentage = value && policyNumber && expiryDate && certURL? "100%": value && policyNumber || certURL? "75%": "25%",
        completion = value && policyNumber && expiryDate && certURL?
        "complete":
        !value?"empty":
        "incomplete",
        colorCode;
        //determining validity of insurance
        if(storedYear > year){
            colorCode = "valid";
        }else if(storedYear === year){
            if(storedMonth >= month){
                colorCode = "almost";
            }else{
                colorCode = "invalid"
            }
        }else{
            colorCode = "invalid"
        }  
        if(key !== "other"){
            return(
                <div key={ key } className={ " insurance"}>
                    <div className = { completion }>
                        <ChckBox handleChange={ this.toggleDisplay } dispatcher = { dispatchedUserInfo } value={ value } id={ key } />
                        <span>{name} <span className="completion">{value?percentage + " completed":null}</span></span>
                    </div>
                    <div className={ className }>
                        <Textfield 
                            id={ key + "-policyNumber" }
                            label="Policy Number"
                            value={ policyNumber }
                            subCategory={"insurance"} 
                            type="text" 
                            placeholder="Policy Number" 
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
                                <div className="textfield uploadCert" id={`pre-upload_` + key } alt="" title="click to change Avatar" onClick={ this.clickUploadCert }>
                                { "Upload " + name + " certificate." }
                                </div>
                            </div>
                        </form>
                        <Textfield 
                            id={ key + "-expiryDate"}
                            label="Expiry Date"
                            value={ expiryDate }
                            color={colorCode}
                            subCategory={"insurance"}  
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
        let { insurance }= this.props,
        other = insurance?insurance.other:{},
        percentage = other.checked && other.policyNumber && other.expiryDate && other.certURL? "100%": other.checked && other.policyNumber || other.certURL? "75%": "25%",
        completion = other.checked && other.policyNumber && other.expiryDate && other.certURL?
        "complete":
        !other.checked?
        "empty":
        "incomplete",
        date = new Date(),
        month = parseInt(date.getMonth()),
        year = parseInt(date.getFullYear()),
        storedDateArr = other.expiryDate.split("-"),
        storedYear = parseInt(storedDateArr[0]),
        storedMonth = parseInt(storedDateArr[1]),
        colorCode;
        if(storedYear > year){
            colorCode = "valid";
        }else if(storedYear === year){
            if(storedMonth >= month){
                colorCode = "almost";
            }else{
                colorCode = "invalid"
            }
        }else{
            colorCode = "invalid"
        }

        return(
            <div className="main-content">
                <div className="half left">
                    <div className="heading">Insurance Policies<div className="bottom-border"></div></div>
                    <div className="el">
                        {Object.keys(insurance).map(this.renderInsurance)}
                    </div>
                </div>
                <div className="half left">
                    <div className="heading">Specify Other insurance Policy if any<div className="bottom-border"></div></div>
                        <div className="el">
                            <div className="information">
                                <div className={ " insurance"}>
                                    <div className = { completion }>
                                        <ChckBox handleChange={ this.toggleDisplay } dispatcher = { dispatchedUserInfo } value={ other.checked } id="other" />
                                        <span>{other.name} <span className="completion">{ other.checked?percentage + " completed":null}</span></span>
                                    </div>
                                    <div className={ other.className }>
                                        <Textfield 
                                            id="other-policyNumber"
                                            label="Policy Number"
                                            value={ other.policyNumber } 
                                            type="text" 
                                            placeholder="Policy Number" 
                                            root="inner-textfield" 
                                            fieldClass="textfield"
                                            onBlur={ this.upload }
                                            onChange = { this.save } 
                                        />
                                        <form method="POST" encType="multipart/form-data">
                                            <input className="hidden" type="file" id="upload_other" name="certificate" onChange={ this.showLoader } ></input>
                                            <div className="main-certificate">
                                                {other.certURL?<span className="download-cert">Download <a href={other.certURL}>{ other.name }</a> certificate</span>:null}
                                                {other.uploadingCert?<div className="loader"><Loader /></div>:null}
                                                <div className="textfield uploadCert" id="pre-upload_other" alt="" title="click to change Avatar" onClick={ this.clickUploadCert }>
                                                { "Upload " + other.name + " certificate." }
                                                </div>
                                            </div>
                                        </form>
                                        <Textfield 
                                            id="other-expiryDate"
                                            label="Expiry Date"
                                            color={colorCode}
                                            value={ other.expiryDate } 
                                            type="date" 
                                            placeholder={ other.expiryDate }
                                            root="inner-textfield" 
                                            fieldClass="textfield"
                                            onBlur={ this.upload }
                                            onChange = { this.save } 
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

InsuranceTab.defaultProps = {
    userInfo: {}
}

InsuranceTab.propTypes = {
    userInfo: PropTypes.object.isRequired,
    currentHorizontalTab: PropTypes.string,
    insurance: PropTypes.object
}

export default InsuranceTab;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textfield, ChckBox, Loader } from 'components';
import axios from 'axios';
import * as firebase from 'firebase/app';
import 'extras/config';
import 'firebase/storage';
import 'firebase/database';
import { dispatchedSubContractorsInfo } from 'extras/dispatchers';

const baseURL = process.env.BACK_END_URL,
storage = firebase.storage(),
storageRef = storage.ref(),
userUpdateEndPoint = process.env.SUB_CONTRACTORS_UPDATE_END_POINT;

@connect(store=>{
    return {
        origUser: store.user.info,
        user: store.subContractors.info,
        subContractorsInfo: store.subContractors.info,
        currSub: store.subContractors.info.currentSub,
        licenses: store.subContractors.info.currentSub.licenses
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
            let userId = this.props.currSub.id,
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
            origUser = {...this.props.origUser},
            id = e.target.id,
            origName = id;
            let nameArr = origName.split("-"),
            key = nameArr[0],
            name = nameArr[1],
            value = e.target.value;
            value = value?value:e.target.getAttribute('value');
            userInfo.currentSub.licenses[key][name] = value;
            this.props.dispatch(dispatchedSubContractorsInfo(userInfo));
            if(userInfo)                     
                resolve(origUser);
            else
                reject({message: "No data"});
        });
    };

    toggleDisplay = (e)=>{
        let userInfo = {...this.props.user};
        let licenses = userInfo.currentSub.licenses;
        let insurancePolicy = e.target.id;
        if(licenses[insurancePolicy].className === "hidden"){
            userInfo.currentSub.licenses[insurancePolicy].className = "";
            userInfo.currentSub.licenses[insurancePolicy].checked = true;
        }   
        else{
            userInfo.currentSub.licenses[insurancePolicy].className = "hidden"
            userInfo.currentSub.licenses[insurancePolicy].checked = false;
        } 
        this.props.dispatch(dispatchedSubContractorsInfo(userInfo));
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
            user.currentSub.licenses[tag].uploadingCert = res.loading;              
            this.props.dispatch(dispatchedSubContractorsInfo(user));
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
            minorUserId = user.currentSub.id,
            tagArr = id.split('_'),
            tag = tagArr[1],
            file = e.target.files[0],
            fname = file.name,
            fnameArr = fname.split('.'),
            fnameExt = fnameArr.pop();
            if(fnameExt === "pdf"){
                let newCertRef = storageRef.child(`${ userId }/${ minorUserId }/${ tag }.${ fnameExt }`);
                newCertRef.put(file).then(()=>{
                    user.currentSub.licenses[tag].uploadingCert = true;              
                    this.props.dispatch(dispatchedSubContractorsInfo(user));
                    newCertRef.getDownloadURL().then((url)=>{
                        if(url){
                            user.currentSub.licenses[tag].certURL = url;
                            this.props.dispatch(dispatchedSubContractorsInfo(user));
                            let licenses = {...user.currentSub.licenses};
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
                    user.currentSub.licenses.feedback = avatarProps.feedback;              
                    this.props.dispatch(dispatchedSubContractorsInfo(user));
                    reject({message: "There was an error", loading: false});
                });
            }else{
                let avatarProps = {
                    feedback: `only PDFs are allowed!`,
                };
                user.currentSub.insurancefeedback = avatarProps.feedback;
                this.props.dispatch(dispatchedSubContractorsInfo(user));
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
        let { licenses, currSub }= this.props,
        userInfo = currSub,
        className = licenses[key].className,
        uploadingCert = userInfo.licenses[key].uploadingCert,
        licenseType = licenses[key].type,
        licenseNumber = licenses[key].licenseNumber,
        expiryDate = licenses[key].expiryDate,
        name = licenses[key].name,
        certURL = licenses[key].certURL,
        value = licenses[key].checked,
        date = new Date(),
        month = parseInt(date.getMonth()),
        year = parseInt(date.getFullYear()),
        storedDateArr = expiryDate.split("-"),
        storedYear = parseInt(storedDateArr[0]),
        storedMonth = parseInt(storedDateArr[1]),
        completion = value && licenseNumber && expiryDate && certURL && licenseType?
        "complete":
        !value?"empty":
        "incomplete",
        percentage = value && licenseNumber && expiryDate && certURL && licenseType? "100%":
        value && (licenseNumber && certURL) || (licenseNumber && licenseType) || (licenseType && certURL)?
        "75%":
        value && licenseNumber || certURL || licenseType?
        "50%":
        "25%",
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

        if(key !== "other"){
            return(
                <div key={ key } className={ " insurance"}>
                    <div className = { completion }>
                        <ChckBox handleChange={ this.toggleDisplay } dispatcher = { dispatchedSubContractorsInfo } value={ value } id={ key } />
                        <span>{name} <span className="completion">{value?percentage + " completed":null}</span></span>
                    </div>
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
                            upload={ this.upload }
                            save = { this.save } 
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
                            upload={ this.upload }
                            save = { this.save } 
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
                            color = { colorCode }  
                            type="date" 
                            placeholder={ expiryDate }
                            root="inner-textfield" 
                            fieldClass="textfield"
                            upload={ this.upload }
                            save = { this.save }
                        />
                    </div>
                </div>
            )
        }
        else
            return null;
        
    }

    render(){
        let { licenses }= this.props;

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
    licenses: PropTypes.object
}

export default LicenseTab;
import React from 'react';
import { connect } from 'react-redux';
import Rebase from 're-base';
import PropTypes from 'prop-types';
import * as firebase from 'firebase/app';
import 'extras/config';
import 'firebase/storage';
import 'firebase/database';
import { dispatchedUserInfo } from 'extras/dispatchers';
import './profileImage.css';

const base = Rebase.createClass(firebase.database()),
storage = firebase.storage(),
storageRef = storage.ref();

@connect((store)=>{
    return {
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info
    }
})
class ProfileImage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            avatarURL: this.props.userInfo.avatarProps.avatarURL,
            levelId: ""
        }
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }
    
    componentWillMount(){ 
        this.getAvatar();
    }

    changeAvatar = (url)=>{
        this.setState({
            avatarURL: url,
            feedback: "",
            levelId: ""
        })
    }

    getAvatar = ()=>{
        let userInfo = this.props.userInfo,
        loginSession = JSON.parse(sessionStorage.getItem('loginSession')),
        userId = (JSON.parse(sessionStorage.getItem('loginSession'))).userId;
        return new Promise((resolve, reject)=>{
            base.fetch(`users/${ userId }`, {
                context: this,
                asArray: true,
                then(data){
                    let len = data.length;
                    if( len !== 0){
                        /**Deal with avatar */
                        let fl = data[0][0];
                        let avURL = data[0];
                        //easiest way I could figure out to check for an upload avatar url
                        if(fl === "h"){
                            userInfo.avatarProps.avatarURL = avURL;
                            loginSession.avatarURL = avURL
                            sessionStorage.setItem("loginSession", JSON.stringify(loginSession));
                            this.changeAvatar(avURL);
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                        }else{
                            storageRef.child('general/avatar.png').getDownloadURL().then((data)=>{
                                loginSession.avatarURL = data
                                sessionStorage.setItem("loginSession", JSON.stringify(loginSession));
                                userInfo.avatarProps.avatarURL = data;
                                this.changeAvatar(data);
                                this.props.dispatch(dispatchedUserInfo(userInfo));
                            });
                        }
                    }else{
                        storageRef.child('general/avatar.png').getDownloadURL().then((data)=>{
                            loginSession.avatarURL = data
                            sessionStorage.setItem("loginSession", JSON.stringify(loginSession));
                            userInfo.avatarProps.avatarURL = data;
                            this.changeAvatar(data);
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                        }); 
                    } 
                }
            });
            resolve("Image fetched and stored");
        });
    }
    uploadAv = (e)=>{
        let userId = (JSON.parse(sessionStorage.getItem('loginSession'))).userId,
        userInfo ={...this.props.userInfo},
        file = e.target.files[0],
        fname = file.name,
        fnameArr = fname.split('.'),
        fnameExt = fnameArr.pop();
        if(fnameExt === "jpg" || fnameExt === "png" || fnameExt === "jpeg" || fnameExt === "gif"){
            let newAvRef = storageRef.child(`${ userId }/avatar.${ fnameExt }`);
            newAvRef.put(file).then(()=>{
                storageRef.child(`${ userId }/avatar.${fnameExt}`).getDownloadURL().then((url)=>{
                    base.post(`users/${ userId }`, { data: {avatarURL: url}}).then((err)=>{
                        if(err){
                            userInfo.feedback = "Something went wrong";
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                        }else{
                            this.setState({
                                feedback: "Upload Complete",
                                levelId: "level",
                            });
                            let avatarProps = {
                                avatar: url,
                                picState: "roundPic",
                                feedback: "Upload Complete",
                                levelId: "level",
                                ext: fnameExt,
                                uploaded: true
                            };
                            userInfo.avatarProps = avatarProps;
                            this.props.dispatch(dispatchedUserInfo(userInfo));
                            setTimeout(()=>{
                                this.getAvatar();
                            }, 3000);
                        }
                    });
                });
            }, ()=>{
                let avatarProps = {
                    feedback: 'There was an error!, try again.',
                    levelId: "level"
                };
                userInfo.avatarProps.feedback = avatarProps.feedback;
                userInfo.avatarProps.levelId = avatarProps.levelId;
                this.props.dispatch(dispatchedUserInfo(userInfo));
            });
        }else{
            let avatarProps = {
                feedback: `The file extention ${ fnameExt } is not allowed!`,
                levelId: "level"
            };
            userInfo.avatarProps.feedback = avatarProps.feedback;
            userInfo.avatarProps.levelId = avatarProps.levelId;
            this.props.dispatch(dispatchedUserInfo(userInfo));
        }
    }

    clickUploadAv = ()=>{
        let uploadB = document.getElementById('hs');
        uploadB.click();
    }

    render(){
        let avatarProps = this.props.userInfo.avatarProps;
        return (
            <div className="avContainer">
                <span id={ this.state.levelId }>{ this.state.feedback }</span>
                <div className="avator">
                    <form method="POST" encType="multipart/form-data">
                        <input className="hidden" type="file" id="hs" name="avator" onChange={ this.uploadAv } ></input>
                        <div className={ avatarProps.picState }>
                            <img id="avator" alt="" title="click to change Avatar" src = { this.state.avatarURL } onClick={ this.clickUploadAv }/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

ProfileImage.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ProfileImage.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ProfileImage;
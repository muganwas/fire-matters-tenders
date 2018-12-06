import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import crypto from 'crypto';
import './confirmCompanyUser.css';

import  { Footer, HeaderMain, YelloDash } from 'components';

const baseURL = process.env.BACK_END_URL,
sendEmailEndPoint = process.env.SEND_EMAIL_END_POINT,
userEndPoint = process.env.USERS_END_POINT,
userUpdateEndPoint = process.env.USER_UPDATE_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ConfirmCompanyUser extends React.Component {
    constructor(props){
        super(props);
        this.state = { feedbackClass: "hidden" };
    }

    componentWillMount(nextProps){

        this.props = {...nextProps};
        let queries = window.location.search,
        queryArr = queries.split("=");
        let userEmail = queryArr[2],
        companyId = ((queryArr[1]).split("&"))[0],
        getUserURL = baseURL + userEndPoint + "?userId=" + companyId,
        userId = userEmail,
        userPass = this._random(8);

        axios.get(getUserURL).then(res=>{
            if(res){
                let userInfo = res.data[0],
                companyUsers = userInfo.companyUsers || {},
                companyName = userInfo.companyName,
                postURL = baseURL + userUpdateEndPoint;
                if(!companyUsers[userId]){
                    companyUsers[userId]= { emailAddress: userEmail, userPassword: userPass};

                    axios.post(postURL, { userId: companyId, sectTitle: "companyUsers", updateData: companyUsers }).
                    then(res=>{
                        if(res){
                            let sendEmailURL = baseURL + sendEmailEndPoint,
                            sender = "info@fire-matters.com.au",
                            recipient = userEmail,
                            subject = "FIRE-MATTERS TENDERS ACCOUNT SUCCESSFULLY CREATED",
                            body = "<p>Your account has been successfully created under " 
                            + companyName 
                            + "<br/> Username: " 
                            + userId 
                            + "<br/>Password: " 
                            + userPass 
                            + " </p>";

                            axios.post(sendEmailURL, { sender, recipient, subject, body }).then(res=>{
                                console.log(res.data.message)
                                if(res.data.message){
                                    this.setState({
                                        feedback: "Your account was successfully created, login into " + userEmail + " for more information",
                                        feebackClass: "pos"
                                    });
                                }
                            });
                        }
                    }).
                    catch(err=>{
                        console.log(err)
                    })
                }else{
                    this.setState({
                        feedback: "User already Exists",
                        feedbackClass: "neg"
                    });
                }  
            }
        }).
        catch(err=>{
            console.log(err);
        });
    }

    _random = (howMany) =>{
        var chars = "ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        var rnd = crypto.randomBytes(howMany)
            , value = new Array(howMany)
            , len = Math.min(256, chars.length)
            , d = 256 / len
    
        for (var i = 0; i < howMany; i++) {
            value[i] = chars[Math.floor(rnd[i] / d)]
        };
    
        return value.join('');
    }

    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                    <YelloDash header = "Company User Confirmation" sub = "" />
                    {/**since the yellodash is absolutely positioned space needs to be created */}
                    <span className="absolute-150"/>
                </div>
                <div className="mid contact side-margin-90">
                    <div id="feedback" className = {this.state.feedbackClass}> { this.state.feedback } </div>
                </div>
                <div className="bottom-alt-alt">
                    <Footer />
                </div>
            </div>
        )
    }
}

export default ConfirmCompanyUser;
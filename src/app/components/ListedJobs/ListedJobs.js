import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz } from 'components';
import { MessageForm } from 'forms';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedMessagesInfo } from 'extras/dispatchers';
import './listedJobs.css';
import { PropTypes } from 'prop-types';
import { styles, submit_styles } from './styles';

const baseURL = process.env.BACK_END_URL,
messagesEndPoint = process.env.MESSAGES_END_POINT,
listingsEndPoint = process.env.LISTING_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        search: store.search,
        messageData: store.user.info.submitMessage,
        profileInfo: store.user.info.profileInfo,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
        messagesInfo: store.messages.info
    }
})
class ListedJobs extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
        //if(!this.props.genInfo.info.listings)
            //this.fetchListings();
    }

    componentDidMount(){
        this.fetchListings();
    }

    checkForErrors=()=>{
        let errored = [];
        return new Promise((resolve, reject)=>{
            let messageData = {...this.props.messageData},
            messagesInfo = {...this.props.messagesInfo};
            Object.keys(messageData).map(key=>{
                if(!messageData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    messagesInfo.messageForm.errors[key] = true;
                    errored.push(messagesInfo.messageForm.errors[key]);
                }else if(messageData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    messagesInfo.messageForm.errors[key] = null;
                }
            });
            this.props.dispatch(dispatchedMessagesInfo(messagesInfo));
            let errCount = errored.length;
            resolve(errCount);
        }); 
    }

    sendMessage=()=>{
        let messageData = {...this.props.messageData},
        messagesInfo = {...this.props.messagesInfo },
        userInfo = {...this.props.user},
        userEmail = this.props.profileInfo.emailAddress,
        recipientEmail = messagesInfo.currMessagRecipient,
        listingId = messagesInfo.currListingId,
        message = messageData.messageBody,
        postInfoUrl = baseURL + messagesEndPoint;

        let postObject = {
            userEmail,
            recipientEmail,
            listingId,
            message
        };
        this.checkForErrors().then(res=>{
            console.log(res)
            if(res === 0){
                userInfo.submitMessage.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.submitMessage.submitButton.isActive = true;
                    userInfo.submitMessage.feedback = "Your message was posted successfully.";
                    userInfo.submitMessage.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(res);
                }).
                catch(err=>{
                    userInfo.submitMessage.submitButton.isActive = true;
                    userInfo.submitMessage.feedbackClass="error-feedback";
                    userInfo.submitMessage.feedback = "Something went wrong, try again later.";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(err);
                });
            }
        });
    };

    fetchListings = ()=>{
        let genInfo = {...this.props.genInfo };
        axios.get(baseURL + listingsEndPoint).then((response)=>{
            //console.log(response.data);
            let listings = genInfo.generalListings = {...response.data};
            /**Set the more dropdown menu class to hidden for every row*/
            Object.keys(listings).map((key)=>{
                genInfo.generalListings[key].moreMenuClassName = "hidden";
            })
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }).catch(err=>{
            console.log(err);
        });
    }

    renderMessageForm = (e)=>{
        let listingId = e.target.getAttribute('autoid'),
        messagesInfo = {...this.props.messagesInfo},
        recipient = e.target.getAttribute('email');
        messagesInfo.currListingId = listingId;
        messagesInfo.currMessagRecipient = recipient;
        messagesInfo.messageForm.show = !messagesInfo.messageForm.show;
        this.props.dispatch(dispatchedMessagesInfo(messagesInfo));               
    }

    displayListings = (key)=>{
        let listings = this.props.genInfo.generalListings,
        profileInfo = sessionStorage.getItem('profileInfo'),
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null,
        options;
        if(userType && userType !== "Owner/Occupier"){
            options = { 0: "View More...", sendMessage: "Send Message"};
        }else{
            options = { 0: "View More..."};
        }
        return(
            <div className="list-row" key={key} id={ listings[key].id }>
                <div className="twenty">{ listings[key].city }, { listings[key].state }</div>
                <div className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</div>
                <div className="twenty">{ listings[key].startDate}</div>
                <div className="twenty"><FmButton variant="contained" styles = { styles } text="Submit Tender" /></div>
                <div className="ten">
                    <MoreHoriz 
                        className={ listings[key].moreMenuClassName } 
                        id={ key }
                        autoid = { listings[key].id }
                        email = { listings[key].userEmail }
                        onClick = { this.renderMessageForm }
                        listName = "generalListings" 
                        element={ listings[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    save=(e)=>{
        e.persist();
        return new Promise((resolve, reject)=>{
            let userInfo = {...this.props.user},
            id = e.target.id,
            type = e.target.getAttribute('type'),
            origName = e.target.getAttribute("category");
            console.log(type)
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.getAttribute('value');
            value = value?value:e.target.value;
            userInfo.submitMessage[name] = value;
            userInfo.submitMessage[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };

    render(){
        let listings = this.props.genInfo.generalListings,
        messagesInfo = {...this.props.messagesInfo},
        showMessageForm = messagesInfo.messageForm.show,
        messageAttributes = this.props.user.submitMessage,
        errors = messagesInfo.messageForm.errors,
        feedback = messageAttributes.feedback,
        feedbackClass = messageAttributes.feedbackClass;
        return(
            <div className="list left hanad">
                {
                    showMessageForm
                    ?<MessageForm
                        feedback = { feedback }
                        feedbackClass = { feedbackClass }
                        errors = { errors }
                        styles = { submit_styles }
                        attributes = { messageAttributes } 
                        close={ this.renderMessageForm } 
                        onBlur={ this.dummy } 
                        upload={ this.sendMessage } 
                        save={ this.save } 
                    />
                    :null
                }
                <div className="list-row header">
                    <span className="twenty">Location</span>
                    <span className="thirty">Description</span>
                    <span className="twenty">Closing Date</span>
                    <span className="twenty"></span>
                    <span className="ten"></span>
                    <div className="bottom-border"></div>
                </div>
                { listings?Object.keys(listings).map(this.displayListings):<div className="loader"><Loader /></div> }
            </div>
        )
    }
}

ListedJobs.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ListedJobs.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ListedJobs;
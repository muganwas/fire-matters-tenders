import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, MoreHoriz } from 'components';
import axios from 'axios';
import { dispatchedListingsInfo, dispatchedMessagesInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './listedPostedMessages.css';
import { PropTypes } from 'prop-types';

const baseURL = process.env.BACK_END_URL,
tenderEndPoint = process.env.TENDERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        profileInfo: store.user.info.profileInfo,
        messagesData: store.user.info.submitMessage,
        messagesInfo: store.messages.info
    }
})
class ListedPostedMessages extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    postListingId = (id)=>{
        return new Promise(resolve=>{
            let userInfo = {...this.props.user.info};
            userInfo.submitTender.tenderListingId = id;
            this.props.dispatch(dispatchedUserInfo(userInfo));
            resolve('id posted');
        });
    }

    renderTenderForm = (e)=>{
        let id = e.target.id;
        let name = e.target.getAttribute('name');
        id = !id?name:id;
        let listingsInfo = {...this.props.listingsInfo};
        listingsInfo.tenderForm.show = !listingsInfo.tenderForm.show;
        this.postListingId(id).then(res=>{
            if(res === "id posted")
                this.props.dispatch(dispatchedListingsInfo(listingsInfo));
            else
                console.log('There was a troblem posting listing id');
        })  
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

    deleteMessage = (e)=>{

    }

    dummy= ()=>{
        return Promise.resolve("Nassing");
    }

    checkForErrors(){
        let errored = [];
        return new Promise(resolve=>{
            let listingsData = {...this.props.listingsData},
            listingsInfo = {...this.props.listingsInfo};
            Object.keys(listingsData).map(key=>{
                if(!listingsData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    listingsInfo.tenderForm.errors[key] = true;
                    errored.push(listingsInfo.tenderForm.errors[key]);
                }else if(listingsData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    listingsInfo.tenderForm.errors[key] = null;
                }
            });
            this.props.dispatch(dispatchedListingsInfo(listingsInfo));
            let errCount = errored.length;
            resolve(errCount);
        }); 
    }

    upload=()=>{
        let listingsData = {...this.props.listingsData},
        userInfo = {...this.props.user.info},
        companyName = listingsData.tenderCompanyName,
        rate = listingsData.tenderRate,
        startDate = listingsData.tenderStartDate,
        endDate = listingsData.tenderEndDate,
        coverLetter = listingsData.tenderCoverLetter,
        listingId = listingsData.tenderListingId,
        postInfoUrl = baseURL + tenderEndPoint;

        let postObject = {
            listingId,
            companyName, 
            rate, 
            coverLetter, 
            startDate, 
            endDate
        };
        this.checkForErrors().then(res=>{
            if(res === 0){
                userInfo.submitTender.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.submitTender.submitButton.isActive = true;
                    userInfo.submitTender.feedback = "You successfully posted your tender.";
                    userInfo.submitTender.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                }).
                catch(err=>{
                    userInfo.submitTender.submitButton.isActive = true;
                    userInfo.submitTender.feedbackClass="error-feedback";
                    userInfo.submitTender.feedback = "Something went wrong, try again later.";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(err);
                });
            }
        });
    };

    save=(e)=>{
        e.persist();
        return new Promise((resolve, reject)=>{
            let userInfo = {...this.props.user.info},
            id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.getAttribute('value');
            value = value?value:e.target.value;
            userInfo.submitSite[name] = value;
            userInfo.submitSite[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };

    displayRecievedMessages = (key)=>{
        let recievedMessages = {...this.props.messagesInfo.recievedMessages},
        listingId = recievedMessages[key].listingId,
        sender = recievedMessages[key].sender,
        options = {delete: "Delete", sendMessage: "Reply"};
        return(
            <div className="list-row" key={key}>
                <div className="thirty">{ recievedMessages[key].sender }</div>
                <div className="thirty">{ recievedMessages[key].createdDate }</div>
                <div className="thirty">{ recievedMessages[key].message }</div>
                <div className="ten">
                    <MoreHoriz 
                        className={ recievedMessages[key].moreMenuClassName } 
                        id={ key } 
                        listName = "recievedMessages"
                        autoid = { listingId }
                        email = { sender }
                        onClick = { this.renderMessageForm }
                        onClickAlt = { this.deleteMessage }
                        element={ recievedMessages[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    displaySentMessages = (key)=>{
        let sentMessages = {...this.props.messagesInfo.sentMessages},
        listingId = sentMessages[key].listingId,
        sender = sentMessages[key].sender,
        options = {delete: "Delete", sendMessage: "Send Message"};
        return(
            <div className="list-row" key={key}>
                <div className="thirty">{ sentMessages[key].recipient }</div>
                <div className="thirty">{ sentMessages[key].createdDate }</div>
                <div className="thirty">{ sentMessages[key].message }</div>
                <div className="ten">
                    <MoreHoriz 
                        className={ sentMessages[key].moreMenuClassName } 
                        id={ key }
                        autoid = { listingId }
                        sender = { sender }
                        onClick = { this.renderMessageForm }
                        onClickAlt = { this.deleteMessage }
                        listName = "sentMessages" 
                        element={ sentMessages[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let recievedMessages = {...this.props.messagesInfo.recievedMessages},
        recievedCount = Object.keys(recievedMessages).length,
        sentMessages = {...this.props.messagesInfo.sentMessages},
        sentCount = Object.keys(sentMessages).length;
        return(
            <div className="messages">
                <div className="list left hanad">
                <h3>Recieved Messages</h3>
                    <div className="list-row header">
                        <span className="thirty">Sender</span>
                        <span className="thirty">Date Sent</span>
                        <span className="thirty">Message</span>
                        <span className="ten"></span>
                        <div className="bottom-border"></div>
                    </div>
                    { recievedCount === 0?<span className="no-messages">No Messages to show</span>:null}
                    { recievedMessages?Object.keys(recievedMessages).map(this.displayRecievedMessages):<div className="loader"><Loader /></div> }
                </div>
                <div className="list left hanad">
                <h3>Sent Messages</h3>
                    <div className="list-row header">
                        <span className="thirty">Recipient</span>
                        <span className="thirty">Date Sent</span>
                        <span className="thirty">Message</span>
                        <span className="ten"></span>
                        <div className="bottom-border"></div>
                    </div>
                    { recievedCount === 0?<span className="no-messages">No Messages to show</span>:null}
                    { sentMessages?Object.keys(sentMessages).map(this.displaySentMessages):<div className="loader"><Loader /></div> }
                </div>

            </div>
        )
    }
}

ListedPostedMessages.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ListedPostedMessages.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ListedPostedMessages;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedMessagesInfo, dispatchedGenInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './messagesTab.css'
import { SearchInput, ListedPostedMessages } from 'components';
import { MessageForm } from 'forms';
import  { submit_styles } from './styles';


const baseURL = process.env.BACK_END_URL,
messagesEndPoint = process.env.MESSAGES_END_POINT,
sitesEndPoint = process.env.SITES_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        messageData: store.user.info.submitMessage,
        profileInfo: store.user.info.profileInfo,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
        messagesInfo: store.messages.info
    }
})
class MessagesTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
        this.fetchSentMessages().then(res=>{
            if(res)
                this.fetchRecievedMessages();
        });
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    searchMessages = ()=>{

    }

    fetchSentMessages = ()=>{
        return new Promise(resolve=>{
            let messagesInfo = {...this.props.messagesInfo },
            genInfo = { ...this.props.genInfo },
            userEmail = this.props.profileInfo.emailAddress,
            url = baseURL + messagesEndPoint + "?sender=" + userEmail;
            axios.get(url).then((response)=>{
                //console.log(response.data);
                let sentMessages = messagesInfo.sentMessages = genInfo.sentMessages = {...response.data};
                genInfo.sideBar.profilePage.listCount['sentMessages'] = (response.data).length;
                /**Set the more dropdown menu class to hidden for every row*/
                Object.keys(sentMessages).map((key)=>{
                    messagesInfo.sentMessages[key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedMessagesInfo(messagesInfo));
                this.props.dispatch(dispatchedGenInfo(genInfo));
                resolve("fetched");
            }).catch(err=>{
                console.log(err);
            });
        });    
    }

    fetchRecievedMessages = ()=>{
        return new Promise(resolve=>{
            let messagesInfo = {...this.props.messagesInfo },
            genInfo = { ...this.props.genInfo },
            userEmail = this.props.profileInfo.emailAddress,
            url = baseURL + messagesEndPoint + "?recipient=" + userEmail;
            axios.get(url).then((response)=>{
                //console.log(response.data);
                let recievedMessages = messagesInfo.recievedMessages = genInfo.recievedMessages = {...response.data};
                genInfo.sideBar.profilePage.listCount['recievedMessages'] = (response.data).length;
                /**Set the more dropdown menu class to hidden for every row*/
                Object.keys(recievedMessages).map((key)=>{
                    messagesInfo.recievedMessages[key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedMessagesInfo(messagesInfo));
                this.props.dispatch(dispatchedGenInfo(genInfo));
                resolve("fetched");
            }).catch(err=>{
                console.log(err);
            });
        });
    }

    renderListingForm = ()=>{
        let messagesInfo = {...this.props.messagesInfo};
        messagesInfo.messageForm.show = !messagesInfo.messageForm.show;
        this.props.dispatch(dispatchedMessagesInfo(messagesInfo));               
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

    upload=()=>{
        let messageData = {...this.props.messageData},
        messagesInfo = this.props.messagesInfo,
        userInfo = {...this.props.user},
        userEmail = JSON.parse(sessionStorage.getItem('profileInfo')).emailAddress,
        recipientEmail = messagesInfo.currMessagRecipient,
        listingId = messagesInfo.currListingId,
        message = messageData.messageBody,
        postInfoUrl = baseURL + messagesEndPoint,

        postObject = {
            userEmail,
            recipientEmail, 
            message, 
            listingId
        };

        this.checkForErrors().then(res=>{
            console.log(res)
            if(res === 0){
                userInfo.submitMessage.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.submitMessage.submitButton.isActive = true;
                    userInfo.submitMessage.feedback = "Your comment was posted successfully.";
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

    dummy= ()=>{
        return Promise.resolve("Nassing");
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
        const messagesInfo = this.props.messagesInfo,
        showMessageForm = messagesInfo.messageForm.show,
        messageAttributes = this.props.user.submitMessage,
        errors = messagesInfo.messageForm.errors,
        feedback = messageAttributes.feedback,
        feedbackClass = messageAttributes.feedbackClass;
        return(
            <div className="tenders main-content">
                {showMessageForm
                ?<MessageForm
                    feedback = { feedback }
                    feedbackClass = { feedbackClass }
                    errors = { errors }
                    styles = { submit_styles }
                    attributes = { messageAttributes } 
                    close={ this.renderListingForm } 
                    onBlur={ this.dummy } 
                    upload={ this.upload } 
                    save={ this.save } 
                />
                :null}
                <div className="title-bar">
                    <span id="title">Messages</span>
                    <span id="search">
                        { /*<FmButton variant="contained" onClick={ this.renderListingForm } styles={ styles } text="Send New Message" /> */ }
                        <SearchInput className="alt-search" placeholder="search your comments" search={ this.searchMessages } />
                    </span>
                </div>
                <ListedPostedMessages />
                <div className = "clear"></div>
            </div>
        )
    }
}

MessagesTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

MessagesTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default MessagesTab;
import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz } from 'components';
import { TenderForm, MessageForm } from 'forms';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedUserInfo, dispatchedListingsInfo, dispatchedMessagesInfo } from 'extras/dispatchers';
import ListedJobDetails from './ListedJobDetails';
import './listedJobs.css';
import { PropTypes } from 'prop-types';
import { styles, submit_styles } from './styles';

const baseURL = process.env.BACK_END_URL,
messagesEndPoint = process.env.MESSAGES_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT,
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
        listingsData: store.user.info.submitTender,
        messagesInfo: store.messages.info
    }
})
class ListedJobs extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    componentDidMount(){
        if(this.props.genInfo.generalListings === undefined)
            this.fetchListings();
    }

    componentWillMount(){
        this.fetchMessages();
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

    fetchMessages(){
        let URL = baseURL + messagesEndPoint,
        messagesInfo = {...this.props.messagesInfo};
        return new Promise(resolve=>{
            axios.get(URL).then(res=>{
                if(res){
                    messagesInfo.messages = res.data;
                    this.props.dispatch(dispatchedMessagesInfo(messagesInfo));
                    resolve(res)
                }
            });
        });
    }

    checkForListingErrors(){
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
        userInfo = {...this.props.user},
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
        this.checkForListingErrors().then(res=>{
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

    dummy= ()=>{
        return Promise.resolve("Nassing");
    }

    postListingId = (id)=>{
        return new Promise(resolve=>{
            let userInfo = {...this.props.user};
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

    renderListingDetails = (e)=>{
        let id = e.target.id,
        //console.log(id);
        listingsInfo = {...this.props.listingsInfo};
        listingsInfo.listedJobDetails.show = !listingsInfo.listedJobDetails.show;
        listingsInfo.listedJobDetails.currListingId = id;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));
    }

    displayListings = (key)=>{
        let listings = {...this.props.genInfo.generalListings},
        listingsInfo = {...this.props.listingsInfo},
        showJobDetails = listingsInfo.listedJobDetails.show,
        errors = listingsInfo.tenderForm.errors,
        tenderAttributes = this.props.user.submitTender,
        feedback = tenderAttributes.feedback,
        feedbackClass = tenderAttributes.feedbackClass,
        showTenderForm = listingsInfo.tenderForm.show,
        profileInfo = sessionStorage.getItem('profileInfo'),
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null,
        options;
        if(userType && userType !== "owner_occupier"){
            options = { more: "View More...", sendMessage: "Post Comment"};
        }else{
            options = { more: "View More..."};
        }
        return(
            <div className="list-row" key={key} id={ listings[key].id }>
                {   
                    showJobDetails?
                    <div styles = {submit_styles.trans} className="listedJobsDetails-container">
                        <span
                            className="close right" 
                            onClick={ this.renderListingDetails } 
                            id="close"
                        >
                            &#x2716;
                        </span>
                        <ListedJobDetails />
                    </div>
                    :null
                }
                {
                    showTenderForm
                    ?<TenderForm
                        feedback = { feedback }
                        feedbackClass = { feedbackClass }
                        errors = { errors }
                        styles = { submit_styles }
                        attributes = { tenderAttributes } 
                        close={ this.renderTenderForm } 
                        onBlur={ this.dummy } 
                        upload={ this.upload } 
                        save={ this.save } 
                    />:null
                }
                <div className="twenty">{ listings[key].city }, { listings[key].state }</div>
                <div className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</div>
                <div className="twenty">{ listings[key].startDate}</div>
                <div className="twenty">
                { 
                    userType !== "owner_occupier"
                    ?<FmButton
                        id = { listings[key].id }
                        onClick = { this.renderTenderForm }
                        variant="contained" 
                        styles = { styles } 
                        text="Submit Tender" 
                    />
                    :null
                }
                </div>
                <div className="ten">
                    <MoreHoriz 
                        className={ listings[key].moreMenuClassName } 
                        id={ key }
                        autoid = { listings[key].id }
                        email = { listings[key].userEmail }
                        onClick = { this.renderMessageForm }
                        onClickAlt = { this.renderListingDetails }
                        listName = "generalListings" 
                        element={ listings[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let listings = this.props.genInfo.generalListings,
        messagesInfo = {...this.props.messagesInfo},
        showMessageForm = messagesInfo.messageForm.show,
        messageAttributes = this.props.user.submitMessage,
        errors = messagesInfo.messageForm.errors,
        feedback = messageAttributes.feedback,
        filter = (this.props.listingsInfo).filter.categoryTitle,
        keyWords = (this.props.listingsInfo).filter.keyWords || " ",
        feedbackClass = messageAttributes.feedbackClass,
        filtered = {};
        if(listings){
            Object.keys(listings).map(key=>{
                keyWords = (keyWords).toLowerCase();
                let equipment = (listings[key].equipment).toLowerCase(),
                city = (listings[key].city).toLowerCase(),
                state = (listings[key].state).toLowerCase();
                if(listings[key].serviceRequired === filter 
                    && (equipment.includes(keyWords)
                        || city.includes(keyWords) 
                        || state.includes(keyWords) )){

                    filtered[key] = listings[key];
                }
            });
        }
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
                { 
                    filter
                    ?Object.keys(filtered).map(this.displayListings)
                    :listings
                    ?Object.keys(listings).map(this.displayListings)
                    :<div className="loader"><Loader /></div> 
                }
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
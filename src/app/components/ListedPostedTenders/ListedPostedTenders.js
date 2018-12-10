import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz, PostedTendersOverlay } from 'components';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedListingsInfo, dispatchedUserInfo, dispatchedTendersInfo, dispatchedMessagesInfo } from 'extras/dispatchers';
import './listedPostedTenders.css';
import { PropTypes } from 'prop-types';
import { TenderForm, MessageForm } from 'forms';
import { listedPostedTendersOptions, tenderOptions } from 'extras/config';
import { styles, submit_styles } from './styles';
import ListedPostedTenderDetails from './ListedPostedTenderDetails';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT,
messagesEndPoint = process.env.MESSAGES_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        profileInfo: store.user.info.profileInfo,
        listingsInfo: store.listingsInfo.info,
        listingsData: store.user.info.submitTender,
        tendersInfo: store.tenders.info,
        messageData: store.user.info.submitMessage,
        messagesInfo: store.messages.info
    }
})
class ListedPostedTenders extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
        if(!this.props.genInfo.info.listings)
            this.fetchListings();
    }

    componentWillMount(){
        if(!this.props.genInfo.info.listings)
            this.fetchListings();
    }

    componentDidMount(){
        this.forceUpdate();
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

    renderMessageForm = (e)=>{
        let messagesInfo = {...this.props.messagesInfo},
        listingId = e.target.getAttribute('autoid'),
        recipient = e.target.getAttribute('email');
        messagesInfo.currListingId = listingId;
        messagesInfo.currMessagRecipient = recipient;
        messagesInfo.messageForm.show = !messagesInfo.messageForm.show;
        this.props.dispatch(dispatchedMessagesInfo(messagesInfo));               
    }

    sendMessage=()=>{
        let messageData = {...this.props.messageData},
        messagesInfo = {...this.props.messagesInfo },
        userInfo = {...this.props.user.info},
        userEmail = this.props.profileInfo.emailAddress,
        recipientEmail = messagesInfo.currMessagRecipient,
        listingId = messagesInfo.currListingId,
        message = messageData.messageBody,
        postInfoUrl = baseURL + messagesEndPoint;

        let postObject = {
            listingId,
            userEmail,
            recipientEmail, 
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

    fetchTenders = ()=>{
        let postInfoUrl = baseURL + tenderEndPoint,
        genInfo = {...this.props.genInfo.info },
        userType = (this.props.profileInfo.userType).toLowerCase(),
        postedTendersComprehensive = [],
        postedTenders = [];
        if(userType){
            if(userType === "owner_occupier"){
                let listings = genInfo.listings;
                axios.get(postInfoUrl).then(res=>{
                    let tendersArr = res.data,
                    tendersLen = tendersArr.length;
                    for(let count = 0;count <tendersLen; count++){
                        let currObj = tendersArr[count],
                        listingId = currObj.listingId;
                        Object.keys(listings).map(key=>{
                            if(listingId === listings[key].id){
                                let cO = {tenderId:currObj.id, listingId: listingId};
                                postedTendersComprehensive.push(currObj);
                                postedTenders.push(cO);
                            }
                        });
                    }
                });
                let listingsInfo = {...this.props.listingsInfo},
                tendersInfo = {...this.props.tendersInfo};
                listingsInfo.postedTenders.tenders = postedTenders;
                tendersInfo.tenders = postedTendersComprehensive;
                this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                this.props.dispatch(dispatchedListingsInfo(listingsInfo));
                this.forceUpdate();
            }else{
                let tendererId = JSON.parse(sessionStorage.getItem('profileInfo')).id,
                getInfoUrl = baseURL + tenderEndPoint + "?tendererId=" + tendererId;
                axios.get(getInfoUrl).then(res=>{
                    if(res){
                        let genInfo = {...this.props.genInfo.info},
                        tendersInfo = {...this.props.tendersInfo};
                        tendersInfo.tenders = res.data;
                        Object.keys(tendersInfo.tenders).map((key)=>{
                            tendersInfo.tenders[key].moreMenuClassName = "hidden";
                        });
                        tendersInfo.tenders = res.data;
                        genInfo.sideBar.profilePage.listCount['tenders'] = (res.data).length
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                    }
                }); 
            }
        }
    }

    fetchListings = ()=>{
        return new Promise(resolve=>{
            let genInfo = {...this.props.genInfo.info },
            userType = (this.props.profileInfo.userType).toLowerCase(),
            userEmail = this.props.profileInfo.emailAddress;
            if(userType){
                if(userType !== "owner_occupier"){
                    axios.get(baseURL + listingsEndPoint).then((response)=>{
                        //console.log(response.data);
                        let listings = genInfo.listings = {...response.data};
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(listings).map((key)=>{
                            genInfo.listings[key].moreMenuClassName = "hidden";
                        });
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        resolve("fetched");
                    }).catch(err=>{
                        console.log(err);
                    });
                }else{
                    axios.get(baseURL + listingsEndPoint + "?userEmail=" + userEmail).then((response)=>{
                        //console.log(response.data);
                        let listings = genInfo.listings = {...response.data};
                        genInfo.sideBar.profilePage.listCount['tenders'] = (response.data).length;
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(listings).map((key)=>{
                            genInfo.listings[key].moreMenuClassName = "hidden";
                        })
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        resolve("fetched");
                    }).catch(err=>{
                        console.log(err);
                    });            
                }
            }
        });    
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

    dummy= ()=>{
        return Promise.resolve("Nassing");
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
            let userInfo = {...this.props.user.info},
            id = e.target.id,
            type = e.target.getAttribute('type'),
            origName = e.target.getAttribute("category");
            console.log(type)
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.getAttribute('value');
            value = value?value:e.target.value;
            userInfo.submitTender[name] = value;
            userInfo.submitTender[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };

    saveMessage=(e)=>{
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
            userInfo.submitMessage[name] = value;
            userInfo.submitMessage[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };

    displayTenders = (e)=>{
        let Id = e.target.id,
        autoId = e.target.getAttribute('autoId');
        let listingsInfo = {...this.props.listingsInfo},
        tenderId = autoId?autoId:Id,
        show = listingsInfo.postedTenders.overLay.show;
        listingsInfo.postedTenders.overLay.show = !show;
        listingsInfo.postedTenders.overLay.active = tenderId;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));
    }

    togglePostedTendersDisplay = (e)=>{
        let id = e.target.id,
        tendersInfo = {...this.props.tendersInfo };
        tendersInfo.selectedPostedTender.tenderInfo = tendersInfo.tenders[id];
        tendersInfo.selectedPostedTender.show = !tendersInfo.selectedPostedTender.show;
        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
        this.forceUpdate();
    }

    toggleMoreMenu = (id)=>{
        let listingsInfo = {...this.props.tendersInfo},
        tenders = {...listingsInfo.tenders},
        ddClass = tenders[id].moreMenuClassName;
        if(ddClass === "hidden")
            listingsInfo.tenders[id].moreMenuClassName = "dropDownMenu";
        else
            listingsInfo.tenders[id].moreMenuClassName = "hidden";  
        this.props.dispatch(dispatchedTendersInfo(listingsInfo));
    }

    renderTenders = (key)=>{
        let listingsInfo = {...this.props.tendersInfo},
        listings = {...listingsInfo.tenders},
        selectedTenderInfo = {...this.props.tendersInfo.selectedPostedTender},
        showTender = selectedTenderInfo.show,
        options = tenderOptions;
            
        return(
            <div className="list-row" key={key}>
                { 
                    showTender
                    ?<div className="subcontractors-container">
                            <span 
                                className="close right" 
                                onClick={ this.togglePostedTendersDisplay } 
                                id="close"
                            >
                                &#x2716;
                            </span>
                            <ListedPostedTenderDetails />
                        </div>
                    : null 
                }
                <div className="twenty">{ listings[key].companyName }</div>
                <div className="thirty">{ listings[key].coverLetter }</div>
                <div className="twenty">{ listings[key].startDate }</div>
                <div className="twenty">{ listings[key].rate }</div>
                <div className="ten">
                    {<MoreHoriz 
                        className={ listings[key].moreMenuClassName } 
                        id={ key }
                        toggle = { this.toggleMoreMenu }
                        onClickAlt = { this.togglePostedTendersDisplay }
                        autoid = { listings[key].id }
                        listName = "tenders"
                        element={ listings[key] }
                        options={ options }
                     />}
                </div>
                <div className="bottom-border"></div>
            </div>
        )

    }

    countTendersPerListing = (postedTenders, listingId, currListingTenderCount=0)=>{

        if(postedTenders && listingId){
            Object.keys(postedTenders).map(key=>{
                if(listingId === postedTenders[key].listingId){
                    currListingTenderCount ++;
                }
            });
            return currListingTenderCount;
        }else{
            return currListingTenderCount;
        }

    }

    displayListings = (key)=>{
        let listings = {...this.props.genInfo.info.listings},
        listingsInfo = {...this.props.listingsInfo},
        postedTenders = listingsInfo.postedTenders.tenders,
        showTenderForm = listingsInfo.tenderForm.show,
        userType = this.props.profileInfo.userType,
        tenderAttributes = this.props.user.info.submitTender,
        errors = listingsInfo.tenderForm.errors,
        feedback = tenderAttributes.feedback,
        options = listedPostedTendersOptions,
        listingId = listings[key].id,
        showPostedTendersOverlay = listingsInfo.postedTenders.overLay.show,
        feedbackClass = tenderAttributes.feedbackClass;

        if(userType !== "owner_occupier"){
            options = { ...options, sendMessage: "Send Message"};
        }
            
        return(
            <div className="list-row" key={key}>
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
                { 
                    showPostedTendersOverlay
                    ?<PostedTendersOverlay 
                        toggleDisplay={ this.displayTenders } 
                        listingId = { listingId } 
                    />
                    : null 
                }
                <div className="twenty">{ listings[key].city }, { listings[key].state }</div>
                <div className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</div>
                <div className="twenty">{ listings[key].startDate}</div>
                <div className="twenty">
                { 
                    userType !== "owner_occupier"
                    ?<FmButton 
                        id={ listings[key].id } 
                        onClick={ this.renderTenderForm } 
                        variant="contained" 
                        styles = { styles } 
                        text="Submit Tender" 
                    />
                    :<div id = { listings[key].id } onClick={ this.displayTenders }className="posted-count">
                        { this.countTendersPerListing(postedTenders, listingId) }
                    </div> 
                }
                </div>
                <div className="ten">
                    <MoreHoriz 
                        className={ listings[key].moreMenuClassName } 
                        id={ key }
                        autoid = { listings[key].id }
                        email = { listings[key].userEmail }
                        listName = "listings"
                        onClick = { this.renderMessageForm }
                        onClickAlt = { this.displayTenders }
                        element={ listings[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let listings = {...this.props.genInfo.info.listings},
        listingsCount = listings?Object.keys(listings).length:0,
        tenders = {...this.props.tendersInfo.tenders},
        tendersCount = Object.keys(tenders).length,
        userType = this.props.profileInfo.userType,
        messagesInfo = {...this.props.messagesInfo},
        showMessageForm = messagesInfo.messageForm.show,
        messageAttributes = this.props.user.info.submitMessage,
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
                        save={ this.saveMessage } 
                    />
                    :null
                }
                { 
                    listingsCount > 0 && userType === "owner_occupier"
                    ?<div className="list-row header">
                        <span className="twenty">Location</span>
                        <span className="thirty">Description</span>
                        <span className="twenty">Closing Date</span>
                        <span className="twenty">{ userType === "owner_occupier"?"Posted Tenders":null }</span>
                        <span className="ten"></span>
                        <div className="bottom-border"></div>
                    </div>
                    : tendersCount > 0 && userType === "service_provider"
                    ?<div className="list-row header">
                        <span className="twenty">Company Name</span>
                        <span className="thirty">Cover Letter</span>
                        <span className="twenty">starting Date</span>
                        <span className="twenty">Rate</span>
                        <span className="ten"></span>
                        <div className="bottom-border"></div>
                    </div>
                    :<div className="list-row header">There is no tender information to show</div>
                }
                { 
                    userType === "owner_occupier" && listings
                    ?Object.keys(listings).map(this.displayListings)
                    :userType === "service_provider" && tenders
                    ?Object.keys(tenders).map(this.renderTenders)
                    :<div className="loader"><Loader /></div>
                }
            </div>
        )
    }
}

ListedPostedTenders.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ListedPostedTenders.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ListedPostedTenders;
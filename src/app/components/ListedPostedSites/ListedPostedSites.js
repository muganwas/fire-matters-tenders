import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz, PostedTendersOverlay } from 'components';
import axios from 'axios';
import { dispatchedListingsInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './listedPostedSites.css';
import { PropTypes } from 'prop-types';
import { TenderForm } from 'forms';
import { listedPostedSitesOptions } from 'extras/config';
import { submit_styles } from './styles';

const baseURL = process.env.BACK_END_URL,
tenderEndPoint = process.env.TENDERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        profileInfo: store.user.info.profileInfo,
        listingsInfo: store.listingsInfo.info,
        listingsData: store.user.info.submitTender,
        tendersInfo: store.tenders.info,
        sitesInfo: store.sites.info
    }
})
class ListedPostedTenders extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    componentWillMount(){
        /*this.fetchListings().then(res=>{
            if(res === "fetched"){
                this.fetchTenders();
            }
        });*/
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

    displayTenders = (e)=>{
        let tenderId = e.target.id;
        let listingsInfo = {...this.props.listingsInfo},
        show = listingsInfo.postedTenders.overLay.show;
        listingsInfo.postedTenders.overLay.show = !show;
        listingsInfo.postedTenders.overLay.active = tenderId;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));
    }

    displaySites = (key)=>{
        let sites = {...this.props.sitesInfo.sites},
        showTenderForm = listingsInfo.tenderForm.show,
        tenderAttributes = this.props.user.info.submitTender,
        errors = listingsInfo.tenderForm.errors,
        feedback = tenderAttributes.feedback,
        options = listedPostedSitesOptions,
        listingId = listings[key].id,
        showPostedTendersOverlay = listingsInfo.postedTenders.overLay.show,
        feedbackClass = tenderAttributes.feedbackClass;
   
        return(
            <div className="list-row" key={key}>
                {showTenderForm
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
                />:null}
                { showPostedTendersOverlay
                ?<PostedTendersOverlay toggleDisplay={ this.displayTenders } listingId = { listingId } />
                : null }
                <div className="twenty">{ sites[key].siteName }</div>
                <div className="thirty">{ sites[key].location }</div>
                <div className="twenty">{ sites[key].currentContractor }</div>
                <div className="twenty">{ sites[key].contractStatus }</div>
                <div className="ten">
                    <MoreHoriz 
                        className={ sites[key].moreMenuClassName } 
                        id={ key } 
                        listName = "sites" 
                        element={ sites[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let sites = this.props.sitesInfo.sites;
        return(
            <div className="list left hanad">
                <div className="list-row header">
                    <span className="twenty">Site Name</span>
                    <span className="thirty">Location</span>
                    <span className="twenty">Current Contractor</span>
                    <span className="twenty">Contract Status</span>
                    <span className="ten"></span>
                    <div className="bottom-border"></div>
                </div>
                { sites?Object.keys(sites).map(this.displaySites):<div className="loader"><Loader /></div> }
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
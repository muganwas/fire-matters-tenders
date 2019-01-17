import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, MoreHoriz, FmButton } from 'components';
import axios from 'axios';
import { dispatchedListingsInfo, dispatchedUserInfo, dispatchedSitesInfo, ListedPostedSiteDetails } from 'extras/dispatchers';
import { ListingForm } from 'forms';
import './listedPostedSites.css';
import { PropTypes } from 'prop-types';
import { listedPostedSitesOptions } from 'extras/config';
import { styles, submit_styles, alt_styles, alt_styles_neg } from './styles';
import {
    statesAustralia, 
    listingCategories, 
    equipmentCategories,
    detectionAndWarningSystem,
    portableFireFightingEquipment,
    passiveFireProtection,
    emergencyExitLighting,
    contractTypes
} from 'extras/config';

const baseURL = process.env.BACK_END_URL,
siteRemovalEndPoint = process.env.SITE_REMOVAL_END_POINT,
siteUpdateEndPoint = process.env.SITE_UPDATE_END_POINT,
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

    renderSiteDetails = (e) =>{
        e.persist();
        let sitesInfo = this.props.sitesInfo,
        id = e.target.id;
        sitesInfo.detailsView.show = !sitesInfo.detailsView.show;
        
        if(id !== "close"){
            let currSite = sitesInfo.sites[id];
            sitesInfo.activeSite = currSite; 
        }
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
        this.forceUpdate();
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

    displayTenders = (e)=>{
        let tenderId = e.target.id;
        let listingsInfo = {...this.props.listingsInfo},
        show = listingsInfo.postedTenders.overLay.show;
        listingsInfo.postedTenders.overLay.show = !show;
        listingsInfo.postedTenders.overLay.active = tenderId;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));
    }

    renderConfirmationDialogue = (e)=>{
        let sitesInfo = {...this.props.sitesInfo},
        sites = {...sitesInfo.sites};
        sitesInfo.forRemoval.confirmationDialog = !sitesInfo.forRemoval.confirmationDialog;

        if(e){
            let id = e.target.id,
            siteId = sites[id].id;
            sitesInfo.forRemoval.siteId = siteId;
        }
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));   
    }

    removeSite = ()=>{
        let sitesInfo = {...this.props.sitesInfo},
        siteId = sitesInfo.forRemoval.siteId,
        URL = baseURL + siteRemovalEndPoint;
        sitesInfo.forRemoval.confirmButton.isActive = false;
        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
        axios.post(URL, {siteId}).then(res=>{
            if(res.data){
                sitesInfo.forRemoval.confirmButton.isActive = true;
                this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                this.renderConfirmationDialogue();
                this.forceUpdate();
            }
        }); 
    }

    createListing=e=>{
        e.persist();
        let id = e.target.id,
        sitesInfo = { ...this.props.sitesInfo},
        sites = sitesInfo.sites,
        URL = baseURL + siteUpdateEndPoint,
        currListed;
        Object.keys(sites).map(key=>{
            let currId = sites[key].id;
            if(currId === id){
                currListed = sites[key].listed;
            }
        });

        let listed = !currListed;

        if(id){ 
            sitesInfo.createListing[id + 'isActive'] = false;
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            axios.post(URL, {sectTitle: "listed", siteId: id, updateData: listed }).then(res=>{
                console.log(res.data);
                sitesInfo.createListing[id + 'isActive'] = true;
                this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                this.forceUpdate();
            });
        }
        
        /*let listingsData = {...this.props.listingsData},
        userInfo = {...this.props.user.info},
        companyName = listingsData.listingCompanyName,
        state = listingsData.listingState,
        city = listingsData.listingCity,
        serviceRequired = listingsData.listingCategory,
        otherServiceType = listingsData.listingCategoryOther,
        equipmentType = listingsData.listingEquipmentCategory,
        equipment = listingsData.listingEquipment,
        equipmentQuantity = listingsData.listingEquipmentQuantity,
        contractType = listingsData.listingContractType,
        startDate = listingsData.listingStartDate,
        userEmail = this.props.profileInfo.emailAddress,
        postInfoUrl = baseURL + listingsEndPoint;
        serviceRequired = serviceRequired === "Other"?otherServiceType:serviceRequired;

        let postObject = {
            userEmail,
            companyName, 
            state, 
            city, 
            serviceRequired, 
            equipmentType, 
            equipment, 
            equipmentQuantity, 
            contractType, 
            startDate
        };
        this.checkForErrors().then(res=>{
            console.log(serviceRequired)
            console.log(res)
            if(serviceRequired &&  res <= 1){
                userInfo.createListing.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.createListing.submitButton.isActive = true;
                    userInfo.createListing.feedback = "Your listing was posted successfully";
                    userInfo.createListing.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(res);
                }).
                catch(err=>{
                    userInfo.createListing.submitButton.isActive = true;
                    userInfo.createListing.feedback = "Something went wrong, try again later.";
                    userInfo.createListing.feedbackClass="error-feedback";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(err);
                });
            }else if(!serviceRequired &&  res === 0){
                userInfo.createListing.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.createListing.submitButton.isActive = true;
                    userInfo.createListing.feedback = "Your listing was posted successfully.";
                    userInfo.createListing.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(res);
                }).
                catch(err=>{
                    userInfo.createListing.submitButton.isActive = true;
                    userInfo.createListing.feedbackClass="error-feedback";
                    userInfo.createListing.feedback = "Something went wrong, try again later.";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(err);
                });
            }
        });*/
    };

    renderListingForm = ()=>{
        let listingsInfo = {...this.props.listingsInfo};
        listingsInfo.createForm.show = !listingsInfo.createForm.show;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));               
    }

    dummy= ()=>{
        return Promise.resolve("Nassing");
    }

    displaySites = (key)=>{
        let sitesInfo = {...this.props.sitesInfo},
        sites = {...sitesInfo.sites},
        isActive = sitesInfo.createListing[sites[key].id + 'isActive'] === undefined?true:
        sitesInfo.createListing[sites[key].id + 'isActive']?true:false,
        showDetailsView = sitesInfo.detailsView.show,
        listed = sites[key].listed,
        createListingButtonText = listed?"Unbulish Listing":"Publish Listing",
        options = listedPostedSitesOptions;
        return(
            <div className="list-row" key={key}>
                {showDetailsView
                    ?<div className="subcontractors-container">
                        <span 
                            className="close right" 
                            onClick={ this.renderSiteDetails } 
                            id="close"
                        >
                            &#x2716;
                        </span>
                        <ListedPostedSiteDetails siteKey= {key} />
                    </div>
                    :null
                }

                <div className="ten">{ sites[key].siteName }</div>
                <div className="twenty">{ sites[key].siteLocation }</div>
                <div className="twenty">{ sites[key].currentContractor }</div>
                <div className="twenty">{ sites[key].contractStatus }</div>
                <div className="twenty">
                    <FmButton 
                        variant="contained" 
                        id={sites[key].id}
                        isActive = { isActive }
                        onClick={ this.createListing } 
                        styles={ styles }
                        text={ createListingButtonText } 
                    />
                </div>
                <div className="ten">
                    <MoreHoriz 
                        className={ sites[key].moreMenuClassName } 
                        id={ key }
                        onDelete = { this.renderConfirmationDialogue }
                        onClickAlt = { this.renderSiteDetails }
                        listName = "sites" 
                        element={ sites[key] }
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
            userInfo.createListing[name] = value;
            userInfo.createListing[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };

    render(){
        let sitesInfo = {...this.props.sitesInfo},
        listingsInfo = {...this.props.listingsInfo},
        showListingsForm = listingsInfo.createForm.show,
        sites = sitesInfo.sites,
        isActive = sitesInfo.forRemoval.confirmButton.isActive,
        removeDialog = sitesInfo.forRemoval.confirmationDialog,
        listingAttributes = this.props.user.info.createListing,
        errors = listingsInfo.createForm.errors,
        feedback = listingAttributes.feedback,
        feedbackClass = listingAttributes.feedbackClass,
        equipment = { detectionAndWarningSystem, portableFireFightingEquipment, passiveFireProtection, emergencyExitLighting };

        return(
            <div className="list left hanad">
                {showListingsForm
                    ?<ListingForm
                        feedback = { feedback }
                        feedbackClass = { feedbackClass }
                        errors = { errors }
                        contractTypes = { contractTypes }
                        equipmentCollection = { equipment }
                        listingCategories = { listingCategories }
                        equipCategories = { equipmentCategories }
                        styles = { submit_styles }
                        states= { statesAustralia } 
                        attributes = { listingAttributes } 
                        close={ this.renderListingForm } 
                        onBlur={ this.dummy } 
                        upload={ this.createListing } 
                        save={ this.save } 
                    />
                :null}
                {   removeDialog
                    ?<div className="subcontractors-container">
                        <div className="sub-container dialog">
                            <span id="text">Are you sure you want to remove the site?</span>
                            <FmButton
                                id="yes"
                                text = "Proceed"
                                isActive={isActive}
                                onClick={this.removeSite}
                                variant="contained"
                                styles={alt_styles}
                            />
                            <FmButton
                                id="no"
                                text="Cancel"
                                isActive={true}
                                onClick={ this.renderConfirmationDialogue }
                                variant="contained"
                                styles={alt_styles_neg}
                            />
                        </div>
                    </div>
                    :null
                }
                <div className="list-row header">
                    <span className="ten">Site Name</span>
                    <span className="twenty">Location</span>
                    <span className="twenty">Current Contractor</span>
                    <span className="twenty">Contract Status</span>
                    <span className="twenty"></span>
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
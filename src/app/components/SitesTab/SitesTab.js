import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedSitesInfo, dispatchedListingsInfo, dispatchedGenInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './sitesTab.css'
import { SearchInput, FmButton, ListedPostedSites } from 'components';
import { SitesForm } from 'forms';
import {  
    detectionAndWarningSystems,
    portableEquipment,
    passiveProtection,
    emergencyExitLighting,
} from 'extras/config';
import  { styles, submit_styles } from './styles';


const baseURL = process.env.BACK_END_URL,
sitesEndPoint = process.env.SITES_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        siteData: store.user.info.submitSite,
        profileInfo: store.user.info.profileInfo,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
        sitesInfo: store.sites.info
    }
})
class SitesTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
        this.fetchSites();
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    searchListings = ()=>{

    }

    fetchSites = ()=>{
        return new Promise(resolve=>{
            let sitesInfo = {...this.props.sitesInfo },
            genInfo = { ...this.props.genInfo },
            userType = this.props.profileInfo.userType,
            userEmail = this.props.profileInfo.emailAddress,
            url = baseURL + sitesEndPoint + "?emailAddress=" + userEmail;
            if(userType){
                if(userType === "Owner/Occupier"){
                    axios.get(url).then((response)=>{
                        //console.log(response.data);
                        let sites = sitesInfo.sites = genInfo.sites = {...response.data};
                        genInfo.sideBar.profilePage.listCount['sites'] = (response.data).length;
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(sites).map((key)=>{
                            sitesInfo.sites[key].moreMenuClassName = "hidden";
                        })
                        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        resolve("fetched");
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            }
        });    
    }

    renderListingForm = ()=>{
        let listingsInfo = {...this.props.listingsInfo};
        listingsInfo.createForm.show = !listingsInfo.createForm.show;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));               
    }

    checkForErrors(){
        let errored = [];
        return new Promise((resolve, reject)=>{
            let siteData = {...this.props.siteData},
            listingsInfo = {...this.props.listingsInfo};
            Object.keys(siteData).map(key=>{
                if(!siteData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    listingsInfo.createForm.errors[key] = true;
                    errored.push(listingsInfo.createForm.errors[key]);
                }else if(siteData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    listingsInfo.createForm.errors[key] = null;
                }
            });
            this.props.dispatch(dispatchedListingsInfo(listingsInfo));
            let errCount = errored.length;
            resolve(errCount);
        }); 
    }

    upload=()=>{
        let siteData = {...this.props.siteData},
        userInfo = {...this.props.user},
        siteOwner = this.props.profileInfo.emailAddress,
        siteName = siteData.siteName,
        siteLocation = siteData.siteLocation,
        currentContractor = siteData.currentContractor,
        siteContractStatus = siteData.siteContractStatus,
        postInfoUrl = baseURL + sitesEndPoint;

        let postObject = {
            siteOwner,
            siteName, 
            siteLocation, 
            currentContractor, 
            siteContractStatus
        };
        this.checkForErrors().then(res=>{
            console.log(res)
            if(res === 0){
                userInfo.submitSite.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.submitSite.submitButton.isActive = true;
                    userInfo.submitSite.feedback = "Your Site was posted successfully.";
                    userInfo.submitSite.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(res);
                }).
                catch(err=>{
                    userInfo.submitSite.submitButton.isActive = true;
                    userInfo.submitSite.feedbackClass="error-feedback";
                    userInfo.submitSite.feedback = "Something went wrong, try again later.";
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
            userInfo.submitSite[name] = value;
            userInfo.submitSite[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };


    render(){
        const listingsInfo = this.props.listingsInfo,
        showListingsForm = listingsInfo.createForm.show,
        listingAttributes = this.props.user.submitSite,
        errors = listingsInfo.createForm.errors,
        userType = this.props.profileInfo.userType,
        feedback = listingAttributes.feedback,
        feedbackClass = listingAttributes.feedbackClass;
        return(
            <div className="tenders main-content">
                {showListingsForm
                ?<SitesForm
                    feedback = { feedback }
                    feedbackClass = { feedbackClass }
                    errors = { errors }
                    contractStatusOptions = {{inactive: "Not Active", active: "Active"}}
                    styles = { submit_styles }
                    attributes = { listingAttributes } 
                    close={ this.renderListingForm } 
                    onBlur={ this.dummy } 
                    upload={ this.upload } 
                    save={ this.save } 
                />
                :null}
                <div className="title-bar">
                    <span id="title">Sites</span>
                    {userType === "Owner/Occupier"?<span id="search">
                        <FmButton variant="contained" onClick={ this.renderListingForm } styles={ styles } text="Register New Site" />
                        <SearchInput className="alt-search" placeholder="search for your sites" search={ this.searchListings } />
                    </span>:null}
                </div>
                <ListedPostedSites />
            </div>
        )
    }
}

SitesTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SitesTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SitesTab;
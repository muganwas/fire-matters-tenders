import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedSitesInfo, dispatchedListingsInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './sitesTab.css'
import { SearchInput, FmButton, ListedPostedTenders, ListedPostedSites } from 'components';
import { SitesForm } from 'forms';
import {  
    statesAustralia, 
    listingCategories, 
    equipmentCategories,
    detectionAndWarningSystems,
    portableEquipment,
    passiveProtection,
    emergencyExitLighting,
    contractTypes
} from 'extras/config';
import  { styles, submit_styles, alt_styles } from './styles';


const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT,
sitesEndPoint = process.env.SITES_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        listingsData: store.user.info.createListing,
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
            userType = this.props.profileInfo.userType,
            userEmail = this.props.profileInfo.userEmail,
            url = baseURL + sitesEndPoint + "emailAddress=" + userEmail;
            if(userType){
                if(userType !== "Owner/Occupier"){
                    axios.get(url).then((response)=>{
                        //console.log(response.data);
                        let sites = sitesInfo.sites = {...response.data};
                        genInfo.sideBar.profilePage.listCount['sites'] = (response.data).length;
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(sites).map((key)=>{
                            sitesInfo.sites[key].moreMenuClassName = "hidden";
                        })
                        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
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
            let listingsData = {...this.props.listingsData},
            listingsInfo = {...this.props.listingsInfo};
            Object.keys(listingsData).map(key=>{
                if(!listingsData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    listingsInfo.createForm.errors[key] = true;
                    errored.push(listingsInfo.createForm.errors[key]);
                }else if(listingsData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    listingsInfo.createForm.errors[key] = null;
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
        const listingsInfo = this.props.listingsInfo,
        showListingsForm = listingsInfo.createForm.show,
        listingAttributes = this.props.user.createListing,
        errors = listingsInfo.createForm.errors,
        userType = this.props.profileInfo.userType,
        feedback = listingAttributes.feedback,
        feedbackClass = listingAttributes.feedbackClass,
        equipment = {detectionAndWarningSystems, portableEquipment, passiveProtection, emergencyExitLighting };
        return(
            <div className="tenders main-content">
                {showListingsForm
                ?<SitesForm
                    feedback = { feedback }
                    feedbackClass = { feedbackClass }
                    errors = { errors }
                    contractTypes = { contractTypes }
                    equipmentCollection = { equipment }
                    contractStatusOptions = {{inactive: "Not Active", active: "Active"}}
                    equipCategories = { equipmentCategories }
                    styles = { submit_styles }
                    states= { statesAustralia } 
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
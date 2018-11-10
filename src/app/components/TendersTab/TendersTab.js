import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedListingsInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './tendersTab.css'
import { SearchInput, FmButton, ListedPostedTenders} from 'components';
import { ListingForm } from 'forms';
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

const styles = {
    button: {
        float: "right",
        margin: 0,
        padding: "3px 10px",
        margin: "0 5px",
        fontSize: 10,
        backgroundColor: "#ED2431",
        color: "#fff",
        fontWeight: "bold",
        '&:hover': {
        background: '#ED2431',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
        }
    },
    el:{
        display: "inline-block",
        margin: "0 20%"
    },
    information:{
        textAlign: "center"
    },
},
submit_styles = {
    button: {
        float: "right",
        margin: 0,
        padding: "3px 10px",
        margin: "0 5px",
        width: 330,
        fontSize: 14,
        backgroundColor: "#ED2431",
        color: "#fff",
        fontWeight: "bold",
        '&:hover': {
        background: '#ED2431',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
        }
    },
    inputErr:{
        width: 330,
        display: "block",
        margin: "3px",
        padding: "5px"
    },
    el:{
        display: "inline-block",
        margin: "0 20%"
    },
    information:{
        textAlign: "center"
    },
},
alt_styles = {
    button: {
        float: "right",
        margin: 0,
        padding: "3px 10px",
        margin: "0 0 0 5px",
        fontSize: 10,
        color: "#000",
        fontWeight: "bold",
        '&:hover': {
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
        }
    },
},
baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        listingsData: store.user.info.createListing,
        profileInfo: store.user.info.profileInfo,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
    }
})
class TendersTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
        let userType = JSON.parse(sessionStorage.getItem('profileInfo')).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "Owner/Occupier" || userType === "owner-occupier" || userType === "owner_occupier"){
            
        }
        else{

        }  
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    fetchListings = ()=>{
        let genInfo = {...this.props.genInfo.info };
        axios.get(baseUrl + listingsEndPoint).then((response)=>{
            //console.log(response.data);
            let listings = genInfo.listings = {...response.data};
            /**Set the more dropdown menu class to hidden for every row*/
            Object.keys(listings).map((key)=>{
                genInfo.listings[key].moreMenuClassName = "hidden";
            })
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }).catch(err=>{
            console.log(err);
        });
    }

    searchListings = ()=>{

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
                if(!listingsData[key]){
                    listingsInfo.createForm.errors[key] = true;
                    errored.push(listingsInfo.createForm.errors[key]);
                }else{
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
        userEmail = this.props.profileInfo.emailAddress;
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
                    userInfo.createListing.feedback = "Something went wrong, try again later.";
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
        feedback = listingAttributes.feedback,
        feedbackClass = listingAttributes.feedbackClass,
        equipment = {detectionAndWarningSystems, portableEquipment, passiveProtection, emergencyExitLighting };
        return(
            <div className="tenders main-content">
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
                    upload={ this.upload } 
                    save={ this.save } 
                />
                :null}
                <div className="title-bar">
                    <span id="title">Postings</span>
                    <span id="search">
                        <FmButton variant="contained" styles={ alt_styles } text="Rehire service provider" />
                        <FmButton variant="contained" onClick={ this.renderListingForm } styles={ styles } text="Post New Tender" />
                        <SearchInput className="alt-search" placeholder="search for your listings" search={ this.searchListings } />
                    </span>
                </div>
                <ListedPostedTenders />
            </div>
        )
    }
}

TendersTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

TendersTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default TendersTab;
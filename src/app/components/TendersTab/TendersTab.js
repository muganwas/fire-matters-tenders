import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedTendersInfo, dispatchedListingsInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './tendersTab.css'
import { SearchInput, FmButton, ListedPostedTenders} from 'components';
//import { ListingForm } from 'forms';
import {  
    detectionAndWarningSystem,
    portableFireFightingEquipment,
    passiveFireProtection,
    emergencyExitLighting
} from 'extras/config';
//import { styles, alt_styles, submit_styles } from './styles';

let baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        listingsData: store.user.info.createListing,
        tendersInfo: store.tenders.info,
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
        if(userType === "owner_occupier" || userType === "owner-occupier" || userType === "owner_occupier"){
            
        }
        else{

        }  
        this.props.dispatch(dispatchedGenInfo(genInfo));
        this.fetchListings().then(res=>{
            if(res === "fetched"){
                this.fetchTenders();
            }
        });
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    searchListings = ()=>{

    }

    fetchTenders = ()=>{
        let postInfoUrl = baseURL + tenderEndPoint,
        genInfo = {...this.props.genInfo },
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
                        currObj.acceptTenderButton = { isActive: true };
                        Object.keys(listings).map(key=>{
                            if(listingId === listings[key].id){
                                let cO = {tenderId:currObj.id, listingId: listingId, acceptTenderButton:{isActive:true}};
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
                genInfo = {...this.props.genInfo},
                tendersInfo = {...this.props.tendersInfo},
                getInfoUrl = baseURL + tenderEndPoint + "?tendererId=" + tendererId;
                axios.get(getInfoUrl).then(res=>{
                    if(res){
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
            let genInfo = {...this.props.genInfo },
            userType = this.props.profileInfo.userType,
            userEmail = this.props.profileInfo.emailAddress;
            if(userType){
                if(userType !== "owner_occupier"){
                    axios.get(baseURL + listingsEndPoint).then((response)=>{
                        //console.log(response.data);
                        let listings = genInfo.listings = {...response.data};
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(listings).map((key)=>{
                            genInfo.listings[key].moreMenuClassName = "hidden";
                        })
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
        //const listingsInfo = this.props.listingsInfo,
        //showListingsForm = listingsInfo.createForm.show,
        //listingAttributes = this.props.user.createListing,
       // errors = listingsInfo.createForm.errors,
        const userType = this.props.profileInfo.userType;
        //feedback = listingAttributes.feedback,
        //feedbackClass = listingAttributes.feedbackClass,
        //equipment = { detectionAndWarningSystem, portableFireFightingEquipment, passiveFireProtection, emergencyExitLighting };
        return(
            <div className="tenders main-content">
                {/*showListingsForm
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
                :null*/}
                <div className="title-bar">
                    <span id="title">{userType === "service_provider"?"Tenders":"Listings"}</span>
                    {userType === "owner_occupier"?<span id="search">
                        { /*<FmButton variant="contained" styles={ alt_styles } text="Rehire service provider" />
                        <FmButton variant="contained" onClick={ this.renderListingForm } styles={ styles } text="Post New Listing" />*/ }
                        <SearchInput className="alt-search" placeholder="search for your listings" search={ this.searchListings } />
                    </span>:null}
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
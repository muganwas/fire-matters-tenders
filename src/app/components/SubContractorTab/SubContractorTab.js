import React from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz, PostedTendersOverlay, SearchInput } from 'components';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedListingsInfo, dispatchedUserInfo, dispatchedTendersInfo, dispatchedSubContractorsInfo } from 'extras/dispatchers';
import './subContractorTab.css';
import { PropTypes } from 'prop-types';
import { SubContractorForm } from 'forms';
import { listedPostedTendersOptions, statesAustralia } from 'extras/config';
import { styles, submit_styles } from './styles';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT,
subContractorsEndPoint = process.env.SUB_CONTRACTORS_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        profileInfo: store.user.info.profileInfo,
        listingsInfo: store.listingsInfo.info,
        listingsData: store.user.info.submitTender,
        tendersInfo: store.tenders.info,
        subContractorData: store.user.info.addSubContractor,
        subContractorsInfo: store.subContractors.info
    }
})
class SubContractorTab extends React.Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    checkForErrors=()=>{
        let errored = [];
        return new Promise((resolve, reject)=>{
            let subContractorData = {...this.props.subContractorData},
            subContractorsInfo = {...this.props.subContractorsInfo};
            Object.keys(subContractorData).map(key=>{
                if(!subContractorData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    subContractorsInfo.subContractorForm.errors[key] = true;
                    errored.push(subContractorsInfo.subContractorForm.errors[key]);
                }else if(subContractorData[key] && key !== "feedback" && key !== "feedbackClass" && key !== "submitButton"){
                    subContractorsInfo.subContractorForm.errors[key] = null;
                }
            });
            this.props.dispatch(dispatchedSubContractorsInfo(subContractorsInfo));
            let errCount = errored.length;
            resolve(errCount);
        }); 
    }

    renderSubContractorForm = ()=>{
        let subContractorsInfo = {...this.props.subContractorsInfo};
        subContractorsInfo.subContractorForm.show = !subContractorsInfo.subContractorForm.show;
        this.props.dispatch(dispatchedSubContractorsInfo(subContractorsInfo));               
    }

    addSubContractor=()=>{
        let subContractorData = {...this.props.subContractorData},
        userInfo = {...this.props.user.info},
        mainUserId = this.props.profileInfo.id,
        companyName = subContractorData.contractorCompanyName,
        fullName = subContractorData.contractorFullName,
        phoneNumber = (subContractorData.contractorPhoneNumber).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""),
        mobileNumber = subContractorData.contractorMobileNumber,
        emailAddress = subContractorData.contractorEmailAddress,
        state = subContractorData.contractorState,
        city = subContractorData.contractorCity,
        physicalAddress = subContractorData.contractorPhysicalAddress,
        postInfoUrl = baseURL + subContractorsEndPoint;

        mobileNumber = mobileNumber?mobileNumber.replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""): undefined;

        let postObject = {
            mainUserId,
            companyName,
            fullName, 
            phoneNumber,
            mobileNumber,
            emailAddress,
            state,
            city,
            physicalAddress
        };
        this.checkForErrors().then(res=>{
            userInfo.addSubContractor.submitButton.isActive = false;
            this.props.dispatch(dispatchedUserInfo(userInfo));
            if(res === 0){
                userInfo.addSubContractor.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    userInfo.addSubContractor.submitButton.isActive = true;
                    userInfo.addSubContractor.feedback = fullName + "was added successfully.";
                    userInfo.addSubContractor.feedbackClass="success";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(res);
                }).
                catch(err=>{
                    userInfo.addSubContractor.submitButton.isActive = true;
                    userInfo.addSubContractor.feedbackClass="error-feedback";
                    userInfo.addSubContractor.feedback = "Something went wrong, try again later.";
                    this.props.dispatch(dispatchedUserInfo(userInfo));
                    this.forceUpdate();
                    console.log(err);
                });
            }else{
                userInfo.addSubContractor.submitButton.isActive = true;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                this.forceUpdate();
            }
            
        });
    };


    dummy= ()=>{
        return Promise.resolve("Nassing");
    }

    saveSubContractors=(e)=>{
        e.persist();
        return new Promise((resolve, reject)=>{
            let userInfo = {...this.props.user.info},
            id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.value;
            value = value?value:e.target.getAttribute('value');
            userInfo.addSubContractor[name] = value;
            userInfo.addSubContractor[name + "_key"] = id;
            if(userInfo){
                resolve(userInfo);
            }                        
            else
                reject({message: "No data"});
        });
    };

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
        let currListingTenderCount = 0;

        if(postedTenders){
            postedTenders.forEach((obj)=>{
                if(listingId === obj.listingId){
                    currListingTenderCount ++;
                }
            });
        }

        if(userType !== "Owner/Occupier"){
            options = { ...options, sendMessage: "Send Message"};
        }
            
        return(
            <div className="list-row" key={key}>
                {showTenderForm
                ?<TenderForm
                    feedback = { feedback }
                    feedbackClass = { feedbackClass }
                    errors = { errors }
                    styles = { submit_styles }
                    statesAustralia = { statesAustralia }
                    attributes = { tenderAttributes } 
                    close={ this.renderTenderForm } 
                    onBlur={ this.dummy } 
                    upload={ this.upload } 
                    save={ this.save } 
                />:null}
                { showPostedTendersOverlay
                ?<PostedTendersOverlay toggleDisplay={ this.displayTenders } listingId = { listingId } />
                : null }
                <div className="twenty">{ listings[key].city }, { listings[key].state }</div>
                <div className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</div>
                <div className="thirty">{ listings[key].startDate}</div>
                <div className="twenty">
                    <MoreHoriz 
                        className={ listings[key].moreMenuClassName } 
                        id={ key }
                        autoid = { listings[key].id }
                        email = { listings[key].userEmail }
                        listName = "listings"
                        onClick = { this.renderMessageForm }
                        element={ listings[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    searchSubContractors = ()=>{
        
    }

    render(){
        const listings = {...this.props.genInfo.info.listings},
        subContractors = {},
        userType = this.props.profileInfo.userType,
        subContractorsInfo = {...this.props.subContractorsInfo},
        showSubContractorForm = subContractorsInfo.subContractorForm.show,
        subContractorAttributes = this.props.user.info.addSubContractor,
        errors = subContractorsInfo.subContractorForm.errors,
        feedback = subContractorAttributes.feedback,
        feedbackClass = subContractorAttributes.feedbackClass;
        return(
            <div className="tenders main-content">
                {   
                    showSubContractorForm
                    ?<SubContractorForm
                        feedback = { feedback }
                        feedbackClass = { feedbackClass }
                        errors = { errors }
                        styles = { submit_styles }
                        statesAustralia = { statesAustralia }
                        attributes = { subContractorAttributes } 
                        close={ this.renderSubContractorForm } 
                        onBlur={ this.dummy } 
                        upload={ this.addSubContractor } 
                        save={ this.saveSubContractors } 
                    />
                    :null
                }
                <div className="title-bar">
                        <span id="title">Sub-Contractors</span>
                        {userType !== "Owner/Occupier"
                        ?<span id="search">
                            <FmButton variant="contained" onClick={ this.renderSubContractorForm } styles={ styles } text="New Sub-contractor" />
                            <SearchInput className="alt-search" placeholder="search for sub-contractors" search={ this.searchSubContractors } />
                        </span>:null}
                </div>
                <div className="list left hanad">
                    <div className="list-row header">
                        <span className="twenty">Company Name</span>
                        <span className="thirty">Location</span>
                        <span className="thirty">Categories</span>
                        <span className="twenty"></span>
                        <div className="bottom-border"></div>
                    </div>
                    { listings?Object.keys(subContractors).map(this.displayListings):<div className="loader"><Loader /></div> }
                </div>
            </div>
        )
    }
}

SubContractorTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SubContractorTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
}

export default SubContractorTab;
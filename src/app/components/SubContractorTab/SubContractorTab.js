import React from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz, SubContractorDetailsView, SearchInput } from 'components';
import axios from 'axios';
import { dispatchedUserInfo, dispatchedSubContractorsInfo } from 'extras/dispatchers';
import './subContractorTab.css';
import { PropTypes } from 'prop-types';
import { SubContractorForm } from 'forms';
import { statesAustralia } from 'extras/config';
import { styles, submit_styles } from './styles';

const baseURL = process.env.BACK_END_URL,
subContractorsEndPoint = process.env.SUB_CONTRACTORS_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        realProfileInfo: store.profile.info,
        profileInfo: store.user.info.profileInfo,
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
        return new Promise(resolve=>{
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

    renderSubContractorDetails = (e)=>{
        e.persist();
        let id = e.target.id,
        subContractorsInfo = { ...this.props.subContractorsInfo },
        subContractors = { ...subContractorsInfo.subContractors },
        currSub = {...subContractors[id]};
        subContractorsInfo.currentSub = currSub;
        subContractorsInfo.detailsView.show = !subContractorsInfo.detailsView.show;
        this.props.dispatch(dispatchedSubContractorsInfo(subContractorsInfo));
    }

    addSubContractor=()=>{
        let subContractorData = {...this.props.subContractorData},
        userInfo = {...this.props.user.info},
        mainUserId = this.props.profileInfo.id;
        
        this.checkForErrors().then(res=>{
            if(res === 0){
                userInfo.addSubContractor.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                let companyName = subContractorData.contractorCompanyName,
                fullName = subContractorData.contractorFullName,
                phoneNumber = (subContractorData.contractorPhoneNumber).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", ""),
                mobileNumber = subContractorData.contractorMobileNumber,
                emailAddress = subContractorData.contractorEmailAddress,
                state = subContractorData.contractorState,
                city = subContractorData.contractorCity,
                suburb = subContractorData.contractorSuburb,
                area = subContractorData.contractorArea,
                street = subContractorData.contractorStreet,
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
                    suburb,
                    area,
                    street
                };
                userInfo.addSubContractor.submitButton.isActive = false;
                this.props.dispatch(dispatchedUserInfo(userInfo));
                axios.post(postInfoUrl, postObject).
                then(res=>{
                    console.log(res.data)
                    if(!res.data.errors){
                        userInfo.addSubContractor.submitButton.isActive = true;
                        userInfo.addSubContractor.feedback = fullName + " was added successfully.";
                        userInfo.addSubContractor.feedbackClass="success";
                        this.props.dispatch(dispatchedUserInfo(userInfo));
                        this.forceUpdate();
                    }else{
                        userInfo.addSubContractor.submitButton.isActive = true;
                        userInfo.addSubContractor.feedback = "Something went wrong, try again later.";
                        userInfo.addSubContractor.feedbackClass="error-feedback";
                        this.props.dispatch(dispatchedUserInfo(userInfo));
                        this.forceUpdate();
                    }
                    
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

    displaySubContractors = (key)=>{
        let subContractorsInfo = {...this.props.subContractorsInfo},
        subContractors = {...subContractorsInfo.subContractors},   
        options = { more: "View More..." };
            
        return(
            <div className="list-row" key={key}>
                <div className="twenty">{ subContractors[key].companyName }</div>
                <div className="thirty">{ subContractors[key].city }</div>
                <div className="thirty">{ subContractors[key].categoriesOfService}</div>
                <div className="twenty">
                    <MoreHoriz 
                        className={ subContractors[key].moreMenuClassName } 
                        id={ key }
                        autoid = { subContractors[key].id }
                        listName = "subContractors"
                        onClickAlt = { this.renderSubContractorDetails }
                        element={ subContractors[key] }
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
        const subContractorsInfo = {...this.props.subContractorsInfo},
        subContractors = subContractorsInfo.subContractors,
        subContractorsCount = Object.keys(subContractors).length,
        showSubContractorForm = subContractorsInfo.subContractorForm.show,
        subContractorAttributes = this.props.user.info.addSubContractor,
        errors = subContractorsInfo.subContractorForm.errors,
        userType = JSON.parse(sessionStorage.getItem('profileInfo')).userType,
        feedback = subContractorAttributes.feedback,
        feedbackClass = subContractorAttributes.feedbackClass,
        winWidth = this.props.realProfileInfo.visualProps.windowWidth,
        showDetailsView = subContractorsInfo.detailsView.show;
        return(
            <div className="tenders main-content">
                {showDetailsView
                    ?<div className="subcontractors-container">
                        <span 
                            className="close right" 
                            onClick={ this.renderSubContractorDetails } 
                            id="close"
                        >
                            &#x2716;
                        </span>
                        <SubContractorDetailsView />
                    </div>
                    :null
                }
                
                {   
                    showSubContractorForm
                    ?<SubContractorForm
                        winWidth = { winWidth }
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
                    {userType === "service_provider"?<span id="search">
                        <FmButton variant="contained" onClick={ this.renderSubContractorForm } styles={ styles } text="New Sub-contractor" />
                        <SearchInput className="alt-search" placeholder="search for sub-contractors" search={ this.searchSubContractors } />
                    </span>:null}
                </div>
                <div className="list left hanad">
                    {   subContractorsCount > 0
                        ?<div className="list-row header">
                            <span className="twenty">Company Name</span>
                            <span className="thirty">Location</span>
                            <span className="thirty">Categories</span>
                            <span className="twenty"></span>
                            <div className="bottom-border"></div>
                        </div>
                        :<div className="list-row header">There are no sub-contractors to show</div>
                    }
                    { subContractors?Object.keys(subContractors).map(this.displaySubContractors):<div className="loader"><Loader /></div> }
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
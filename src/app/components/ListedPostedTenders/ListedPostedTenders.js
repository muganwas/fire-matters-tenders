import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz } from 'components';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedListingsInfo, dispatchedUserInfo } from 'extras/dispatchers';
import './listedPostedTenders.css';
import { PropTypes } from 'prop-types';
import { TenderForm } from 'forms';
import { listedPostedTendersOptions } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT;
var currListingTenderCount = 0;

const styles = {
    button: {
      margin: 2,
      padding: '3px 10px',
      fontSize: 10,
      backgroundColor: "#F79A50",
      '&:hover': {
        background: '#F79A50',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
      }
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
    trans: {
        backgroundColor: "rgba(0,0,0,0.1)"
    }
};

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        profileInfo: store.user.info.profileInfo,
        listingsInfo: store.listingsInfo.info,
        listingsData: store.user.info.submitTender,
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
        this.fetchListings().then(res=>{
            if(res === "fetched"){
                this.fetchTenders();
            }
        })
    }

    fetchTenders = ()=>{
        let postInfoUrl = baseURL + tenderEndPoint,
        genInfo = {...this.props.genInfo.info },
        userType = (this.props.profileInfo.userType).toLowerCase(),
        postedTenders = [];
        if(userType === "owner/occupier"){
            let listings = genInfo.listings;
            axios.get(postInfoUrl).then(res=>{
                let tendersArr = res.data,
                tendersLen = tendersArr.length;
                for(let count = 0;count <tendersLen; count++){
                    let currObj = tendersArr[count],
                    listingId = currObj.listingId;
                    Object.keys(listings).map(key=>{
                        if(listingId === listings[key].id){
                            let cO = {[currObj.id]:listings[key].id, listingId: listingId};
                            postedTenders.push(cO);
                        }
                    });
                }
            });
            let listingsInfo = {...this.props.listingsInfo};
            listingsInfo.postedTenders.tenders = postedTenders;
            this.props.dispatch(dispatchedListingsInfo(listingsInfo));
            this.forceUpdate();
        }
    }

    fetchListings = ()=>{
        return new Promise(resolve=>{
            let genInfo = {...this.props.genInfo.info },
            userType = (this.props.profileInfo.userType).toLowerCase(),
            userEmail = this.props.profileInfo.emailAddress;
            if(userType !== "owner/occupier"){
                axios.get(baseURL + listingsEndPoint).then((response)=>{
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
        console.log(e.target.id);
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
        feedbackClass = tenderAttributes.feedbackClass;
        
        if(postedTenders){
            postedTenders.forEach((obj)=>{
                if(listingId === obj.listingId){
                    currListingTenderCount ++;
                }
            });
        }
            
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
                <div className="twenty">{ listings[key].city }, { listings[key].state }</div>
                <div className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</div>
                <div className="twenty">{ listings[key].startDate}</div>
                <div className="twenty">
                { 
                    userType !== "Owner/Occupier"
                    ?<FmButton 
                        id={ listings[key].id } 
                        onClick={ this.renderTenderForm } 
                        variant="contained" 
                        styles = { styles } 
                        text="Submit Tender" 
                    />
                    :<div id = { listings[key].id } onClick={ this.displayTenders }className="posted-count">
                        { currListingTenderCount }
                    </div> 
                }
                </div>
                <div className="ten">
                    <MoreHoriz 
                        className={ listings[key].moreMenuClassName } 
                        id={ key } 
                        listName = "listings" 
                        element={ listings[key] }
                        options={ options }
                     />
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let listings = this.props.genInfo.info.listings,
        userType = this.props.profileInfo.userType;
        return(
            <div className="list left hanad">
                <div className="list-row header">
                    <span className="twenty">Location</span>
                    <span className="thirty">Description</span>
                    <span className="twenty">Closing Date</span>
                    <span className="twenty">{ userType === "Owner/Occupier"?"Posted Tenders":null }</span>
                    <span className="ten"></span>
                    <div className="bottom-border"></div>
                </div>
                { listings?Object.keys(listings).map(this.displayListings):<div className="loader"><Loader /></div> }
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
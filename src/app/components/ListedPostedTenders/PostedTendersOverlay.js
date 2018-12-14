import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { FmButton } from 'components';
import axios from 'axios';
import { dispatchedTendersInfo } from 'extras/dispatchers';
import './listedPostedTenders.css';
import { PropTypes } from 'prop-types';
import { styles, success } from './styles';

const baseUrl = process.env.BACK_END_URL,
listingsUpdateEndPoint = process.env.LISTING_UPDATE_END_POINT,
tenderUpdateEndPoint = process.env.TENDER_UPDATE_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        listingsInfo: store.listingsInfo.info,
        tendersInfo: store.tenders.info,
    }
})
class PostedTendersOverlay extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    acceptTender = (e)=>{
        let id = e.target.id,
        name = e.target.getAttribute('name');
        id = id?id:name;
        let tendersInfo = this.props.tendersInfo,
        currListingKey,
        tenderUpdateURL = baseUrl + tenderUpdateEndPoint,
        listingUpdateURL = baseUrl + listingsUpdateEndPoint,
        listings =  {...this.props.genInfo.info.generalListings},
        tenderId = tendersInfo.tenders[id].id,
        listingId = tendersInfo.tenders[id].listingId;
        Object.keys(listings).map(key=>{
            if(listings[key].id === listingId){
                currListingKey = key;
                listings[key].tendered = true;
                listings[key].acceptedTender = tenderId;
            }
        })
        tendersInfo.tenders[id].accepted = true;
        tendersInfo.tenders[id].acceptTenderButton.isActive = false;
        let updateData = tendersInfo.tenders[id];
        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
        this.forceUpdate();
        axios.post(tenderUpdateURL, {tenderId, updateData}).then(res=>{
            if(res.data.accepted){
                axios.post(listingUpdateURL, {listingId, updateData: listings[currListingKey]}).then(res=>{
                    console.log(res.data);
                    tendersInfo.tenders[id].acceptTenderButton.isActive = true;
                    this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                    this.forceUpdate();
                }).
                catch(err=>{
                    console.log(err)
                });
            }
        }).
        catch(err=>{
            console.log(err)
        });
    }

    displayTenders = (key)=>{
        let tendersInfo = this.props.tendersInfo,
        genInfo = this.props.genInfo.info,
        listings = genInfo.listings,
        tenders = tendersInfo.tenders,
        currTender = tenders[key],
        active = this.props.listingsInfo.postedTenders.overLay.active,
        listingForCurrTender,
        acceptedTender;
        Object.keys(listings).map(key=>{
            if(listings[key].id === currTender.listingId){
                listingForCurrTender = listings[key];
            }
            if(listings[key].acceptedTender === currTender.id){
                acceptedTender = true;
            }
        });
        let isActive = tendersInfo.tenders[key].acceptTenderButton.isActive,
        tendered = listingForCurrTender.tendered;
        if(active === tenders[key].listingId){
            return(
                <div key={ key } className="tender-dits">
                    <div className="twenty">{ tenders[key].companyName }</div>
                    <div className="ten">{ tenders[key].rate }</div>
                    <div className="ten">{ tenders[key].startDate }</div>
                    <div className="fifty">{ tenders[key].coverLetter }</div>
                    <div className="ten">
                        <FmButton 
                            variant="contained" 
                            text = {
                                tendered && acceptedTender?
                                "Tender Accepted":
                                tendered && !acceptedTender?
                                "Tender Rejected":
                                "Accept Tender"}
                            id = { key }
                            onClick = {this.acceptTender}
                            inactive = {tendered?true:false}
                            isActive = { tendered?false:isActive }
                            styles = { acceptedTender?success:styles }
                        />
                    </div>
                </div>
            )
        }else
            return;
    }

    render(){
        let tenders = this.props.listingsInfo.postedTenders.tenders;
        return(
            <div className="posted-tenders-overlay">
                <div className="posted-tenders-overlay-sub">
                    <div className="header">
                        <span id="header-text">Tenders </span>
                        <span className="right" onClick={ this.props.toggleDisplay } id="close">&#x2716;</span>
                    </div>
                    <div className="overlay-body">
                        <div className="tender-header">
                            <div className="twenty">Company Name</div>
                            <div className="ten">Rate</div>
                            <div className="ten">Start Date</div>
                            <div className="fifty">Cover Letter</div>
                            <div className="ten"></div>
                        </div>
                        { Object.keys(tenders).map(this.displayTenders) }
                    </div>
                </div>
            </div>
        )
    }
}

PostedTendersOverlay.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

PostedTendersOverlay.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    toggleDisplay: PropTypes.func,
    listingId: PropTypes.string
}

export default PostedTendersOverlay;


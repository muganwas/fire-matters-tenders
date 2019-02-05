import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  equipmentKeyNames } from 'extras/config'
import './listedJobs.css';

const ListedJobDetails = props=>{
    let { listingsInfo, currSite, genInfo, messagesInfo, equipment } = props,
    messages = messagesInfo.messages,
    id = listingsInfo.listedJobDetails.currListingId,
    listings = genInfo.generalListings,
    currListing = listings[id];

    const renderEquip = (key)=>{
        return(
            <div key={key} className="listed-equip">
                { equipmentKeyNames[key] } <span className="right">{ equipment[key] }</span>
            </div>
        )
    }
    return(
        <div className="sub-container">
            <div className="half left">
                <div className="heading"><h3>Listed Site Name: { currSite.siteName } </h3><div className="bottom-border"></div></div>
                <br />
                <div className="information">
                    <div className="el">
                        <h3>Listing Id</h3>
                        <span className ="listingEl">{ currListing.id }</span>
                    </div>
                    <div className="el">
                        <span className="left"><h3>Equipment</h3></span><span className="right qty"><h3>Quantity</h3></span>
                        <div className="clear"></div>
                        <span className ="listingEl">{ Object.keys(equipment).map(renderEquip) }</span>
                    </div>
                    
                    <div className="el">
                        <h3>Contract Period(Years)</h3>
                        <span className ="listingEl">{ currListing.contractPeriod }</span>
                    </div>
                    <div className="el">
                        <h3>Offer Validity</h3>
                        <span className ="listingEl">{ currListing.offerValidity }</span>
                    </div>
                                        
                </div>
            </div>
            <div className="half left">
            <div className="heading"><h3>Comments</h3><div className="bottom-border"></div></div>
                {
                    messages?Object.keys(messages).map(key=>{
                        if(messages[key].listingId === listings[id].id){
                            return (
                                <div key={key} className="comment-container">
                                    <span className="commenter">Comment by : { messages[key].sender }</span>
                                    <span className="comment">Comment : { messages[key].message }</span>
                                </div>
                            )
                        }
                    }):null
                }
            </div>
            <div className="clear"></div>
        </div>
    )
}

ListedJobDetails.defaultProps = {
    user: {},
    listingsInfo: {},
    genInfo: {}
}

ListedJobDetails.propTypes = {
    user: PropTypes.object.isRequired,
    listingsInfo: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        user: store.user.info,
        listingsInfo: store.listingsInfo.info,
        genInfo: store.genInfo.info,
        messagesInfo: store.messages.info
    }
})(ListedJobDetails);

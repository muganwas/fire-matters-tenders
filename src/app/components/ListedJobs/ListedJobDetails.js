import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './listedJobs.css';

const ListedJobDetails = props=>{
    let { listingsInfo, genInfo, messagesInfo } = props,
    messages = messagesInfo.messages,
    id = listingsInfo.listedJobDetails.currListingId,
    listings = genInfo.generalListings,
    currListing = listings[id];
    return(
        <div className="sub-container">
            <div className="half left">
                <div className="heading"><h3>Required Service: { currListing.serviceRequired } </h3><div className="bottom-border"></div></div>
                <br />
                <div className="information">
                    <div className="el">
                        <h3>Equipment Type</h3>
                        <span className ="listingEl">{ currListing.equipmentType }</span>
                    </div>
                    <div className="el">
                        <h3>Equipment Name</h3>
                        <span className ="listingEl">{ currListing.equipment }</span>
                    </div>
                    <div className="el">
                        <h3>Equipment Quantity</h3>
                        <span className ="listingEl">{ currListing.quantity }</span>
                    </div>
                    <div className="el">
                        <h3>Contract Length</h3>
                        <span className ="listingEl">{ currListing.contractType }</span>
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

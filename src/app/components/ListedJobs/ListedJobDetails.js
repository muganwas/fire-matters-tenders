import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ListedJobDetails = props=>{
    let { listingsInfo, genInfo } = props,
    id = listingsInfo.listedJobDetails.currListingId,
    listings = genInfo.generalListings,
    currListing = listings[id];
    return(
        <div className="sub-container">
            <div className="hanad left">
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
    }
})(ListedJobDetails);

import React from 'react';
import { connect } from 'react-redux';
import './listings.css';
import  { Footer, HeaderMain, SecondarySearch, ListedJobs } from 'components';

import { listingCategories } from 'extras/config';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class Listings extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid listings">
                    <SecondarySearch init="All" selectWidth="160px" dropDownWidth="190px" categoryTitle="searchCategoryListings" categories={ listingCategories } placeholder="Find listings" />
                    <ListedJobs />
                    <div className="clear"></div>
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

Listings.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

Listings.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default Listings;
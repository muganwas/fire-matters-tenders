import React from 'react';
import { connect } from 'react-redux';
import './listings.css';
import { Footer, HeaderMain, SecondarySearch, ListedJobs } from 'components';
import { listingCategories } from 'extras/config';
import { PropTypes } from 'prop-types';
import { dispatchedListingsInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        listingsInfo: store.listingsInfo.info
    }
})
class Listings extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    refinedSearch = (e)=>{
        e.persist();
        let info = {...this.props.listingsInfo},
        keyWords = e.target.value;
        info.filter.keyWords = keyWords;
        this.props.dispatch(dispatchedListingsInfo(info));
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid listings">
                    <SecondarySearch
                        id= "searchListings"
                        init="All" 
                        selectWidth="160px" 
                        dropDownWidth="170px"
                        info = { this.props.listingsInfo }
                        dispatcher = { dispatchedListingsInfo }
                        categoryTitle="searchCategoryListings" 
                        categories={ listingCategories }
                        onChange = { this.refinedSearch }
                        placeholder="Find listings"   
                    />
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
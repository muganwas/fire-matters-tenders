import React from 'react';
import { connect } from 'react-redux';
import './listings.css';
import  { Footer, HeaderMain, SecondarySearch, ListedJobs } from 'components';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from 'extras/helperFunctions';

import { listingCategories } from 'extras/config';

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
                    <SecondarySearch categories={ listingCategories } />
                    <ListedJobs />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Listings;
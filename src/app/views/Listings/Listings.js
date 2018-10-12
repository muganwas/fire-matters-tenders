import React from 'react';
import { connect } from 'react-redux';
import './listings.css';
import  { Footer, HeaderMain, SecondarySearch } from 'components';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from 'extras/helperFunctions';
import axios from 'axios';

import { listingCategories } from 'extras/config';
import { dispatchedGenInfo } from 'extras/dispatchers';

const baseUrl = process.env.BACK_END_URL,
listingsEndPoing = process.env.LISTING_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
export default class Listings extends React.Component {
    constructor(props){
        super(props)
    }
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    componentWillMount(){
        let genInfo = {...this.props.genInfo.info };
        axios.get(baseUrl + listingsEndPoing).then((response)=>{
            //console.log(response.data);
            genInfo.listings = {...response.data};
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }).catch(err=>{
            console.log(err);
        });
    }

    displayListings = (key)=>{
        let listings = this.props.genInfo.info.listings;
        return(
            <div className="listing" key={key} id={ listings[key].id }>
                <span>{ listings[key].city }, { listings[key].state }</span>
                <span>{ listings[key].serviceRequired }, { listings[key].equipment }</span>
                <span>{ listings[key].closingDate}</span>
            </div>
        )
    }
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid listings">
                    <SecondarySearch categories={ listingCategories } />
                    { this.props.genInfo.info.listings?Object.keys(this.props.genInfo.info.listings).map(this.displayListings):null}
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}
import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
//import Image from 'react-image';
import  { Loader, FmButton, MoreHoriz } from 'components';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';

const baseUrl = process.env.BACK_END_URL,
listingsEndPoing = process.env.LISTING_END_POINT;

import './listedJobs.css';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
export default class TendersList extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
        this.fetchListings();
    }

    componentWillMount(){
        this.fetchListings();
    }

    fetchListings = ()=>{
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
            <div className="list-row" key={key} id={ listings[key].id }>
                <span className="twenty">{ listings[key].city }, { listings[key].state }</span>
                <span className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</span>
                <span className="twenty">{ listings[key].closingDate}</span>
                <span className="twenty"><FmButton variant="contained" color="primary" text="Submit Tender" /></span>
                <span className="ten"><MoreHoriz /></span>
                <div className="bottom-border"></div>
            </div>
        )
    }
    render(){
        return(
            <div className="list">
                <div className="list-row header">
                    <span className="twenty">Location</span>
                    <span className="thirty">Description</span>
                    <span className="twenty">Closing Date</span>
                    <span className="twenty"></span>
                    <span className="ten"></span>
                    <div className="bottom-border"></div>
                </div>
                { this.props.genInfo.info.listings?Object.keys(this.props.genInfo.info.listings).map(this.displayListings):<div className="loader"><Loader /></div>}
            </div>
        )
    }
}
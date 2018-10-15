import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz } from 'components';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './listedJobs.css';
import { PropTypes } from 'prop-types';

const baseUrl = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ListedJobs extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
        if(!this.props.genInfo.info.listings)
            this.fetchListings();
    }

    componentDidMount(){
        this.fetchListings();
    }

    fetchListings = ()=>{
        let genInfo = {...this.props.genInfo.info };
        axios.get(baseUrl + listingsEndPoint).then((response)=>{
            //console.log(response.data);
            let listings = genInfo.listings = {...response.data};
            /**Set the more dropdown menu class to hidden for every row*/
            Object.keys(listings).map((key)=>{
                genInfo.listings[key].moreMenuClassName = "hidden";
            })
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }).catch(err=>{
            console.log(err);
        });
    }

    displayListings = (key)=>{
        let listings = this.props.genInfo.info.listings;
        let options = { 1: "View More..."};
        return(
            <div className="list-row" key={key} id={ listings[key].id }>
                <div className="twenty">{ listings[key].city }, { listings[key].state }</div>
                <div className="thirty">{ listings[key].serviceRequired }, { listings[key].equipment }</div>
                <div className="twenty">{ listings[key].closingDate}</div>
                <div className="twenty"><FmButton variant="contained" color="primary" text="Submit Tender" /></div>
                <div className="ten"><MoreHoriz className={ listings[key].moreMenuClassName } id={ key } listName = "listings" element={ listings[key] } options={ options } /></div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let listings = this.props.genInfo.info.listings;
        return(
            <div className="list left hanad">
                <div className="list-row header">
                    <span className="twenty">Location</span>
                    <span className="thirty">Description</span>
                    <span className="twenty">Closing Date</span>
                    <span className="twenty"></span>
                    <span className="ten"></span>
                    <div className="bottom-border"></div>
                </div>
                { listings?Object.keys(listings).map(this.displayListings):<div className="loader"><Loader /></div> }
            </div>
        )
    }
}

ListedJobs.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ListedJobs.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ListedJobs;
import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton } from 'components';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './postedTendersOverlay.css';
import { PropTypes } from 'prop-types';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT;

const styles = {
    button: {
      margin: 2,
      padding: '3px 10px',
      fontSize: 10,
      backgroundColor: "#F79A50",
      '&:hover': {
        background: '#F79A50',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
      }
    },
    input: {
      display: 'none',
    },
}

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

    displayTenders = (key)=>{
        let tenders = this.props.tendersInfo.tenders,
        active = this.props.listingsInfo.postedTenders.overLay.active;
        if(active === tenders[key].listingId){
            return(
                <div key={ key } className="tender-dits">
                    <div className="thirty">{ tenders[key].companyName }</div>
                    <div className="twenty">{ tenders[key].rate }</div>
                    <div className="twenty">{ tenders[key].startDate }</div>
                    <div className="twenty">{ tenders[key].endDate }</div>
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
                            <div className="thirty">Company Name</div>
                            <div className="twenty">Rate</div>
                            <div className="twenty">Start Date</div>
                            <div className="twenty">End Date</div>
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


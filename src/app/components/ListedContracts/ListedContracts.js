import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton, MoreHoriz, PostedTendersOverlay } from 'components';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedListingsInfo, dispatchedUserInfo, dispatchedTendersInfo } from 'extras/dispatchers';
import './listedContracts.css';
import { PropTypes } from 'prop-types';
import { styles, submit_styles } from './styles';
import { TenderForm } from 'forms';
import { listedPostedTendersOptions } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        profileInfo: store.user.info.profileInfo,
        genInfo: store.genInfo,
        tendersInfo: store.tenders.info,
        contractsInfo: store.contracts.info
    }
})
class ListedContracts extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    componentWillMount(){
        /*this.fetchListings().then(res=>{
            if(res === "fetched"){
                this.fetchTenders();
            }
        });*/
    }

    renderContractDetails = ()=>{

    }

    displayContracts = (key)=>{
        let listings = {...this.props.genInfo.generalListings},
        contractInfo = {...this.props.contractsInfo},
        tenders = this.props.tendersInfo.tenders,
        showContractDetails = contractInfo.currentContract.show,
        profileInfo = sessionStorage.getItem('profileInfo'),
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null,
        options = { more: "View More..."};

        if(tenders[key].accepted){
            return(
                <div className="list-row" key={key} id={ tenders[key].id }>
                    {   
                        showContractDetails?
                        <div styles = {submit_styles.trans} className="listedJobsDetails-container">
                            <span
                                className="close right" 
                                onClick={ this.renderListingDetails } 
                                id="close"
                            >
                                &#x2716;
                            </span>
                            <ListedJobDetails />
                        </div>
                        :null
                    }
                    <div className="twenty">{ tenders[key].companyName }</div>
                    <div className="thirty">{ tenders[key].rate }</div>
                    <div className="twenty">{ tenders[key].startDate}</div>
                    <div className="twenty">
                    </div>
                    <div className="ten">
                        <MoreHoriz 
                            className={ tenders[key].moreMenuClassName } 
                            id={ key }
                            autoid = { tenders[key].id }
                            onClick = { this.renderContractDetails}
                            listName = "tenders" 
                            element={ tenders[key] }
                            options={ options }
                        />
                    </div>
                    <div className="bottom-border"></div>
                </div>
            )
        }
    }

    render(){
        let listings = {...this.props.genInfo.info.listings},
        contractsInfo = {...this.props.contractsInfo},
        contracts = {...contractsInfo.contracts},
        tenders = this.props.tendersInfo.tenders,
        contractsCount = Object.keys(tenders).length,
        userType = this.props.profileInfo.userType;
        return(
            <div className="list left hanad">
            {   contractsCount > 0
                ?<div className="list-row header">
                    <span className="twenty">Contract Title</span>
                    <span className="thirty">{ userType === "owner_occupier"?"Contractor":"Company Name" }</span>
                    <span className="twenty">Closing Date</span>
                    <span className="twenty">Contract Status</span>
                    <span className="ten"></span>
                    <div className="bottom-border"></div>
                </div>
                :<div className="list-row header">There is no contract information to display</div>
            }
            { Object.keys(tenders).map(this.displayContracts) }
            </div>
        )
    }
}

ListedContracts.defaultProps = {
    user: {},
    search: {},
    genInfo: {},
    contractsInfo: {}
}

ListedContracts.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    contractsInfo: PropTypes.object
}

export default ListedContracts;
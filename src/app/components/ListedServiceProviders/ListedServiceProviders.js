import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton } from 'components';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './listedServiceProviders.css';
import { PropTypes } from 'prop-types';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT + "?userType=service provider";

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ListedServiceProviders extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
        if(!this.props.genInfo.info.serviceProviders)
            this.fetchServiceProviders();
    }

    fetchServiceProviders = ()=>{
        let genInfo = {...this.props.genInfo.info };
        axios.get(baseUrl + usersEndPoint).then((response)=>{
            //console.log(response.data);
            let serviceProviders = genInfo.serviceProviders = {...response.data};
            Object.keys(serviceProviders).map((key)=>{
                genInfo.serviceProviders[key].moreMenuClassName = "hidden";
            })
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }).catch(err=>{
            console.log(err);
        });
    }

    displayServiceProviders = (key)=>{
        let serviceProviders = this.props.genInfo.info.serviceProviders;
        let categories = this.props.genInfo.info.serviceProviders[key].categoriesOfService;
        return(
            <div className="list-row" key={key} id={ serviceProviders[key].id }>
                <div className="twenty">{ serviceProviders[key].companyName }</div>
                <div className="thirty">{ serviceProviders[key].city }, { serviceProviders[key].state }</div>
                <div className="thirty">
                    { categories?Object.keys(categories).map((newKey)=>{
                        return(
                            <div key={ newKey }>
                                <span className="service">{ categories[newKey] }</span>
                            </div>
                        )
                    }):<div className="tiny-loader"><Loader /></div> }
                </div>
                <div className="twenty"><FmButton variant="contained" color="primary" text="Invite to Tender" /></div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let serviceProviders = this.props.genInfo.info.serviceProviders;
        return(
            <div className="list left seventy5">
                <div className="list-row header">
                    <span className="twenty">Company Name</span>
                    <span className="thirty">Area of Operation</span>
                    <span className="thirty">Categories of Service</span>
                    <span className="twenty"></span>
                    <div className="bottom-border"></div>
                </div>
                { serviceProviders?Object.keys(serviceProviders).map(this.displayServiceProviders):<div className="loader"><Loader /></div> }
            </div>
        )
    }
}

ListedServiceProviders.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ListedServiceProviders.PropTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ListedServiceProviders;


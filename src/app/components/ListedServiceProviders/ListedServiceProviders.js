import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton } from 'components';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './listedServiceProviders.css';
import { PropTypes } from 'prop-types';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT + "?userType=service provider";

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
        serviceProvidersInfo: store.serviceProviders.info
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
        let serviceProviders = this.props.genInfo.info.serviceProviders,
        profileInfo = sessionStorage.getItem('profileInfo'),
        categories = this.props.genInfo.info.serviceProviders[key].categoriesOfService,
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null;

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
                <div className="twenty">{
                    userType === "Owner/Occupier" || !userType
                    ?<FmButton variant="contained" styles={ styles } text="Invite to Tender" />
                    :null 
                    }
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let serviceProviders = this.props.genInfo.info.serviceProviders,
        filter = this.props.serviceProvidersInfo.filter.categoryTitle,
        keyWords = this.props.serviceProvidersInfo.filter.keyWords || " ",
        filtered = {};
        if(serviceProviders){
            Object.keys(serviceProviders).map(key=>{
                keyWords = (keyWords).toLowerCase();
                let companyName = (serviceProviders[key].companyName).toLowerCase(),
                fullName = (serviceProviders[key].fullName).toLowerCase(),
                state = (serviceProviders[key].state).toLowerCase();
                if(serviceProviders[key].state === filter 
                    && (companyName.includes(keyWords)
                        || fullName.includes(keyWords) 
                        || state.includes(keyWords) )){

                    filtered[key] = serviceProviders[key];
                }
            });
        }
        return(
            <div className="list left seventy5">
                <div className="list-row header">
                    <span className="twenty">Company Name</span>
                    <span className="thirty">Area of Operation</span>
                    <span className="thirty">Categories</span>
                    <span className="twenty"></span>
                    <div className="bottom-border"></div>
                </div>
                { 
                    filter
                    ?Object.keys(filtered).map(this.displayServiceProviders)
                    :serviceProviders
                    ?Object.keys(serviceProviders).map(this.displayServiceProviders)
                    :<div className="loader">
                        <Loader />
                    </div> 
                }
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


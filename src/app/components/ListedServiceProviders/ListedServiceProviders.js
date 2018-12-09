import React, { Component } from 'react';
import { connect } from 'react-redux';
import  { Loader, FmButton } from 'components';
import axios from 'axios';
import { dispatchedGenInfo, dispatchedTendersInfo, dispatchedProfileInfo } from 'extras/dispatchers';
import './listedServiceProviders.css';
import { PropTypes } from 'prop-types';
import { InviteToTenderForm } from 'forms';
import { NavLink, withRouter } from 'react-router-dom';
import { styles } from './styles';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT + "?userType=service_provider";

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        profileInfo: store.profile.info,
        inviteToTender: store.tenders.info.inviteToTender,
        tendersInfo: store.tenders.info,
        serviceProvidersInfo: store.serviceProviders.info
    }
})
class ListedServiceProviders extends Component {
    constructor(props){
        super(props)
    }
    
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    componentWillMount(){
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

    goToProfile = (e)=>{
        let id = e.target.id,
        profileInfo = {...this.props.profileInfo},
        currentSP = {},
        genInfo = this.props.genInfo.info,
        serviceProviders = {...genInfo.serviceProviders};
        Object.keys(serviceProviders).map(key=>{
            let currId = serviceProviders[key].id;
            if(currId === id){
                currentSP = {...serviceProviders[key]}
            }
        });
        profileInfo.activeProfile = currentSP;
        this.props.dispatch(dispatchedProfileInfo(profileInfo));
    }

    renderInviteForm = (serviceProviderKey)=>{
        let tendersInfo = {...this.props.tendersInfo},
        serviceProviders = {...this.props.genInfo.info.serviceProviders};
        tendersInfo.inviteToTender.submitButton.text = "Send Invite";
        if(typeof serviceProviderKey === "string"){
            tendersInfo.inviteToTender.sender = "info@fire-matters.com.au";
            tendersInfo.inviteToTender.recipient = serviceProviders[serviceProviderKey].emailAddress;
        }
        tendersInfo.inviteToTender.showForm = !tendersInfo.inviteToTender.showForm;
        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
    }

    dummy = ()=>{
        return new Promise(resolve=>resolve());
    }

    saveInviteMessage = (e)=>{
        let  id = e.target.id,
        tendersInfo = {...this.props.tendersInfo},
        message = e.target.value;
        tendersInfo.inviteToTender.message = message;
        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
    }

    displayServiceProviders = (key)=>{
        let serviceProviders = {...this.props.genInfo.info.serviceProviders},
        tendersInfo = {...this.props.tendersInfo},
        profileInfo = sessionStorage.getItem('profileInfo'),
        feedbackClass = tendersInfo?tendersInfo.inviteToTender.feedbackClass:"hidden",
        categories = this.props.genInfo.info.serviceProviders[key].profile.categoriesOfService,
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null,
        showInviteForm = tendersInfo.inviteToTender.showForm,
        serviceProviderId = serviceProviders[key].id;

        return(
            <div className="list-row" key={key} id={ serviceProviders[key].id }>
            { showInviteForm
            ?<InviteToTenderForm
                dummy={ this.dummy } 
                save = { this.saveInviteMessage } 
                close = { this.renderInviteForm }
             />
            :null }
                <div className="twenty clickable">
                    <NavLink id={ serviceProviders[key].id } onClick = { this.goToProfile } to={`/profilePage:${ serviceProviderId }`}>
                        { serviceProviders[key].companyName }
                    </NavLink>
                </div>
                <div className="thirty">{ serviceProviders[key].city }, { serviceProviders[key].state }</div>
                <div className="thirty">
                    { categories?Object.keys(categories).map((newKey)=>{
                        if(categories[newKey]){
                            return(
                                <div key={ newKey }>
                                    <span className="service">{ newKey }</span>
                                </div>
                            )
                        }
                        
                    }):null }
                </div>
                <div className="twenty">{
                    userType === "owner_occupier" || !userType
                    ?<FmButton variant="contained" styles={ styles } onClick={ ()=>this.renderInviteForm(key) } text="Invite to Tender" />
                    :null 
                    }
                </div>
                <div className="bottom-border"></div>
            </div>
        )
    }

    render(){
        let serviceProviders = this.props.genInfo.info.serviceProviders,
        tendersInfo = this.props.tendersInfo,
        filter = this.props.serviceProvidersInfo.filter.categoryTitle,
        serviceProviderInfo = this.props.serviceProvidersInfo,
        secondaryFilters = serviceProviderInfo?serviceProviderInfo.signupInfo:{},
        secondaryFilterLenArr = [],
        keyWords = this.props.serviceProvidersInfo.filter.keyWords || "",
        keyWordsLen = keyWords.length,
        filtered = {},
        filteredNext = {},
        filteredNextNext = {};

        Object.keys(secondaryFilters).map(key=>{
            if(secondaryFilters[key] === true)
                secondaryFilterLenArr.push(key);  
        });
        
        let secondaryFilterLen = secondaryFilterLenArr.length;
        if(serviceProviders){
            Object.keys(serviceProviders).map(key=>{
                if(
                    serviceProviders[key].state === filter                  
                ){
                    filtered[key] = serviceProviders[key];
                }
            });
            keyWords = (keyWords).toLowerCase();
            let filteredLen = Object.keys(filtered).length;
            filtered = filteredLen > 0?filtered:serviceProviders;
            Object.keys(filtered).map(key=>{
                let companyName = (serviceProviders[key].companyName).toLowerCase(),
                fullName = (serviceProviders[key].fullName).toLowerCase(),
                city = (serviceProviders[key].city).toLowerCase();
                if(
                    companyName.includes(keyWords)
                    || fullName.includes(keyWords) 
                    || city.includes(keyWords) 
                ){
                    filteredNext[key] = filtered[key];
                }
            });
            filteredNext = keyWordsLen > 0?filteredNext:filtered;
            if(secondaryFilterLen > 0){
                Object.keys(secondaryFilters).map(key=>{
                    let currFilter = key,
                    currFilterVal = secondaryFilters[key];
                    Object.keys(filteredNext).map(key1=>{
                        let currSP = filteredNext[key1],
                        categoriesOfService = currSP.profile.categoriesOfService,
                        categoriesOfServiceLen = [];

                        Object.keys(categoriesOfService).map(altKey=>{
                            if(categoriesOfService[altKey]){
                                categoriesOfServiceLen.push(altKey);
                            }
                        });

                        if(categoriesOfServiceLen.length > 0){
                            Object.keys(categoriesOfService).map(key2=>{
                                let currCategory = key2;
                                if(currCategory === currFilter && currFilterVal && categoriesOfService[key2]){
                                    filteredNextNext[key1] = currSP;
                                }
                            })
                        }
                    });             
                });
            }
            filteredNextNext = secondaryFilterLen >0?filteredNextNext:filteredNext;
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
                    filter || keyWordsLen > 0 || secondaryFilterLen > 0
                    ?Object.keys(filteredNextNext).map(this.displayServiceProviders)
                    :serviceProviders && tendersInfo
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

export default withRouter(ListedServiceProviders);


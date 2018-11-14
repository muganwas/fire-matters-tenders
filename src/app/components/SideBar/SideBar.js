import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ProfileImage } from 'components';
import { dispatchedGenInfo } from 'extras/dispatchers';
import axios from 'axios';
import './sideBar.css';
import { ownerOccupierOptions, serviceProviderOptions, menuIconTitles } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT;

@connect((store)=>{
    return {
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        profileInfo: store.user.info.profileInfo,
    }
})
class SideBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let userType = (JSON.parse(sessionStorage.getItem('loginSession'))).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "Owner/Occupier" || userType === "owner-occupier" || userType === "owner_occupier"){
            genInfo.defaultProps.sideBarOptions = ownerOccupierOptions;
            genInfo.defaultProps.leftMenuClass = "left-menu oo";
            genInfo.defaultProps.sideBarClass = "side-bar oo";
        }else{
            genInfo.defaultProps.sideBarOptions = serviceProviderOptions;
            genInfo.defaultProps.leftMenuClass = "left-menu sp";
            genInfo.defaultProps.sideBarClass = "side-bar sp";
        }
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    componentDidMount(){
        this.fetchListings();
    }

    fetchListings = ()=>{
        let genInfo = {...this.props.genInfo },
        userType = (JSON.parse(sessionStorage.getItem('loginSession')).userType).toLowerCase(),
        userEmail = JSON.parse(sessionStorage.getItem('loginSession')).emailAddress;
        if(userType){
            if(userType !== "owner/occupier"){
                axios.get(baseURL + listingsEndPoint).then((response)=>{
                    //console.log(response.data);
                    let listings = genInfo.listings = {...response.data};
                    genInfo.sideBar.profilePage.listCount['tenders'] = (response.data).length;
                    /**Set the more dropdown menu class to hidden for every row*/
                    Object.keys(listings).map((key)=>{
                        genInfo.listings[key].moreMenuClassName = "hidden";
                    })
                    this.props.dispatch(dispatchedGenInfo(genInfo));
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                axios.get(baseURL + listingsEndPoint + "?userEmail=" + userEmail).then((response)=>{
                    //console.log(response.data);
                    let listings = genInfo.listings = {...response.data};
                    genInfo.sideBar.profilePage.listCount['tenders'] = (response.data).length;
                    /**Set the more dropdown menu class to hidden for every row*/
                    Object.keys(listings).map((key)=>{
                        genInfo.listings[key].moreMenuClassName = "hidden";
                    })
                    this.props.dispatch(dispatchedGenInfo(genInfo));
                }).catch(err=>{
                    console.log(err);
                });            
            }
        }  
    }

    removeSelcected = ()=>{
        return new Promise((resolve, reject)=>{
            document.getElementById('left-menu').getElementById('selected').className = "selected";
            resolve("removed");
        });  
    }

    select = (e)=>{
        let id = e.target.id,
        genInfo = {...this.props.genInfo},
        sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions;
        id = !id?e.target.getAttribute('name'):id;
        document.getElementById(id).className="selected";
        setTimeout(()=>{
            Object.keys(sideBarOptions).map(key=>{
                if(key === id){
                    genInfo.sideBar.currentTab = key;
                    this.props.dispatch(dispatchedGenInfo(genInfo));
                    document.getElementById(key).className="selected";
                }else
                    document.getElementById(key).className="";        
            });
        }, 20);      
    }

    clickParent=(e)=>{
        let name = e.target.getAttribute('name');
        console.log(e.target.id)
        document.getElementById(name).click();
    }

    doNothing = (e)=>{
        e.preventDefault();
    }

    menuItems = (key)=>{
        let sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions,
        selected = this.props.genInfo.sideBar.currentTab,
        tendersCount = this.props.genInfo.sideBar.profilePage.listCount.tenders,
        contractCount = this.props.genInfo.sideBar.profilePage.listCount.contracts || 0;
        return(
            <span name="menuItems" className = { key===selected?"selected":""} id={ key } onClick={ this.select } key={ key }>
                <div name={ key} onClick={ this.clickParent }>
                    <i name={ key } onClick={ this.clickParent } className="material-icons left">{ menuIconTitles[key]}</i>
                    <div name={ key } onClick={ this.clickParent } className="item left">{ sideBarOptions[key] }</div>
                    <div 
                        name={ key }
                        onClick={ this.clickParent }
                        className="left"
                    >
                    { key === "Tenders"
                    ?<div 
                        name={ key }
                        className="listingsCount"
                        onClick={ this.clickParent }
                    >{ tendersCount }</div>
                    : key==="Contracts"
                    ?<div 
                        name={ key }
                        className="listingsCount"
                        onClick={ this.clickParent }
                    >{contractCount}</div>
                    :null }</div>
                </div>
                <div className = "clear"></div>
            </span>
        )
    }
    render(){
        let userName = (JSON.parse(sessionStorage.getItem('loginSession'))).fullName,
        sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions,
        sideBarClass = this.props.genInfo.defaultProps.sideBarClass,
        leftMenuClass = this.props.genInfo.defaultProps.leftMenuClass;
        return(
            <div className={ sideBarClass }>
                <ProfileImage />
                <span id="greeting">Hi, { userName }</span>
                <div id="left-menu" className={ leftMenuClass }>
                    { Object.keys(sideBarOptions).map(this.menuItems) }
                </div>
            </div>
        )
    }
}

SideBar.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SideBar.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default withRouter(SideBar);
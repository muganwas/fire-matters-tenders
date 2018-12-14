import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ProfileImage } from 'components';
import { 
    dispatchedMessagesInfo, 
    dispatchedGenInfo, 
    dispatchedListingsInfo, 
    dispatchedTendersInfo, 
    dispatchedSubContractorsInfo, 
    dispatchedSitesInfo 
} from 'extras/dispatchers';
import axios from 'axios';
import './sideBar.css';
import { ownerOccupierOptions, serviceProviderOptions, menuIconTitles } from 'extras/config';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT,
sitesEndPoint = process.env.SITES_END_POINT,
messagesEndPoint = process.env.MESSAGES_END_POINT,
subContractorsEndPoint = process.env.SUB_CONTRACTORS_END_POINT;

@connect((store)=>{
    return {
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        profileInfo: store.user.info.profileInfo,
        siteData: store.user.info.submitSite,
        listingsInfo: store.listingsInfo.info,
        sitesInfo: store.sites.info,
        tendersInfo: store.tenders.info,
        messagesInfo: store.messages.info,
        messageData: store.user.info.submitMessage,
        subContractorData: store.user.info.addSubContractor,
        subContractorsInfo: store.subContractors.info
    }
})
class SideBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        let userType = (JSON.parse(sessionStorage.getItem('loginSession'))).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "owner_occupier" || userType === "owner-occupier" || userType === "owner_occupier"){
            genInfo.defaultProps.sideBarOptions = ownerOccupierOptions;
            genInfo.defaultProps.leftMenuClass = "left-menu oo";
            genInfo.defaultProps.sideBarClass = "side-bar oo";
        }else{
            genInfo.defaultProps.sideBarOptions = serviceProviderOptions;
            genInfo.defaultProps.leftMenuClass = "left-menu sp";
            genInfo.defaultProps.sideBarClass = "side-bar sp";
        }

        this.fetchListings().then(res=>{
            if(res){
                this.fetchTenders();
                this.fetchSites();
                this.fetchSubContractors();
            }
        });
        
        this.fetchSentMessages().then(res=>{
            if(res)
                this.fetchRecievedMessages();
        });
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    fetchSentMessages = ()=>{
        return new Promise(resolve=>{
            let messagesInfo = { ...this.props.messagesInfo },
            genInfo = { ...this.props.genInfo },
            userEmail = (JSON.parse(sessionStorage.getItem("profileInfo"))).emailAddress,
            url = baseURL + messagesEndPoint + "?sender=" + userEmail;
            axios.get(url).then((response)=>{
                //console.log(response.data);
                let sentMessages = messagesInfo.sentMessages = genInfo.sentMessages = {...response.data};
                genInfo.sideBar.profilePage.listCount['sentMessages'] = (response.data).length;
                /**Set the more dropdown menu class to hidden for every row*/
                Object.keys(sentMessages).map((key)=>{
                    messagesInfo.sentMessages[key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedMessagesInfo(messagesInfo));
                resolve("fetched");
            }).catch(err=>{
                console.log(err);
            });
        });    
    }

    fetchRecievedMessages = ()=>{
        return new Promise(resolve=>{
            let messagesInfo = {...this.props.messagesInfo },
            genInfo = { ...this.props.genInfo },
            userEmail = (JSON.parse(sessionStorage.getItem("profileInfo"))).emailAddress,
            url = baseURL + messagesEndPoint + "?recipient=" + userEmail;
            axios.get(url).then((response)=>{
                //console.log(response.data);
                let recievedMessages = messagesInfo.recievedMessages = genInfo.recievedMessages = {...response.data};
                genInfo.sideBar.profilePage.listCount['recievedMessages'] = (response.data).length;
                /**Set the more dropdown menu class to hidden for every row*/
                Object.keys(recievedMessages).map((key)=>{
                    messagesInfo.recievedMessages[key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedMessagesInfo(messagesInfo));
                resolve("fetched");
            }).catch(err=>{
                console.log(err);
            });
        });
    }

    fetchSubContractors = ()=>{
        return new Promise(resolve=>{
            let mainUserId = (JSON.parse(sessionStorage.getItem("profileInfo"))).id,
            url = baseURL + subContractorsEndPoint + "?mainUserId=" + mainUserId;
            axios.get(url).then((response)=>{
                //console.log(response.data);
                if(response){
                    let genInfo = { ...this.props.genInfo },
                    subContractorInfo = {...this.props.subContractorsInfo };
                    let subContractors = subContractorInfo.subContractors = {...response.data};
                    genInfo.sideBar.profilePage.listCount['subContractors'] = (response.data).length;
                    genInfo.subContractors = {...response.data};
                    /**Set the more dropdown menu class to hidden for every row*/
                    Object.keys(subContractors).map((key)=>{
                        subContractorInfo.subContractors[key].moreMenuClassName = "hidden";
                    });
                    this.props.dispatch(dispatchedSubContractorsInfo(subContractorInfo));
                    resolve(genInfo);
                }     
            }).catch(err=>{
                console.log(err);
            });
        });
    }

    fetchSites = ()=>{
        return new Promise(resolve=>{
            let sitesInfo = {...this.props.sitesInfo },
            genInfo = { ...this.props.genInfo },
            userType = (JSON.parse(sessionStorage.getItem("profileInfo"))).userType,
            userEmail = (JSON.parse(sessionStorage.getItem("profileInfo"))).emailAddress,
            url = baseURL + sitesEndPoint + "?emailAddress=" + userEmail;
            if(userType){
                if(userType === "owner_occupier"){
                    axios.get(url).then((response)=>{
                        //console.log(response.data);
                        let sites = sitesInfo.sites = genInfo.sites = {...response.data};
                        genInfo.sideBar.profilePage.listCount['sites'] = (response.data).length;
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(sites).map((key)=>{
                            sitesInfo.sites[key].moreMenuClassName = "hidden";
                        })
                        this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                        //this.props.dispatch(dispatchedGenInfo(genInfo));
                        resolve("fetched");
                    }).catch(err=>{
                        console.log(err);
                    });
                }
            }
        });    
    }

    fetchTenders = ()=>{
        let postInfoUrl = baseURL + tenderEndPoint,
        genInfo = {...this.props.genInfo },
        userType = (JSON.parse(sessionStorage.getItem("profileInfo")).userType).toLowerCase(),
        postedTendersComprehensive = [],
        postedTenders = [];
        if(userType){
            if(userType === "owner_occupier"){
                let listings = genInfo.listings;
                axios.get(postInfoUrl).then(res=>{
                    let tendersArr = res.data,
                    tendersLen = tendersArr.length;
                    for(let count = 0;count <tendersLen; count++){
                        let currObj = tendersArr[count],
                        listingId = currObj.listingId;
                        currObj.acceptTenderButton = { isActive: true };
                        Object.keys(listings).map(key=>{
                            if(listingId === listings[key].id){
                                let cO = {tenderId:currObj.id, listingId: listingId, acceptTenderButton:{isActive:true}};
                                postedTendersComprehensive.push(currObj);
                                postedTenders.push(cO);
                            }
                        });
                    }
                });
                let listingsInfo = {...this.props.listingsInfo},
                tendersInfo = {...this.props.tendersInfo};
                listingsInfo.postedTenders.tenders = postedTenders;
                tendersInfo.tenders = postedTendersComprehensive;
                this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                this.props.dispatch(dispatchedListingsInfo(listingsInfo));
                this.forceUpdate();
            }else{
                let tendererId = JSON.parse(sessionStorage.getItem('profileInfo')).id,
                genInfo = {...this.props.genInfo},
                tendersInfo = {...this.props.tendersInfo},
                getInfoUrl = baseURL + tenderEndPoint + "?tendererId=" + tendererId;
                axios.get(getInfoUrl).then(res=>{
                    if(res){
                        tendersInfo.tenders = res.data;
                        Object.keys(tendersInfo.tenders).map((key)=>{
                            tendersInfo.tenders[key].moreMenuClassName = "hidden";
                        });
                        tendersInfo.tenders = res.data;
                        genInfo.sideBar.profilePage.listCount['tenders'] = (res.data).length
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                    }
                }); 
            }
        }
    }

    fetchListings = ()=>{
        return new Promise(resolve=>{
            let genInfo = {...this.props.genInfo },
            loginSession = sessionStorage.getItem('loginSession'),
            userType = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).userType:undefined,
            userEmail = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).emailAddress:undefined;
            if(userType){
                if(userType !== "owner_occupier"){
                    axios.get(baseURL + listingsEndPoint).then((response)=>{
                        //console.log(response.data);
                        let listings = genInfo.listings = {...response.data};
                        /**Set the more dropdown menu class to hidden for every row*/
                        Object.keys(listings).map((key)=>{
                            genInfo.listings[key].moreMenuClassName = "hidden";
                        })
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        resolve("fetched");
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
                        resolve("fetched");
                    }).catch(err=>{
                        console.log(err);
                    });            
                }
            }else{
                axios.get(baseURL + listingsEndPoint).then((response)=>{
                    //console.log(response.data);
                    let listings = genInfo.listings = {...response.data};
                    /**Set the more dropdown menu class to hidden for every row*/
                    Object.keys(listings).map((key)=>{
                        genInfo.listings[key].moreMenuClassName = "hidden";
                    })
                    this.props.dispatch(dispatchedGenInfo(genInfo));
                    resolve("fetched");
                }).catch(err=>{
                    console.log(err);
                });
            }
        });
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
        document.getElementById(name).click();
    }

    doNothing = (e)=>{
        e.preventDefault();
    }

    menuItems = (key)=>{
        let sideBarOptions = this.props.genInfo.defaultProps.sideBarOptions,
        selected = this.props.genInfo.sideBar.currentTab,
        tendersCount = this.props.genInfo.sideBar.profilePage.listCount.tenders || 0,
        contractCount = this.props.genInfo.sideBar.profilePage.listCount.contracts || 0,
        sitesCount = this.props.genInfo.sideBar.profilePage.listCount.sites || 0,
        messagesCount = (parseInt(this.props.genInfo.sideBar.profilePage.listCount.sentMessages) + parseInt(this.props.genInfo.sideBar.profilePage.listCount.recievedMessages)) || 0,
        subContractorCount = this.props.genInfo.sideBar.profilePage.listCount.subContractors || 0;
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
                    :key==="Sites"
                    ?<div 
                        name = { key }
                        className="listingsCount"
                        onClick={ this.clickParent }
                    >{ sitesCount }</div>
                    :key==="Messages"
                    ?<div 
                        name={ key }
                        className="listingsCount"
                        onClick={ this.clickParent }
                    >{messagesCount}</div>
                    :key==="Subcontractors"?
                    <div 
                        name={ key }
                        className="listingsCount"
                        onClick={ this.clickParent }
                    >{subContractorCount}</div>
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
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Image from 'react-image';
import { SocialIcon } from 'react-social-icons';
import { NavLink, withRouter } from 'react-router-dom';
import { 
    dispatchedSearchInfo, 
    dispatchedGenInfo,
    dispatchedSitesInfo, 
    dispatchedTendersInfo,
    dispatchedListingsInfo,
    dispatchedSubContractorsInfo,
    dispatchedContractsInfo,
    dispatchedUserInfo,
    dispatchedProfileInfo
} from 'extras/dispatchers';
import { SearchInput } from 'components';
import { Lock } from '@material-ui/icons';
import axios from 'axios';
import './headerMain.css';
import { PropTypes } from 'prop-types';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT,
sitesEndPoint = process.env.SITES_END_POINT;

class HeaderMain extends Component {
    constructor(props){
        super(props)
    }
    
    componentDidMount = ()=>{
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();  
    }

    componentWillUnmount = () => {  
        window.removeEventListener("resize", this.updateDimensions);        
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }

    componentWillMount(){
        if(sessionStorage.getItem('loginSession')){
            let genInfo = {...this.props.genInfo},
            loginSession = JSON.parse(sessionStorage.getItem('loginSession')),
            userId = loginSession.userId;
            genInfo.alternatingNavigation.home = '/userPage:'+ userId;  
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }
        let listings = this.props.genInfo.listings,
        genListings = this.props.genInfo.generalListings,
        genListingsLen = genListings?Object.keys(genListings).length:0,
        listingsLen = listings?Object.keys(listings).length:0;
        if(sessionStorage.getItem('loginSession') && (!listings || listingsLen === 0)){
            this.fetchListings().then(res=>{
                if(res){
                    genListingsLen ===0?this.fetchGenListings():null;
                    this.fetchTenders();
                    this.fetchSites();
                }
            });
        }else if(!genListings || genListingsLen === 0){
            this.fetchGenListings().then(res=>{
                if(res){
                    this.fetchTenders();
                    this.fetchSites();
                }
            })
        }
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    
    updateDimensions = ()=>{
        let winWidth = window.innerWidth,
        info = {...this.props.genInfo};
        if(winWidth >= 680){
            info['menu'] = "Main-Menu";
        }else{
            info['menu'] = "Mobile-Menu";
        }
        let profileInfo = {...this.props.realProfileInfo};
        profileInfo.visualProps.windowWidth = winWidth;
        if(winWidth >= 1150){
            
            profileInfo.visualProps.columnClass = "half left"
        }else{
            profileInfo.visualProps.columnClass = "hanad left";
        }
        this.props.dispatch(dispatchedProfileInfo(profileInfo));
        this.props.dispatch(dispatchedGenInfo(info));
    }

    search = (event)=>{
        let searchTerm = event.target.value;
        let searchInfo = { ...this.props.searchInfo };
        searchInfo['searchTerm'] = searchTerm;
        this.props.dispatch(dispatchedSearchInfo(searchInfo));
    }

    toggleMenu = ()=>{
        let info = {...this.props.genInfo};
        let currClassName = info.menu;
        if(currClassName === "Mobile-Menu"){
            info['menu'] = "Mobile-Menu shown";
        }else if(currClassName === "Mobile-Menu shown"){
            info['menu'] = "Mobile-Menu";
        }else{
            info['menu'] = currClassName;
        }
        this.props.dispatch(dispatchedGenInfo(info));
    }

    logOut = ()=>{
        let info = {...this.props.genInfo};
        info.alternatingNavigation.home = "/home";
        info.alternatingNavigation.headerClass = "App-header";
        sessionStorage.removeItem('profileInfo');
        sessionStorage.removeItem('loginSession');
        //this.props.dispatch(dispatchedGenInfo(info));
        let dispatchers = {
            dispatchedSearchInfo, 
            dispatchedGenInfo,
            dispatchedSitesInfo, 
            dispatchedTendersInfo,
            dispatchedContractsInfo,
            dispatchedSubContractorsInfo,
            dispatchedListingsInfo,
            dispatchedUserInfo
        };
        Object.keys(dispatchers).map(key=>{
            setTimeout(()=>{
                this.props.dispatch(dispatchers[key]('logout'));
            }, 50);
        });
        this.forceUpdate();
        //this.props.dispatch(dispatchedUserInfo("logout"));
        //this.props.dispatch(dispatchedGenInfo("logout"));
        this.props.history.push('/');
    }

    socialIcons = 
                <div className="social-icons">
                    <SocialIcon url="https://facebook.com/" style={{ height: 25, width: 25, margin: 5 }} color="#475992"/>
                    <SocialIcon url="https://twitter.com/" style={{ height: 25, width: 25, margin: 5  }} color="#75A8E9"/>
                    <SocialIcon url="https://linkedin.com/" style={{ height: 25, width: 25, margin: 5  }} color="#0077B5"/>
                    <SocialIcon url="https://google.com/" style={{ height: 25, width: 25, margin: 5  }} color="#dd4b39"/>
                </div>;

    loggeInOptions = 
                <div className="signup-login"> 
                    <span className="logout" onClick={ this.logOut }>
                        <Lock className="icon" />
                        <span id="btn-text">Log out</span>
                    </span>
                </div>;
    NotLoggedInOptions =
                <div className="signup-login">
                    <NavLink className="signup" onClick={ this.toggleMenu } to={`/signup`}>Sign up</NavLink><span className="div">&#124;</span>
                    <NavLink onClick={ this.toggleMenu } to={`/login`}>Login</NavLink>
                </div>;
    toggleActive = (link)=>{
        console.log(link);
        return false;       
    }

    fetchSites = ()=>{
        return new Promise(resolve=>{
            let loginSession = sessionStorage.getItem('loginSession'),
            userType = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).userType:undefined,
            userEmail = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).emailAddress:undefined,
            url = baseURL + sitesEndPoint + "?emailAddress=" + userEmail,
            genSitesURL = baseURL + sitesEndPoint;

            axios.get(genSitesURL).then(res=>{
                let sitesInfo = {...this.props.sitesInfo },
                genInfo = { ...this.props.genInfo };
                if(res.data.length > 0){
                    sitesInfo.genSites = {...res.data};
                    this.props.dispatch(dispatchedSitesInfo(sitesInfo));
                }
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
            }).catch(err=>{
                console.log(err)
            });
        });    
    }

    fetchTenders = ()=>{
        let postInfoUrl = baseURL + tenderEndPoint,
        contractCount = [],
        loginSession = sessionStorage.getItem('loginSession'),
        userType = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).userType:undefined,
        postedTendersComprehensive = [],
        postedTenders = [];
        if(userType){
            if(userType === "owner_occupier"){
                axios.get(postInfoUrl).then(res=>{
                    let tendersArr = res.data,
                    genInfo = {...this.props.genInfo },
                    listings = genInfo.listings,
                    tendersLen = tendersArr.length;
                    for(let count = 0;count <tendersLen; count++){
                        let currObj = tendersArr[count],
                        listingId = currObj.listingId;
                        currObj.acceptTenderButton = { isActive: true };
                        currObj.moreMenuClassName = "hidden";
                        Object.keys(listings).map(key=>{
                            if(listingId === listings[key].id){
                                let cO = {tenderId:currObj.id, listingId: listingId, acceptTenderButton:{isActive:true}};
                                postedTendersComprehensive.push(currObj);
                                postedTenders.push(cO);
                                if(tendersArr[count].accepted){
                                    contractCount.push(count);
                                }
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
                getInfoUrl = baseURL + tenderEndPoint + "?tendererId=" + tendererId;
                axios.get(getInfoUrl).then(res=>{
                    let genInfo = {...this.props.genInfo},
                    tendersInfo = {...this.props.tendersInfo};
                    if(res){
                        tendersInfo.tenders = res.data;
                        Object.keys(tendersInfo.tenders).map((key)=>{
                            if(tendersInfo.tenders[key].accepted){
                                console.log("accepted")
                            }
                            tendersInfo.tenders[key].moreMenuClassName = "hidden";
                        });
                        tendersInfo.tenders = res.data;
                        genInfo.sideBar.profilePage.listCount['tenders'] = (res.data).length
                        this.props.dispatch(dispatchedGenInfo(genInfo));
                        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
                    }
                }); 
            }
        }else{
            let genInfo = {...this.props.genInfo },
            listings = genInfo.generalListings;
            axios.get(postInfoUrl).then(res=>{
                let tendersArr = res.data,
                tendersLen = tendersArr.length;
                for(let count = 0;count <tendersLen; count++){
                    let currObj = tendersArr[count],
                    listingId = currObj.listingId;
                    Object.keys(listings).map(key=>{
                        if(listingId === listings[key].id){
                            let cO = {tenderId:currObj.id, listingId: listingId};
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
        }
    }

    fetchListings = ()=>{
        return new Promise(resolve=>{
            let loginSession = sessionStorage.getItem('loginSession'),
            userType = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).userType:undefined,
            userEmail = loginSession?JSON.parse(sessionStorage.getItem('loginSession')).emailAddress:undefined;
            if(userType){
                if(userType !== "owner_occupier"){
                    axios.get(baseURL + listingsEndPoint).then((response)=>{
                        let genInfo = {...this.props.genInfo };
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
                        let genInfo = {...this.props.genInfo };
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
                    let genInfo = {...this.props.genInfo };
                    let listings = genInfo.generalListings = {...response.data};
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

    fetchGenListings = ()=>{
        return new Promise(resolve=>{ 
            axios.get(baseURL + listingsEndPoint).then((response)=>{
                //console.log(response.data);
                let genInfo = {...this.props.genInfo };
                let listings = genInfo.generalListings = {...response.data};
                /**Set the more dropdown menu class to hidden for every row*/
                Object.keys(listings).map((key)=>{
                    genInfo.generalListings[key].moreMenuClassName = "hidden";
                })
                this.props.dispatch(dispatchedGenInfo(genInfo));
                resolve("fetched");
            }).catch(err=>{
                console.log(err);
            });
        }); 
    }

    searchTenders=(searchTerm)=>{
        let tendersInfo = {...this.props.tendersInfo},
        includedInfo = {},
        tenders = tendersInfo.tenders,
        tendersLen = tenders?tenders.length:0;
        return new Promise(resolve=>{
            for(let count = 0; count < tendersLen; count++){
                let currTender = tenders[count];
                Object.keys(currTender).map(key=>{
                    let currEl = (currTender[key]).toString();
                    if(currEl.includes(searchTerm)){
                        includedInfo[count] = currTender;
                    } 
                });
            }
            resolve(includedInfo);
        });
    }

    searchListings=(searchTerm)=>{
        return new Promise(resolve=>{
            let genInfo = {...this.props.genInfo},
            includedInfo = {},
            listings = genInfo.listings,
            listingsLen = listings !== undefined?Object.keys(listings).length:0;
            for(let count = 0; count < listingsLen; count++){
                let currListing = listings[count];
                Object.keys(currListing).map(key=>{
                    let currEl = (currListing[key]).toString();
                    if(currEl.includes(searchTerm)){
                        includedInfo[count] = currListing;
                    } 
                });
            }
            resolve(includedInfo);
        });
    }

    searchSite = (term)=>{
        return new Promise(resolve=>{
            let searchInfo = {...this.props.searchInfo};
            searchInfo.mainSearch.searchTerm = term;
            this.props.dispatch(dispatchedSearchInfo(searchInfo));
            if(term){
                if(term.length > 0){
                this.searchTenders(term).then(res=>{
                    this.searchListings(term).then(res1=>{
                        searchInfo.mainSearch.results = {...res, ...res1};
                    });
                });
                }else{
                    searchInfo.mainSearch.results = {};
                }
                this.props.dispatch(dispatchedSearchInfo(searchInfo));
                resolve(term);
            }            
        });                        
    }

    render(){
        let winWidth = window.innerWidth,
        loginDirection = "right";
        if(winWidth <= 680){
            loginDirection = "left";
        }
        let home = this.props.navigation.home,
        profileInfo = sessionStorage.getItem('profileInfo'),
        userType = profileInfo?JSON.parse(sessionStorage.getItem('profileInfo')).userType: null;
        return(
            <div className={ this.props.navigation.headerClass }>
                <Image className="App-logo" src={require('images/logo.jpg')} />
                <SearchInput 
                    className="search" 
                    placeholder="search" 
                    search={ this.searchSite } 
                />
                <i class="material-icons menu-icon" onClick={ this.toggleMenu }>menu</i>
                <div className={ this.props.genInfo.menu }>
                    <NavLink activeClassName="active" id="home" onClick={ this.toggleMenu } to={ home }>Home</NavLink>
                    { userType !== "owner_occupier" || userType === null
                    ?<NavLink activeClassName="active" id="listings" onClick={ this.toggleMenu } to={`/listings`}>Listings</NavLink>
                    :null }
                    { userType === "owner_occupier" || userType === null?
                    <NavLink activeClassName="active" id="service-providers" onClick={ this.toggleMenu } to={`/service-providers`}>Service Providers</NavLink>
                    :null
                    }
                    <NavLink activeClassName="active" id="about" onClick={ this.toggleMenu } to={`/about`}>About</NavLink>
                    <NavLink activeClassName="active" id="contact" onClick={ this.toggleMenu } to={`/contact`}>Contact</NavLink>
                    <div className= { 'login-social ' + loginDirection }>
                        { /*this.socialIcons*/ }
                        { sessionStorage.getItem('loginSession')?this.loggeInOptions:this.NotLoggedInOptions }
                    </div>                   
                </div>
            </div>
        )
    }
}

HeaderMain.defaultProps = {
    search: {},
    user: {},
    genInfo: {},
    profileInfo: {}
}

HeaderMain.propTypes = {
    search: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    profileInfo: PropTypes.object
}

export default connect(store=>{
    return {
        searchInfo: store.search.info,
        user: store.user,
        realProfileInfo: store.profile.info,
        profileInfo: store.user.info.profileInfo,
        tendersInfo: store.tenders.info,
        navigation: store.genInfo.info.alternatingNavigation,
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        siteData: store.user.info.submitSite,
        listingsInfo: store.listingsInfo.info,
        sitesInfo: store.sites.info,
        messagesInfo: store.messages.info,
        messageData: store.user.info.submitMessage,
        subContractorData: store.user.info.addSubContractor,
        serviceProvidersInfo: store.serviceProviders.info,
        subContractorsInfo: store.subContractors.info
    }
})(withRouter(HeaderMain));
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './contractsTab.css'
import { ListedContracts } from 'components';

const styles = {
    button: {
        float: "right",
        margin: 0,
        padding: "3px 10px",
        margin: "0 5px",
        fontSize: 10,
        backgroundColor: "#ED2431",
        color: "#fff",
        fontWeight: "bold",
        '&:hover': {
        background: '#ED2431',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
        }
    },
    el:{
        display: "inline-block",
        margin: "0 20%"
    },
    information:{
        textAlign: "center"
    },
},
submit_styles = {
    button: {
        float: "right",
        margin: 0,
        padding: "3px 10px",
        margin: "0 5px",
        width: 330,
        fontSize: 14,
        backgroundColor: "#ED2431",
        color: "#fff",
        fontWeight: "bold",
        '&:hover': {
        background: '#ED2431',
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
        }
    },
    inputErr:{
        width: 330,
        display: "block",
        margin: "3px",
        padding: "5px"
    },
    el:{
        display: "inline-block",
        margin: "0 20%"
    },
    information:{
        textAlign: "center"
    },
},
alt_styles = {
    button: {
        float: "right",
        margin: 0,
        padding: "3px 10px",
        margin: "0 0 0 5px",
        fontSize: 10,
        color: "#000",
        fontWeight: "bold",
        '&:hover': {
        boxShadow: '1px 2px 4px #BC2902',
        transition: 'all 0.2s ease-in'
        }
    },
},
baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        listingsData: store.user.info.createListing,
        profileInfo: store.user.info.profileInfo,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
    }
})
class ContractsTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        this.fetchContracts();
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }


    fetchContracts = ()=>{
        return new Promise(resolve=>{
            let genInfo = {...this.props.genInfo },
            userType = (this.props.profileInfo.userType).toLowerCase(),
            userEmail = this.props.profileInfo.emailAddress;
            if(userType){
                if(userType !== "owner_occupier"){
                    axios.get(baseURL + listingsEndPoint).then((response)=>{
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
            }
        });    
    }

    render(){
        return(
            <div className="tenders main-content">
                <ListedContracts />
            </div>
        )
    }
}

ContractsTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ContractsTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ContractsTab;
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './contractsTab.css'
import { ListedContracts } from 'components';

const baseURL = process.env.BACK_END_URL,
listingsEndPoint = process.env.LISTING_END_POINT,
tenderEndPoint = process.env.TENDERS_END_POINT;

@connect((store)=>{
    return {
        user: store.user.info,
        profileInfo: store.user.info.profileInfo,
        search: store.search,
        genInfo: store.genInfo.info,
        tendersInfo: store.tenders.info
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
                        //genInfo.sideBar.profilePage.listCount['contracts'] = (response.data).length;
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
                        //genInfo.sideBar.profilePage.listCount['contracts'] = (response.data).length;
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
                <div className="title-bar">
                    <span id="title">Contracts</span>
                </div>
                
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
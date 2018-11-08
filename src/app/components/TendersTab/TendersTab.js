import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedGenInfo, dispatchedListingsInfo } from 'extras/dispatchers';
import './tendersTab.css'
import { Textfield, DropDown, SearchInput, FmButton } from 'components';
import { ownerOccupierProfileTabs, serviceProviderProfileTabs } from 'extras/config';


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
        display: "inline-block"
    },
    information:{
        textAlign: "center"
    },
    input: {
        display: 'none',
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
    input: {
        display: 'none',
    },
},
ListingForm = props=>{
    const { close, attributes, upload, save } = props,
    { companyName } = attributes;
    return(
        <div className="listing-form-container">
            <div className="listing-form-subcontainer">
                <div className="header">
                    <span id="header-text">Post Listing </span>
                    <span className="right" onClick={ close } id="close">&#x2716;</span>
                </div>
                <div className="listing-form">
                    <div className="information" style={ styles.information }>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-companyName"
                                label="Company Name"
                                value={ companyName } 
                                type="text" 
                                placeholder="eg. Company.Inc" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur={ upload }
                                onChange = { save } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

@connect((store)=>{
    return {
        user: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        listingsInfo: store.listingsInfo.info,
        currentHorizontalTab: store.genInfo.info.sideBar.currentHorizontalTab,
    }
})
class TendersTab extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        //set initial attributes
        let userType = JSON.parse(sessionStorage.getItem('profileInfo')).userType,
        genInfo = {...this.props.genInfo};
        if(userType === "Owner/Occupier" || userType === "owner-occupier" || userType === "owner_occupier"){
            
        }
        else{

        }  
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    fetchListings = ()=>{
        let genInfo = {...this.props.genInfo.info };
        axios.get(baseUrl + listingsEndPoint).then((response)=>{
            //console.log(response.data);
            let listings = genInfo.listings = {...response.data};
            /**Set the more dropdown menu class to hidden for every row*/
            Object.keys(listings).map((key)=>{
                genInfo.listings[key].moreMenuClassName = "hidden";
            })
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }).catch(err=>{
            console.log(err);
        });
    }

    searchListings = ()=>{

    }

    renderListingForm = ()=>{
        let listingsInfo = {...this.props.listingsInfo};
        listingsInfo.createForm.show = !listingsInfo.createForm.show;
        this.props.dispatch(dispatchedListingsInfo(listingsInfo));               
    }

    upload=(sectTitle, updateData)=>{
        return new Promise((resolve, reject)=>{
            let userId = userInfo.id,
            updateInfoUrl = baseURL + userUpdateEndPoint,
            updateObject = {userId, sectTitle, updateData};
            axios.post(updateInfoUrl, updateObject).
            then(res=>{
                resolve(res);
            }).
            catch(err=>{
                reject(err);
            })
        });
    };
    save=(e)=>{
        e.persist();
        return new Promise((resolve, reject)=>{
            let userInfo = {...user},
            id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.getAttribute('value');
            userInfo.profileInfo[name] = value;
            if(userInfo)                     
                resolve(userInfo);
            else
                reject({message: "No data"});
        });
    };


    render(){
        const showListingsForm = this.props.listingsInfo.createForm.show,
        listingAttributes = this.props.listingsInfo.createForm.attributes;
        return(
            <div className="tenders main-content">
                {showListingsForm?<ListingForm attributes = { listingAttributes } close={ this.renderListingForm } upload={ this.upload } save={ this.save } />:null}
                <div className="title-bar">
                    <span id="title">Postings</span>
                    <span id="search">
                        <FmButton variant="contained" styles={ alt_styles } text="Rehire service provider" />
                        <FmButton variant="contained" onClick={ this.renderListingForm } styles={ styles } text="Post New Tender" />
                        <SearchInput className="alt-search" placeholder="search for your listings" search={ this.searchListings } />
                    </span>
                </div>
                <div className="tender-listings">

                </div>
            </div>
        )
    }
}

TendersTab.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

TendersTab.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default TendersTab;
import React from 'react';
import { connect } from 'react-redux';
import './serviceProviders.css';
import  { Footer, HeaderMain, SecondarySearch, ListedServiceProviders, ListFilter } from 'components';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from 'extras/helperFunctions';

import { statesAustralia } from 'extras/config';
import { PropTypes } from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ServiceProviders extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid listings">
                    <SecondarySearch selectWidth="200px" dropDownWidth="230px" categoryTitle="searchCategoryServiceProviders" categories={ statesAustralia } placeholder="Find service providers" />
                    <ListedServiceProviders />
                    <ListFilter tickDispatcher={ dispatchedGenInfo } title="Categories Filter" />
                    <div className="clear"></div>
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

ServiceProviders.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ServiceProviders.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ServiceProviders;


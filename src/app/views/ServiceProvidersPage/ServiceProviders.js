import React from 'react';
import { connect } from 'react-redux';
import './serviceProviders.css';
import  { Footer, HeaderMain, SecondarySearch, ListedServiceProviders, ListFilter } from 'components';
import { statesAustralia } from 'extras/config';
import { PropTypes } from 'prop-types';
import { dispatchedServiceProvidersInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        serviceProvidersInfo: store.serviceProviders.info
    }
})
class ServiceProviders extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    componentWillMount(){
        window.addEventListener("resize", this.setWidth);
        this.setWidth();
    }

    setWidth = ()=>{
        let serviceProviderInfo = {...this.props.serviceProvidersInfo},
        inputWidth,
        width = window.innerWidth;
        console.log(width)
        serviceProviderInfo.miscAttributes['width'] = width;
        if(width <= 527){
            serviceProviderInfo.miscAttributes['selectWidth'] = 120;
            serviceProviderInfo.miscAttributes['dropDownWidth'] = 150;
        }else{
            serviceProviderInfo.miscAttributes['selectWidth'] = 200;
            serviceProviderInfo.miscAttributes['dropDownWidth'] = 230;
        }
        this.props.dispatch(dispatchedServiceProvidersInfo(serviceProviderInfo));
    }

    refinedSearch = (e)=>{
        e.persist();
        let info = {...this.props.serviceProvidersInfo},
        keyWords = e.target.value;
        info.filter.keyWords = keyWords;
        this.props.dispatch(dispatchedServiceProvidersInfo(info));
    }

    render(){
        let serviceProviderInfo = { ...this.props.serviceProvidersInfo },
        selectWidth = serviceProviderInfo.miscAttributes.selectWidth,
        dropDownWidth = serviceProviderInfo.miscAttributes.dropDownWidth;

        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid listings">
                    <SecondarySearch 
                        init="All States" 
                        selectWidth={ selectWidth + "px" } 
                        dropDownWidth={ dropDownWidth + "px"}
                        info = { this.props.serviceProvidersInfo }
                        dispatcher = { dispatchedServiceProvidersInfo }
                        categoryTitle="searchCategoryServiceProviders" 
                        categories={ statesAustralia }
                        onChange = { this.refinedSearch }
                        placeholder="Find by Name or City" 
                    />
                    <ListedServiceProviders />
                    <ListFilter
                        tickDispatcher={ dispatchedServiceProvidersInfo }
                        listPlacement = { this.props.serviceProvidersInfo }
                        title="Categories Filter" 
                    />
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


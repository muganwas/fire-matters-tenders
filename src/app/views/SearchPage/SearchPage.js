import React from 'react';
import { connect } from 'react-redux';
import './searchPage.css';
import  { Footer, HeaderMain, SearchDetail } from 'components';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo.info,
        tendersInfo: store.tenders.info,
        serviceProvidersInfo: store.serviceProviders.info
    }
})
class SearchPage extends React.Component {
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
                    <HeaderMain/>
                </div>
                <div className="mid listings">
                    <SearchDetail 
                        searchTenders = { this.searchTenders } 
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

SearchPage.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SearchPage.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SearchPage;


import React from 'react';
import { connect } from 'react-redux';
import './searchPage.css';
import  { Footer, HeaderMain, SearchDetail } from 'components';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
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

    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain
                        searchTenders = { this.searchTenders } 
                    />
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


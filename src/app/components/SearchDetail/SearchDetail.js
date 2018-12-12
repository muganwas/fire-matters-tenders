import React from 'react';
import { connect } from 'react-redux';
import './searchDetail.css';
import { PropTypes } from 'prop-types';
import { dispatchedSearchInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search.info,
        genInfo: store.genInfo.info,
        tendersInfo: store.tenders.info,
        serviceProvidersInfo: store.serviceProviders.info
    }
})
class SearchDetail extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){
        let searchInfo = {...this.props.search},
        searchTerm = searchInfo.mainSearch.searchTerm;
        this.props.searchTenders(searchTerm).then(res=>{
            if(res)
                searchInfo.mainSearch.results = res;
            
            this.props.dispatch(dispatchedSearchInfo(searchInfo));
        });    
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        let searchInfo = this.props.search,
        defaultText = searchInfo.mainSearch.noResults,
        results = searchInfo.mainSearch.results,
        resultLen = results?Object.keys(results).length:0;
        return(
            <div className="list left hanad">
                { resultLen>0?Object.keys(results).map(key=>{
                    return <span className="searchResults" key={key}>{ results[key].id }</span>
                })
                :defaultText }
            </div>
        )
    }
}

SearchDetail.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

SearchDetail.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default SearchDetail;


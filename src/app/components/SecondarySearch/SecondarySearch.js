import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
//import Image from 'react-image';
import { dispatchedSecondarySearchInfo } from 'extras/dispatchers';
import './secondarySearch.css';
import { DropDown, Textfield } from 'components';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        search: store.search,
        secondarySearch: store.secondarySearch,
        textFields: store.textFields.info,
        user: store.user
    }
})
class SecondarySearch extends Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    getCategory = (event)=>{
        let info = {...this.props.secondarySearch['info']};
        info.searchCategory = event.target.value;
        this.props.dispatch(dispatchedSecondarySearchInfo(info));
    }
    render(){
        return(
            <div className="search-main">
                <DropDown className="select left" options={ this.props.categories } getCategory={ this.getCategory } />
                <Textfield id="listingSearch" fieldClass="search-field" placeholder="Find listings" type="text" />
                <i className="material-icons search-icon">search</i>        
            </div>
        )
    }
}

SecondarySearch.defaultProps = {
    search: {},
    secondarySearch: {},
    textFields: {},
    user: {}
}

SecondarySearch.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    textFields: PropTypes.object.isRequired,
    secondarySearch: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired
}

export default SecondarySearch;
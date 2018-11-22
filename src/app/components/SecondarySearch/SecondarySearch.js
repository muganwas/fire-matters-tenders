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

    getCategory = (e)=>{
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            userInfo = {...this.props.user.info},
            categoryTitle = this.props.categoryTitle,
            searchCategories = this.props.categories,
            searchInfo = {...this.props.secondarySearch.info};
            searchInfo[categoryTitle] = searchCategories[id];
            this.props.dispatch(dispatchedSecondarySearchInfo(searchInfo));
            resolve(userInfo);
        });
    }
    render(){
        let selected = this.props.secondarySearch.info[this.props.categoryTitle];
        return(
            <div className="search-main">
                <DropDown
                    id={ this.props.id }
                    init={ selected || this.props.init } 
                    selectWidth={ this.props.selectWidth } 
                    width={ this.props.dropDownWidth } 
                    className="select left" 
                    options={ this.props.categories } 
                    selected={ selected } 
                    onChange={ this.getCategory } 
                />
                <Textfield id="listingSearch" fieldClass="search-field" placeholder={ this.props.placeholder } type="text" />
                <i className="material-icons search-icon">search</i>        
            </div>
        )
    }
}

SecondarySearch.defaultProps = {
    search: {},
    secondarySearch: {},
    textFields: {},
    user: {},
    categoryTitle: null,
    dropDownWidth: null,
    selectWidth: null,
    init: "All"
}

SecondarySearch.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    textFields: PropTypes.object.isRequired,
    secondarySearch: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    categoryTitle: PropTypes.string.isRequired,
    dropDownWidth: PropTypes.string,
    selectWidth: PropTypes.string,
    init: PropTypes.string
}

export default SecondarySearch;
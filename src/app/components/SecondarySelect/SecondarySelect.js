import React, { Component } from 'react';
import { connect } from 'react-redux';
import './secondarySelect.css';
import { AltDropDown } from 'components';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        search: store.search,
        secondarySelect: store.secondarySelect.info,
        textFields: store.textFields.info,
        userInfo: store.user.info
    }
})
class SecondarySelect extends Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        let selected = this.props.secondarySelect[this.props.categoryTitle],
        selectedAlt = this.props.secondarySelect[this.props.categoryTitleAlt],
        selectedKey ="";

        Object.keys(this.props.categories).map(key=>{
            if(this.props.categories[key] === selected)
                selectedKey = key;
        }); 
        
        let secondaryOptions = this.props.categoriesFull[selectedKey];
        
        return(
            <div className="secondary-select search-main">
                <AltDropDown
                    id = "mainCategories"
                    init={ selected || "Select Equip Category" } 
                    selectWidth={ this.props.selectWidth } 
                    width={ this.props.dropDownWidth } 
                    className="selectAlt left" 
                    options={ this.props.categories } 
                    selected={ selected } 
                    onChange={ this.props.onChange }
                    dispatcher = { this.props.dispatcher }  
                />
                {<AltDropDown
                    id = "minorCategories" 
                    init={ selectedAlt || "Select Equipment" } 
                    selectWidth={ this.props.selectWidthAlt } 
                    width={ this.props.dropDownWidthAlt } 
                    className="selectAlt left" 
                    options={ secondaryOptions } 
                    selected={ selectedAlt } 
                    onChange={ this.props.onChangeAlt }
                    dispatcher = { this.props.dispatcherAlt }    
                />}
                <div className="clear"></div>                   
            </div>
        )
    }
}

SecondarySelect.defaultProps = {
    search: {},
    categories: {},
    categoriesFull: {},
    secondarySearch: {},
    textFields: {},
    userInfo: {},
    categoryTitle: null,
    dropDownWidth: null,
    selectWidth: null,
    init: "All"
}

SecondarySelect.propTypes = {
    userInfo: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    textFields: PropTypes.object.isRequired,
    secondarySearch: PropTypes.object.isRequired,
    categories: PropTypes.object,
    categoryTitle: PropTypes.string.isRequired,
    dropDownWidth: PropTypes.string,
    selectWidth: PropTypes.string,
    init: PropTypes.string
}

export default SecondarySelect;
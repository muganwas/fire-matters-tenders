import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
//import Image from 'react-image';
import { dispatchedSecondarySelectInfo } from 'extras/dispatchers';
import './secondarySelect.css';
import { AltDropDown } from 'components';
import { PropTypes } from 'prop-types';
import { detectionAndWarningSystems, passiveProtection, portableEquipment, emergencyExitLighting  } from 'extras/config';
@connect((store)=>{
    return {
        search: store.search,
        secondarySelect: store.secondarySelect.info,
        textFields: store.textFields.info,
        user: store.user
    }
})
class SecondarySelect extends Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    getCategory = (e)=>{
        console.log(e.target.id)
        return new Promise((resolve, reject)=>{
            let id = e.target.id,
            categoryTitle = this.props.categoryTitle,
            searchCategories = this.props.categories,
            selectInfo = {...this.props.secondarySelect};
            selectInfo[categoryTitle] = searchCategories[id];
            resolve(selectInfo);
        });
    }
    render(){
        let selected = this.props.secondarySelect[this.props.categoryTitle],
        selectedAlt = this.props.secondarySelect[this.props.categoryTitleAlt];
        return(
            <div className="secondary-select">
                <AltDropDown 
                    init={ selected || "Select Equip Category" } 
                    selectWidth={ this.props.selectWidth } 
                    width={ this.props.dropDownWidth } 
                    className="select left" 
                    options={ this.props.categories } 
                    selected={ selected } 
                    onChange={ this.getCategory }
                    dispatcher = { dispatchedSecondarySelectInfo }  
                />
                {/*<DropDown 
                    init={ selected_alt || "Select Equip Sub-category" } 
                    selectWidth={ this.props.selectWidthAlt } 
                    width={ this.props.dropDownWidthAlt } 
                    className="select left" 
                    options={ this.props.categoriesAlt } 
                    selected={ selectedAlt } 
                    onChange={ this.getCategory }   
                />*/}      
            </div>
        )
    }
}

SecondarySelect.defaultProps = {
    search: {},
    secondarySearch: {},
    textFields: {},
    user: {},
    categoryTitle: null,
    dropDownWidth: null,
    selectWidth: null,
    init: "All"
}

SecondarySelect.propTypes = {
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

export default SecondarySelect;
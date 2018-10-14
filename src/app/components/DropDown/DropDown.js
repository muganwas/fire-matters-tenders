import React from 'react';
import './dropDown.css';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        user: store.user,
        secondarySearch: store.secondarySearch,
    }
})
class DropDown extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            dropDownClass: "hidden options-list"
        }
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    mapOptions = (key)=>{
        let options = this.props.options;
        if(options[key] === this.props.selected)
            return;
        else{
            return(   
                <option className="option" key={key} value={key}>{options[key]}</option>   
            )
        }
    }

    toggleDisplayDropDown = ()=>{
        if(this.state.dropDownClass === "hidden options-list"){
            this.setState({
                dropDownClass: "options-list"
            });
        }else{
            this.setState({
                dropDownClass: "hidden options-list"
            });
        }
    }

    render(){
        return(
            <div className={ this.props.className }>
                <span onClick = { this.toggleDisplayDropDown } className="options-selected">{ this.props.selected }</span>
                <div className={ this.state.dropDownClass }>
                    { Object.keys(this.props.options).map(this.mapOptions) }
                </div>
            </div>
        )
    }
}

DropDown.defaultProps = {
    user: {},
    options: {},
    secondarySearch: {}
}

DropDown.propTypes = {
    user: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    secondarySearch: PropTypes.object.isRequired
}

export default DropDown;
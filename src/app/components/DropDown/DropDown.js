import React from 'react';
import './dropDown.css';
import { connect } from 'react-redux';

@connect((store)=>{
    return {
        user: store.user
    }
})
export default class DropDown extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    mapOptions = (key)=>{
        let options = this.props.options;
        return(
            <option key={key} value={key}>{options[key]}</option>
        )
    }

    render(){
        return(
            <div className={ this.props.className }>
                <select onChange={ this.props.getCategory }>
                    {Object.keys(this.props.options).map(this.mapOptions)}
                </select>
            </div>
        )
    }
}
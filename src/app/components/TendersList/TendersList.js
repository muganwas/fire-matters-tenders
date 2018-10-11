import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
//import Image from 'react-image';
//import { dispatchedSearchInfo } from 'extras/dispatchers';
import './tendersList.css';

@connect((store)=>{
    return {
        search: store.search,
        user: store.user
    }
})
export default class TendersList extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="main">
                
            </div>
        )
    }
}
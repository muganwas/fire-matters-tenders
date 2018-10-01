import React, { Component } from 'react';
import Header from 'components/HeaderMain/HeaderMain';
import { connect } from 'react-redux';
import 'css/App.css';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search
    }
})
export default class NotFound extends Component {

    render(){
        return(
            <div className="main">
                <Header />
                <div className="not-found">
                    <span>Page not found</span>
                </div>
            </div>
        )
    }
}
import React from 'react';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from 'extras/dispatchers';
import  { Footer, HeaderMain } from 'components';
//import Image from 'react-image';
//import firebase from 'firebase';
//import helperFunctions from 'extras/helperFunctions';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
export default class Tenders extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid">
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}
import React from 'react';
import { connect } from 'react-redux';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
export default class MoreHoriz extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className="more">
                <i class="material-icons yellow">more_horiz</i>
            </div>
        )
    }
}
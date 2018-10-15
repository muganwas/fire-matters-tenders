import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './listFilter.css';
import { PropTypes } from 'prop-types';
import { TickBox } from 'components';

const baseUrl = process.env.BACK_END_URL,
usersEndPoint = process.env.USERS_END_POINT + "?userType=service provider";

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ListFilter extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="list-filter right quarter">
                <div className="header">{ this.props.title }</div>
                <span className="row">
                    <TickBox id = "maintenance" dispatcher = { dispatchedGenInfo } placement = { this.props.genInfo.info } />
                    <span className="list-text">Maintenance</span>
                </span>
                <span className="row">
                    <TickBox id = "repair" dispatcher = { dispatchedGenInfo } placement = { this.props.genInfo.info } />
                    <span className="list-text">Repair</span>
                </span>
                <span className="row">
                    <TickBox id = "evacTraining" dispatcher = { dispatchedGenInfo } placement = { this.props.genInfo.info } />
                    <span className="list-text">Evac Training</span>
                </span>
                <span className="row">
                    <TickBox id = "other" dispatcher = { dispatchedGenInfo } placement = { this.props.genInfo.info } />
                    <span className="list-text">Other</span>
                </span>
                
            </div>
        )
    }
}

ListFilter.defaultProps = {
    title: null,
    tickDispatcher: null
}
ListFilter.propTypes = {
    title: PropTypes.string.isRequired,
    tickDispatcher: PropTypes.func.isRequired
}

export default ListFilter;


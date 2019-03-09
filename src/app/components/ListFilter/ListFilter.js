import React, { Component } from 'react';
import { connect } from 'react-redux';
import './listFilter.css';
import { PropTypes } from 'prop-types';
import { TickBox } from 'components';
import { dispatchedServiceProvidersInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo,
        serviceProvidersInfo: store.serviceProviders.info
    }
})
class ListFilter extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount(){
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    updateDimensions = ()=>{
        let winWidth = window.innerWidth;
        let info = {...this.props.serviceProvidersInfo};
        if(winWidth <= 550){
            info.filter.filtersContainerClass = "list-filter left hanad";
        }else if(winWidth <= 768){
            info.filter.filtersContainerClass = "list-filter left half";
        }
        else{
            info.filter.filtersContainerClass = "list-filter right quarter";
        }
        this.props.dispatch(dispatchedServiceProvidersInfo(info));
    }

    render(){
        let { serviceProvidersInfo } = this.props,
        { filter } = serviceProvidersInfo,
        { filtersContainerClass } = filter;
        return(
            <div className={ filtersContainerClass }>
                <div className="header">{ this.props.title }</div>
                <span className="row">
                    <TickBox id = "Maintenance" dispatcher = { this.props.tickDispatcher } placement = { this.props.listPlacement } />
                    <span className="list-text">Maintenance</span>
                </span>
                <span className="row">
                    <TickBox id = "Repair" dispatcher = { this.props.tickDispatcher } placement = { this.props.listPlacement } />
                    <span className="list-text">Repair</span>
                </span>
                <span className="row">
                    <TickBox id = "EvacTraining" dispatcher = { this.props.tickDispatcher} placement = { this.props.listPlacement } />
                    <span className="list-text">Evac Training</span>
                </span>
                <span className="row">
                    <TickBox id = "Other" dispatcher = { this.props.tickDispatcher } placement = { this.props.listPlacement } />
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


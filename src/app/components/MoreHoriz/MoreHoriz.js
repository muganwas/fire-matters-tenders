import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import './moreHoriz.css';
import { dispatchedGenInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        genInfo: store.genInfo
    }
})
class MoreHoriz extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    
    toggleMenu = ()=>{
        let genInfo = { ...this.props.genInfo.info },
        listName = this.props.listName;
        if(this.props.className === "hidden"){
            genInfo[listName][this.props.id].moreMenuClassName = "dropDownMenu";
            Object.keys(genInfo[listName]).map((key)=>{
                if(key !== this.props.id)
                    genInfo[listName][key].moreMenuClassName = "hidden";
            })
            this.props.dispatch(dispatchedGenInfo(genInfo));           
        }else{
            genInfo[listName][this.props.id].moreMenuClassName = "hidden";
            this.props.dispatch(dispatchedGenInfo(genInfo));
        }             
    }

    detailedElement = (key)=>{
        let element = this.props.element;
        return(
            <div key={key}>
                <span>{ element[key] }</span>
            </div>
        )
    }

    options = (key)=>{
        let options = this.props.options,
        onClick = key === "sendMessage"?this.props.onClick:this.props.onClick1;
        return(
            <div className="more-li" autoid= { this.props.autoid } email={ this.props.email } onClick={ onClick } key={key}>{ options[key] }</div>
        )
    }

    render(){
        return(
            <div id={ this.props.id }>
                <div onClick={ this.toggleMenu } className="more">
                    <i class="material-icons yellow">more_horiz</i>
                </div>
                <div className={ this.props.className }>
                    { Object.keys(this.props.options).map(this.options) }
                </div>
            </div>
        )
    }
}

MoreHoriz.defaultProps = {
    user: {},
    genInfo: {},
    className: null,
    options: null
}

MoreHoriz.propTypes = {
    user: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    element: PropTypes.object,
    id: PropTypes.string,
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    autoId: PropTypes.string,
    email: PropTypes.string
}

export default MoreHoriz;
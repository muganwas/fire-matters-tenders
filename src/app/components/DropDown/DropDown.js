import React from 'react';
import './dropDown.css';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';

@connect((store)=>{
    return {
        user: store.user,
        genInfo: store.genInfo.info,
        dropDown: store.genInfo.info.dropDown,
        dropDownClass: store.genInfo.info.dropDown.dropDownClass
    }
})
class DropDown extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    afterSelect = (e)=>{
        this.props.onChange(e).then(()=>{
            this.toggleDisplayDropDown();
        }).
        catch(error=>{
            console.log(error);
            throw error;
        });
    }

    mapOptions = (key)=>{
        let options = this.props.options;
        if(options[key] === this.props.selected)
            return;
        else{
            return(   
                <span onClick={ this.afterSelect } className="option" id={ key } key={ key } value={key}>{options[key]}</span>   
            )
        }
    }

    toggleDisplayDropDown = ()=>{
        let genInfo = {...this.props.genInfo};
        if(this.props.dropDownClass === "hidden options-list")
            genInfo.dropDown.dropDownClass = "options-list"; 
        else
            genInfo.dropDown.dropDownClass = "hidden options-list";
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    render(){
        return(
            <div style={{width:this.props.selectWidth}} className={ this.props.className }>
                <span onClick = { this.toggleDisplayDropDown } className="options-selected">{ this.props.selected || this.props.init }</span>
                <div style={{width:this.props.width}} className={ this.props.dropDownClass }>
                    { Object.keys(this.props.options).map(this.mapOptions) }
                </div>
            </div>
        )
    }
}

DropDown.defaultProps = {
    user: {},
    options: {},
    onChange: null,
    width: null,
    selectWidth: null
}

DropDown.propTypes = {
    user: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    selectWidth: PropTypes.string,
    width: PropTypes.string,
    selected: PropTypes.string,
    init: PropTypes.string
}

export default DropDown;
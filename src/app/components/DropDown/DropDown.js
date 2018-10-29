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

    componentWillMount(){
        let id = this.props.id,
        newClassLabel = id + "dropDownClass",
        genInfo = {...this.props.genInfo};
        genInfo.dropDown[newClassLabel] = "hidden options-list";
        this.props.dispatch(dispatchedGenInfo(genInfo));
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
        let id = this.props.id,
        newClassLabel = id + "dropDownClass",
        genInfo = {...this.props.genInfo};
        if(genInfo.dropDown[newClassLabel] === "hidden options-list")
            genInfo.dropDown[newClassLabel] = "options-list"; 
        else
            genInfo.dropDown[newClassLabel] = "hidden options-list";
        this.props.dispatch(dispatchedGenInfo(genInfo));
    }

    render(){
        let id = this.props.id,
        newClassLabel = id + "dropDownClass";
        return(
            <div>
                { this.props.label?<span className="label">{ this.props.label }</span>: null }
                <div style={{width:this.props.selectWidth}} className={ this.props.className }>
                    <span id={ this.props.id } onClick = { this.toggleDisplayDropDown } className="options-selected">{ this.props.selected || this.props.init }</span>
                    <div style={{width:this.props.width}} className={ this.props.genInfo.dropDown[newClassLabel] }>
                        { Object.keys(this.props.options).map(this.mapOptions) }
                    </div>
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
    selectWidth: null,
    label: null
}

DropDown.propTypes = {
    user: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    selectWidth: PropTypes.string,
    width: PropTypes.string,
    selected: PropTypes.string,
    init: PropTypes.string,
    label: PropTypes.string
}

export default DropDown;
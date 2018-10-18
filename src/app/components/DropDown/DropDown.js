import React from 'react';
import './dropDown.css';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

@connect((store)=>{
    return {
        user: store.user,
    }
})
class DropDown extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            dropDownClass: "hidden options-list"
        }
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
        if(this.state.dropDownClass === "hidden options-list"){
            this.setState({
                dropDownClass: "options-list"
            });
        }else{
            this.setState({
                dropDownClass: "hidden options-list"
            });
        }
    }

    render(){
        return(
            <div style={{width:this.props.selectWidth}} className={ this.props.className }>
                <span onClick = { this.toggleDisplayDropDown } className="options-selected">{ this.props.selected }</span>
                <div style={{width:this.props.width}} className={ this.state.dropDownClass }>
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
    selectWidth: null,
    selected: "All"
}

DropDown.propTypes = {
    user: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    selectWidth: PropTypes.string,
    width: PropTypes.string,
    selected: PropTypes.string.isRequired
}

export default DropDown;
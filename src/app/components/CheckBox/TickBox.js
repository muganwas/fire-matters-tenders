import React from 'react';
import './tickBox.css';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from 'extras/dispatchers';
import Checkbox from '@material-ui/core/Checkbox';

const orange = {
    color: "#F79A50"
}
@connect((store)=>{
    return {
        user: store.user
    }
})
class TickBox extends React.Component {
    constructor(props){
        super(props)
        this.state={
            checked: false
        }
    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    handleChange=(e)=>{
        let fieldValue = !this.state.checked;
        let currUserInfo = {...this.props.user.info};
        let label = this.props.id;
        currUserInfo[label] = fieldValue;
        this.props.dispatch(dispatchedUserInfo(currUserInfo));
        this.setState({checked:!this.state.checked});
    }

    render(){
        return(
            <Checkbox
                id = {this.props.id}
                style={ orange }
                checked={this.state.checked}
                onChange={this.handleChange}
                value={(this.state.checked).toString()}
            >
            </Checkbox>
        )
    }
}

export default TickBox;
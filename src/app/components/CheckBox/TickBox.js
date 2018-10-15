import React from 'react';
import './tickBox.css';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    tick: {
        width: 26,
        height: 26,
        color: "#F79A50",
        fontSize: 12
    }
})
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

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }
    
    handleChange=()=>{
        let fieldValue = !this.state.checked;
        let dispatcher = this.props.dispatcher;
        let currUserInfo = {...this.props.placement };
        let label = this.props.id;
        currUserInfo[label] = fieldValue;
        this.props.dispatch(dispatcher(currUserInfo));
        this.setState({checked:!this.state.checked});
    }

    render(){
        let { classes } = this.props
        return(
            <Checkbox
                id = {this.props.id}
                color = "default"
                className={classes.tick}
                checked={this.state.checked}
                onChange={this.handleChange}
                value={(this.state.checked).toString()}
            >
            </Checkbox>
        )
    }
}

TickBox.defaultProps = {
    user: {},
    placement: {},
    dispatcher: null
}

TickBox.PropTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placement: PropTypes.object.isRequired,
    dispatcher: PropTypes.func.isRequired
}

export default withStyles(styles)(TickBox);
import React from 'react';
import './chckBox.css';
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
class ChckBox extends React.Component {
    constructor(props){
        super(props)
        this.state={
            checked: false
        }
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        let { classes } = this.props
        return(
            <Checkbox
                id = {this.props.id}
                color = "default"
                className={classes.tick}
                checked={ this.props.value || this.state.checked}
                onChange={this.props.handleChange}
                value={(this.state.checked).toString()}
            >
            </Checkbox>
        )
    }
}

ChckBox.defaultProps = {
    user: {},
    placement: {},
    dispatcher: null
}

ChckBox.PropTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placement: PropTypes.object.isRequired,
    dispatcher: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired
}

export default withStyles(styles)(ChckBox);
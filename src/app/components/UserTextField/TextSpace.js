import React from 'react';
import './textSpace.css';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from 'extras/dispatchers';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Email from '@material-ui/icons/Email';
import Work from '@material-ui/icons/Work';
import Phone from '@material-ui/icons/Phone';


@connect((store)=>{
    return {
        user: store.user
    }
})
class TextSpace extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillMount(){

    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    adornment = ()=>{
        let adornment = "0_0";
        if(this.props.adornment ==="person")
            adornment = <AccountCircle />;
        else if(this.props.adornment === "email")
            adornment = <Email />
        else if(this.props.adornment === "company")
            adornment = <Work />
        else if(this.props.adornment === "phone")
            adornment = <Phone />
        return adornment;
    }

    handleText=(e)=>{
        let fieldValue = e.target.value;
        let currUserInfo = {...this.props.user.info};
        let label = this.props.id;
        currUserInfo[label] = fieldValue;
        this.props.dispatch(dispatchedUserInfo(currUserInfo));
    }

    render(){
        return(
            <TextField
                id={this.props.id}
                className={this.props.fieldClass}
                InputProps={{
                    disableUnderline: true,
                    classes: {
                        root: this.props.fieldClass,
                    },
                    startAdornment: (<InputAdornment className="gray" position="start">{this.adornment()}</InputAdornment>)
                }}
                onChange={this.handleText}
                placeholder={this.props.placeholder}
                type={this.props.type}
            >
            </TextField>
        )
    }
}

export default TextSpace;
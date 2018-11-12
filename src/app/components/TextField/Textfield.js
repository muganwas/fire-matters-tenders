import React from 'react';
import { connect } from 'react-redux';

import './textField.css';
import { PropTypes } from 'prop-types';

import { dispatchedUserInfo } from 'extras/dispatchers';
import TextField from '@material-ui/core/TextField';

@connect((store)=>{
    return {
        user: store.user,
        profileInfo: store.user.info.profileInfo,
        textFields: store.textFields.info
    }
})
class Textfield extends React.Component {
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    upload = (e)=>{
        e.persist();
        let id = e.target.id,
        origName = e.target.getAttribute("category");
        origName = origName?origName:id;
        let nameArr = origName.split("-"),
        key = nameArr[0],
        name = nameArr[1],
        profileInfoSucCategory = this.props.subCategory,
        value = e.target.value;
        let dbValue;
        if(profileInfoSucCategory)
            dbValue = (JSON.parse(sessionStorage.getItem('profileInfo')))[profileInfoSucCategory][key][name]
        else
            dbValue = (JSON.parse(sessionStorage.getItem('profileInfo')))[name];
        if(dbValue !== value){
            this.props.onBlur(name, value).
            then(res=>{
                if(res)
                    console.log(name + "updated");
            }).
            catch(err=>{
                console.log(err)
            });
        }
        
    }

    handleText=(e)=>{
        e.persist();
        this.props.onChange(e).then(res=>{
            this.props.dispatch(dispatchedUserInfo(res));
        }).
        catch(error=>{
            console.log(error);
            throw error;
        });
    }

    render(){
        if(this.props.multiline){
            return(
                <div>
                    { this.props.label?<span className="label">{ this.props.label }</span>: null }
                    <div className={this.props.fieldClass}>
                        <TextField
                            id={ this.props.id }
                            style={{width: "100%"}}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    root: this.props.root,
                                },
                            }}
                            multiline
                            rowsMax = "30"
                            rows="4"
                            defaultValue={this.props.value}
                            onChange={this.handleText}
                            onBlur={ this.upload }
                            placeholder={this.props.placeholder}
                            type={this.props.type}
                        >
                        </TextField>
                    </div>
                </div>
            )
        }else{
            return(
                <div>
                    { this.props.label?<span className="label">{ this.props.label }</span>: null }
                    <div className={this.props.fieldClass}>
                        <TextField
                            id={ this.props.id }
                            style={{width: "100%"}}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    root: this.props.root,
                                },
                            }}
                            defaultValue={this.props.value}
                            onChange={this.handleText}
                            onBlur={ this.upload }
                            placeholder={this.props.placeholder}
                            type={this.props.type}
                        >
                        </TextField>
                    </div>
                </div>
            )
        }
    }
}

Textfield.defaultProps = {
    user: {},
    type: "text",
    value: "",
    label: null,
    multiline: false
}

Textfield.propTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string,
    multiline: PropTypes.bool
}

export default Textfield;
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import './phoneNumber.css';
import { dispatchedUserInfo } from 'extras/dispatchers';
import MaskedInput from 'react-text-mask';

@connect((store)=>{
    return {
        user: store.user
    }
})
class PhoneNumber extends React.Component {
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
        name = nameArr[1],
        value = e.target.value;
        let dbValue = (JSON.parse(sessionStorage.getItem('profileInfo')))[name];
        value = (value).replace("(", "").replace(")", "").replace( new RegExp(" ", "g"), "").replace("-", "");
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
        return(
            <div>
                { this.props.label?<span className="label">{ this.props.label }</span>: null }
                <div className={ this.props.fieldClass }>
                    <MaskedInput
                        id={this.props.id}
                        title="number"
                        style={{
                                width: "90%",
                                border: "none",
                                boxShadow: "none"
                            }}
                        name = {this.props.fieldClass}
                        onBlur = { this.props.upload || this.upload }
                        defaultValue={ this.props.value }
                        onChange={ this.props.save || this.handleText }
                        disabled = { this.props.disabled }
                        placeholder={this.props.placeholder}
                        mask={this.props.mask}
                        placeholderChar={'\u2000'}
                    />
                </div>
            </div>
        )
    }
}

PhoneNumber.defaultProps = {
    user: {},
    adornment: "0_0",
    type: "text",
    value: "",
    label: null,
}

PhoneNumber.propTypes = {
    user: PropTypes.object.isRequired,
    adornment: PropTypes.string,
    id: PropTypes.string.isRequired,
    fieldClass: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    onBlur: PropTypes.func,
    mask: PropTypes.array.isRequired,
    value: PropTypes.string,
    label: PropTypes.string
}

export default PhoneNumber;
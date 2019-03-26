import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './subContractorForm.css';
import { Textfield, PhoneNumber, DropDown, FmButton } from 'components';

class SubContractorForm extends React.Component {
    constructor(props){
        super(props)
    }
    componentWillMount(){

    }
    componentWillReceiveProps(nextProps){
        this.props = {...nextProps}
    }
    render(){
        const { 
            feedback,
            feedbackClass,
            styles, 
            close,
            statesAustralia,
            attributes,
            upload, 
            save,
            onBlur,  
            errors,
            winWidth
        } = this.props,
        { 
            contractorFullName,
            contractorCompanyName,
            contractorPhoneNumber,
            contractorMobileNumber,
            contractorEmailAddress,
            contractorState,
            contractorCity,
            contractorSuburb,
            contractorArea,
            contractorStreet,
            submitButton 
        } = attributes,
        mandatoryInput = "This field is mandatory.",
        isActive = submitButton.isActive;
        let dropDownWidth = "330px";
        
        if(winWidth < 515){
            dropDownWidth = "50%";
        }
        return(
            <div className="listing-form-container">
                <div className="listing-form-subcontainer">
                    <div className="header">
                        <span id="header-text">Add Sub-Contractor</span>
                        <span className="right" onClick={ close } id="close">&#x2716;</span>
                    </div>
                    <div className="listing-form">
                        <div className="information" style={ styles.information }>
                            <div className="el hanad" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="subcontractor-contractorFullName"
                                    label="Full Name"
                                    value={ contractorFullName } 
                                    type="text" 
                                    placeholder="sub-contractor's name" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.contractorFullName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="subcontractor-contractorCompanyName"
                                    label="Company Name"
                                    value={ contractorCompanyName } 
                                    type="text" 
                                    placeholder="sub-contractor's company name" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.contractorCompanyName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el}>
                                <PhoneNumber 
                                    id="subcontractor-contractorPhoneNumber"
                                    label = "Phone Number"
                                    value={ contractorPhoneNumber }  
                                    mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                    root="inner-textfield"
                                    placeholder="(07) 9999-9999"
                                    fieldClass="textfield"
                                    onBlur={ onBlur }
                                    onChange = { save }
                                />
                                { errors.contractorPhoneNumber?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el}>
                                <PhoneNumber 
                                    id="subcontractor-contractorMobileNumber"
                                    label = "Mobile Number"
                                    value={ contractorMobileNumber }  
                                    mask={['(', [0], /\d/, /\d/, /\d/,')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/,]}
                                    root="inner-textfield"
                                    placeholder="(0799) 999 999"
                                    fieldClass="textfield"
                                    onBlur={ onBlur }
                                    onChange = { save }
                                />
                            </div>
                            <div className="el" style={ styles.el}>
                                <Textfield 
                                    id="subcontractor-contractorEmailAddress" 
                                    value={ contractorEmailAddress }
                                    label="Email Address"
                                    type="email" 
                                    placeholder="Johndoe@email.com" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur={ onBlur }
                                    onChange = { save }
                                />
                                { errors.contractorEmailAddress?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <DropDown 
                                    label="State" 
                                    id="subcontractor-contractorState" 
                                    className="select" 
                                    init={ contractorState || "Select State" } 
                                    width={ dropDownWidth } 
                                    options={ statesAustralia } 
                                    selected={ contractorState }
                                    onBlur={ onBlur } 
                                    onChange={ save } 
                                />
                                { errors.contractorState?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="subcontractor-contractorCity"
                                    label="City"
                                    value={ contractorCity } 
                                    type="text" 
                                    placeholder="sub-contractor's city" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.contractorCity?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="subcontractor-contractorSuburb"
                                    label="Suburb"
                                    value={ contractorSuburb } 
                                    type="text"
                                    placeholder="sub-contractor's suburb" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.contractorSuburb?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="subcontractor-contractorArea"
                                    label="Area"
                                    value={ contractorArea } 
                                    type="text"
                                    placeholder="sub-contractor's area" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.contractorArea?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <Textfield 
                                    id="subcontractor-contractorStreet"
                                    label="Street"
                                    value={ contractorStreet } 
                                    type="text"
                                    placeholder="sub-contractor's street" 
                                    root="inner-textfield" 
                                    fieldClass="textfield"
                                    onBlur = { onBlur }
                                    onChange = { save } 
                                />
                                { errors.contractorStreet?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                            </div>
                            <div className="el" style={ styles.el }>
                                <FmButton
                                    isActive={ isActive } 
                                    loaderFill = "#fff" 
                                    variant="contained" 
                                    styles={ styles }
                                    buttonWrapperWidth = {"99%"}
                                    text="Add Sub-Contractor"
                                    onClick = { upload } 
                                />
                                <div className="clear"></div>
                            </div>
                            <br/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


SubContractorForm.defaultProps = {
    states: null,
    close: undefined,
}

SubContractorForm.propTypes = {
    close: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    upload: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    errors: PropTypes.object
}

export default connect(store=>{
    return {
        userInfo: store.user.info,
        messagesInfo: store.messages.info
    }
})(SubContractorForm);
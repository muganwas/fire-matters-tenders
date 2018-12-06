import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './tenderForm.css';
import { Textfield, FmButton } from 'components';

const TenderForm = props=>{
    const { 
        feedback,
        feedbackClass,
        styles, 
        close, 
        attributes, 
        upload, 
        save, 
        onBlur, 
        errors
    } = props,
    { 
        tenderCompanyName, 
        tenderRate, 
        tenderStartDate, 
        tenderEndDate, 
        tenderCoverLetter, 
        submitButton 
    } = attributes,
    mandatoryInput = "This field is mandatory.",
    isActive = submitButton.isActive;
    return(
        <div style={ styles.trans } className="tenders listing-form-container">
            <div className="listing-form-subcontainer">
                <div className="header">
                    <span id="header-text">Post New Tender </span>
                    <span className="right" onClick={ close } id="close">&#x2716;</span>
                </div>
                <div className="listing-form">
                    <div className="information" style={ styles.information }>
                    <div className="el" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderCompanyName"
                                label="Company Name"
                                value={ tenderCompanyName } 
                                type="text" 
                                placeholder="eg. Company.Inc" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderCompanyName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderRate"
                                label="Service Charge Rate"
                                value={ tenderRate } 
                                type="number" 
                                placeholder="Service charge" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderRate?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderStartDate"
                                label="Expected Start Date"
                                value={ tenderStartDate } 
                                type="date" 
                                placeholder="mm/dd/yyyy" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderStartDate?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderEndDate"
                                label="Expected End Date"
                                value={ tenderEndDate } 
                                type="date" 
                                placeholder="mm/dd/yyyy" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderEndDate?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderCoverLetter"
                                label="Write Brief Cover letter"
                                value={ tenderCoverLetter } 
                                type="text"
                                multiline
                                placeholder="Brief cover letter" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                onBlur = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderEndDate?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        
                        <div className="el" style={ styles.el }>
                            <FmButton
                                isActive={ isActive } 
                                loaderFill = "#fff" 
                                variant="contained" 
                                styles = { styles } 
                                text="Submit Listing"
                                onClick = { upload } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

TenderForm.defaultProps = {
    states: null,
    close: undefined,
}

TenderForm.propTypes = {
    close: PropTypes.func.isRequired,
    attributes: PropTypes.object.isRequired,
    upload: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired
}

export default connect(store=>{
    return {
        userInfo: store.user.info,
        listingsInfo: store.listingsInfo.info,
    }
})(TenderForm);
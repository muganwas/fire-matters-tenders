import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './tenderForm.css';
import { Textfield, FmButton, PhoneNumber } from 'components';

const TenderForm = props=>{
    const { 
        feedback,
        feedbackClass,
        styles, 
        close,
        equipment,
        renderEquip,
        attributes, 
        upload, 
        save, 
        onBlur, 
        errors
    } = props,
    {
        tenderContactName,
        tenderContactPosition,
        tenderContactPhone,
        tenderContactFax,
        tenderContactEmail,
        tenderRates, 
        tenderCoverLetter, 
        submitButton 
    } = attributes,
    mandatoryInput = "This field is mandatory.",
    isActive = submitButton.isActive;
    return(
        <div style={ styles.trans } className="tenders listing-form-container">
            <div className="listing-form-subcontainer">
                <div className="header">
                    <span id="header-text">Submit Tender </span>
                    <span className="right" onClick={ close } id="close">&#x2716;</span>
                </div>
                <div className="listing-form">
                <div className="half left">
                    <div className="information">
                        <div className="el" style={ styles.el }><span className={ feedbackClass }>{ feedback }</span></div>
                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderContactName"
                                label="Company Contact's Name"
                                value={ tenderContactName } 
                                type="text" 
                                placeholder="Company Contact's Name" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderContactName?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderContactPosition"
                                label="Company Contact's Position"
                                value={ tenderContactPosition } 
                                type="text" 
                                placeholder="Contacts Position" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderContactPosition?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <PhoneNumber 
                                id="tenders-tenderContactPhone"
                                label="Company Contact's Phone Number"
                                value={ tenderContactPhone }
                                placeholder = "0x xxxx xxxx"
                                mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload = { onBlur }
                                save = { save } 
                            />
                            { errors.tenderContactPhone?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <PhoneNumber 
                                id="tenders-tenderContactFax"
                                label="Company Contact's Fax Number"
                                value={ tenderContactFax }
                                placeholder = "0x xxxx xxxx"
                                mask= {['(', [0], /\d/,')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload = { onBlur }
                                save = { save } 
                            />
                            { errors.tenderContactFax?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>

                        <div className="el" style={ styles.el }>
                            <Textfield 
                                id="tenders-tenderContactEmail"
                                label="Company Contact's Email Address"
                                value={ tenderContactEmail } 
                                type="email" 
                                placeholder="Contact's email" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderContactEmail?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
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
                                upload = { onBlur }
                                onChange = { save } 
                            />
                            { errors.tenderCoverLetter?<span style={ styles.inputErr } className="error-feedback">{ mandatoryInput }</span>:null }
                        </div>
                        </div>
                    </div>
                    <div className="half left">
                        <div className = "tender-equipment">
                            <span className ="left"><h4>Equipment on site</h4></span><span className="right"><h4>Service charge</h4></span>
                            <div className="clear"></div>
                            <span className ="listingEl">{ Object.keys(equipment).map(renderEquip) }</span>
                        </div>
                    </div>
                    <div className="el" style={ styles.el }>
                            <FmButton
                                isActive={ isActive } 
                                loaderFill = "#fff" 
                                variant="contained" 
                                styles = { styles } 
                                text="Submit Tender"
                                onClick = { upload } 
                            />
                    </div>
                </div>
            </div>
            <div className="clear"></div>
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
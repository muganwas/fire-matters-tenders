import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textfield } from 'components';
import { dispatchedTendersInfo } from 'extras/dispatchers';
import {  equipmentKeyNames } from 'extras/config'
import axios from 'axios';

const baseURL = process.env.BACK_END_URL,
tenderUpdateEndPoint = process.env.TENDER_UPDATE_END_POINT;

class ListedPostedTenderDetails extends React.Component {
    constructor(props){
        super(props)
    }

    upload=(e)=>{
        e.persist();
        let { currTender } = this.props,
        id = e.target.id,
        value = e.target.value,
        origName = e.target.getAttribute("category");
        origName = id?id:origName;
        let nameArr = origName.split("-"),
        sectTitle = nameArr[1];
        return new Promise((resolve, reject)=>{
            let tenderId = currTender.id,
            updateData = value,
            updateInfoUrl = baseURL + tenderUpdateEndPoint,
            updateObject = {tenderId, sectTitle , updateData};
            axios.post(updateInfoUrl, updateObject).
            then(res=>{
                console.log(res);
                resolve(res);
            }).
            catch(err=>{
                reject(err);
            });
        });
    }

    save=(e)=>{
        e.persist();
        let { tendersInfo, sitesInfo } = this.props;
        return new Promise(resolve=>{
            let id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = id?id:origName;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.value;
            value = value?value:getAttribute('value');
            tendersInfo.selectedPostedTender.tenderInfo[name] = value;
            this.props.dispatch(dispatchedTendersInfo(tendersInfo));
            if(sitesInfo)                     
                resolve(sitesInfo);
            else
                reject({message: "No data"});
        }); 
    }

    saveEquipRate = (e)=>{
        let id = e.target.id,
        value = e.target.value,
        tendersInfo = {...this.props.tendersInfo},
        tenderRates = tendersInfo.selectedPostedTender.tenderInfo.rates;
        tenderRates[id] = value;
        this.props.dispatch(dispatchedTendersInfo(tendersInfo));
    }

    uploadRates = ()=>{
        let currTender = {...this.props.currTender },
        tenderId = currTender.id,
        updateData = currTender.rates,
        updateInfoUrl = baseURL + tenderUpdateEndPoint,
        updateObject = {tenderId, sectTitle: "rates" , updateData};
        axios.post(updateInfoUrl, updateObject).
        then(res=>{
            console.log(res);
        }).
        catch(err=>{
            reject(err);
        });

    }

    render(){
        let { currTender } = this.props,
        { companyName, contactName, contactPosition, contactPhone, contactFax, contactEmail, rates, coverLetter } = currTender;

        const renderEquip = (key)=>{
            return(
                <div key={key} className="listed-equip">
                    { equipmentKeyNames[key] } 
                    <span className="countDigit right">
                        <input
                            id = { key }
                            className = "equipQ"
                            type="number"
                            placeholder="Rate"
                            defaultValue = { rates[key] }
                            onChange={ this.saveEquipRate }
                            onBlur ={ this.uploadRates }
                        />
                    </span>
                    <div className="clear"></div>
                </div>
            )
        }

        return(
            <div className="sub-container">
                <div className="half left">
                    <div className="heading">Company Name: { companyName }<div className="bottom-border"></div></div>
                    <br />
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="selectedTender-companyName" 
                                value={ companyName }
                                label="Company Name"
                                type="text" 
                                placeholder="Input proposed rate" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="selectedTender-contactName"
                                label = "Contact Name"
                                value={ contactName } 
                                type = "text"
                                placeholder="Company Contacts's Name"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="selectedTender-contactPosition"
                                label = "Contact Position"
                                value={ contactPosition } 
                                type = "text"
                                placeholder="Company Contact's Name"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="selectedTender-contactEmail"
                                label = "Contact Email"
                                value={ contactEmail } 
                                type = "text"
                                placeholder="Company Contact's Email"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="selectedTender-contactPhone"
                                label = "Contact Phone"
                                value={ contactPhone } 
                                placeholder="Company Contact's Phone"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="selectedTender-contactFax"
                                label = "Contact Fax"
                                value={ contactFax } 
                                placeholder="Company Contact's Fax"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="selectedTender-coverLetter" 
                                value={ coverLetter }
                                label="Cover Letter"
                                type="text"
                                multiline 
                                placeholder="Input a short cover leter" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save }  
                            />
                        </div>                       
                    </div>
                </div>
                <div   id="equip-update-half" className="half right">
                    <span className ="left"><h4>Equipment</h4></span><span className="right"><h4>Service charge</h4></span>
                    <div className="clear"></div>
                    { Object.keys(rates).map(renderEquip) }
                </div>
                <div className="clear"></div>
            </div>
        )
    }
    

}

ListedPostedTenderDetails.defaultProps = {
    user: {},
    sitesInfo: {},
    currTender: {}
}

ListedPostedTenderDetails.propTypes = {
    user: PropTypes.object.isRequired,
    sitesInfo: PropTypes.object.isRequired,
    tendersInfo: PropTypes.object.isRequired,
    currTender: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        user: store.user.info,
        sitesInfo: store.sites.info,
        currTender: store.tenders.info.selectedPostedTender.tenderInfo,
        tendersInfo: store.tenders.info,
    }
})(ListedPostedTenderDetails);

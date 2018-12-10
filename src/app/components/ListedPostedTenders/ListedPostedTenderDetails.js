import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Textfield } from 'components';
import { dispatchedTendersInfo } from 'extras/dispatchers';
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

    render(){
        let { currTender } = this.props,
        { companyName, rate, startDate, endDate, coverLetter } = currTender;

        return(
            <div className="sub-container">
                <div className="hanad left">
                    <div className="heading">Company Name: { companyName }<div className="bottom-border"></div></div>
                    <br />
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="selectedTender-rate" 
                                value={ rate }
                                label="Proposed Rate"
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
                                id="selectedTender-startDate"
                                label = "Start Date"
                                value={ startDate } 
                                type = "date"
                                placeholder="MM/DD/YYYY"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="selectedTender-endDate"
                                label = "End Date"
                                value={ endDate } 
                                type = "date"
                                placeholder="MM/DD/YYYY"
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

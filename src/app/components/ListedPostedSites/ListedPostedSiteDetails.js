import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DropDown, Textfield } from 'components';
import { dispatchedSitesInfo } from 'extras/dispatchers';
import axios from 'axios';

const baseURL = process.env.BACK_END_URL,
userUpdateEndPoint = process.env.SITE_UPDATE_END_POINT;

class ListedPostedSiteDetails extends React.Component {
    constructor(props){
        super(props)
    }

    upload=(e)=>{
        e.persist();
        let { currSite } = this.props,
        id = e.target.id,
        value = e.target.value;
        value = value?value:e.target.getAttribute('value');
        let origName = e.target.getAttribute('category');
        id = origName?origName:id;
        let idArr = id.split("-"),
        sectTitle = idArr[1],
        userInfo = currSite;
        return new Promise((resolve, reject)=>{
            let siteId = userInfo.id,
            updateData = currSite,
            updateInfoUrl = baseURL + userUpdateEndPoint,
            updateObject = {siteId, updateData};

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
        let { sitesInfo } = this.props;
        return new Promise(resolve=>{
            let id = e.target.id,
            origName = e.target.getAttribute("category");
            origName = origName?origName:id;
            let nameArr = origName.split("-"),
            name = nameArr[1],
            value = e.target.value;
            value = value?value:getAttribute('value');
            sitesInfo.activeSite[name] = value;
            this.props.dispatch(dispatchedSitesInfo(sitesInfo));
            if(sitesInfo)                     
                resolve(sitesInfo);
            else
                reject({message: "No data"});
        }); 
    }

    render(){
        let { currSite } = this.props,
        { siteName, siteLocation, currentContractor, contractStatus } = currSite;

        return(
            <div className="sub-container">
                <div className="left">
                    <div className="heading">Current Site: { siteName }<div className="bottom-border"></div></div>
                    <br />
                    <div className="information">
                        <div className="el">
                            <Textfield 
                                id="sites-siteName" 
                                value={ siteName }
                                label="Site Name"
                                type="text" 
                                placeholder="Input site name" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield
                                id="sites-siteLocation"
                                label = "Site Location"
                                value={ siteLocation } 
                                type = "text"
                                placeholder="Input site location"
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save } 
                            />
                        </div>
                        <div className="el">
                            <Textfield 
                                id="sites-currentContractor" 
                                value={ currentContractor }
                                label="Contractor"
                                type="text" 
                                placeholder="Input current contractor" 
                                root="inner-textfield" 
                                fieldClass="textfield"
                                upload={ this.upload }
                                save={ this.save }  
                            />
                        </div>
                        <div className="el">
                                <DropDown 
                                    label="Contract Status" 
                                    id="sites-contractStatus" 
                                    className="select" 
                                    init={ contractStatus } 
                                    width="330px" 
                                    options={{inactive: "Not Active", active: "Active"}} 
                                    selected={ contractStatus || "Not active" } 
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

ListedPostedSiteDetails.defaultProps = {
    user: {},
    sitesInfo: {},
    currentSite: {}
}

ListedPostedSiteDetails.propTypes = {
    user: PropTypes.object.isRequired,
    sitesInfo: PropTypes.object.isRequired,
    currentSite: PropTypes.object.isRequired
}

export default connect(store=>{
    return {
        user: store.user.info,
        sitesInfo: store.sites.info,
        currSite: store.sites.info.activeSite
    }
})(ListedPostedSiteDetails);

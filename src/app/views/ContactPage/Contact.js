import React from 'react';
import { connect } from 'react-redux';
import './contact.css';
import { withStyles } from '@material-ui/core/styles';
import  { Footer, HeaderMain, YelloDash, FiremattersMap } from 'components';
import { ContactForm } from 'forms';
import { LocationOn, Phone, PhoneIphone, Email } from '@material-ui/icons'

const styles = theme => ({
    icons: {
        color: "#ED2431",
        fontSize: "17px"
    }
})
@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class Contact extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const { classes } = this.props;
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                    <YelloDash header = "Contact Us" sub = "Use the information below to reach us" />
                    {/**since the yellodash is absolutely positioned space needs to be created */}
                    <span className="absolute-150"/>
                </div>
                <div className="mid contact side-margin-90">
                    <div className="map left">
                        <FiremattersMap lat={ -27.4449377 } lng={ 153.169647 } width={ window.innerWidth > 600?"60%":"100%" } height= { window.innerWidth > 600?400:300 } zoom={ 14 } />
                    </div>
                    <div className="addresses right">
                        <span className="header">Fire Matters HQ</span>
                        <span id="hqAddress" className="address-dets">
                            <span>
                                <LocationOn className = { classes.icons } /> 
                                <span className="text">Wynnum central 4178, Qld</span>
                            </span>
                            <span>
                                <Phone className = { classes.icons } /> 
                                <span className="text">(07) 3071 9088</span>
                            </span>
                            <span>
                                <PhoneIphone className = { classes.icons } /> 
                                <span className="text">0409 993 785</span>
                            </span>
                            <span>
                                <Email className = { classes.icons } />
                                <span className="text">info@firematters.com.au</span>
                            </span>
                        </span>
                        <span className="header">Fire Matters Tenders</span>
                        <span id="tendersAddress" className="address-dets">
                            <span>
                                <LocationOn className = { classes.icons } /> 
                                <span className="text">Wynnum central 4178, Qld</span>
                            </span>
                            <span>
                                <Phone className = { classes.icons } /> 
                                <span className="text">(07) 3071 9088</span>
                            </span>
                            <span>
                                <PhoneIphone className = { classes.icons } /> 
                                <span className="text">0409 993 785</span>
                            </span>
                            <span>
                                <Email className = { classes.icons } />
                                <span className="text">info@firematters.com.au</span>
                            </span>
                        </span>
                    </div>
                    <div className="clear"/>
                    <ContactForm />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Contact);
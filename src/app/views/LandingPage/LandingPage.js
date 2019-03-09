import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import  { CallToAction, LandingInfo, Footer, HeaderMain } from 'components';
import './landingPage.css';

@connect(store=>{
    return{
        userInfo: store.user.info,
        search: store.search,
        genInfo: store.genInfo.info,
        profileInfo: store.user.info.profileInfo,
        siteData: store.user.info.submitSite,
        listingsInfo: store.listingsInfo.info,
        sitesInfo: store.sites.info,
        tendersInfo: store.tenders.info,
        messagesInfo: store.messages.info,
        messageData: store.user.info.submitMessage,
        subContractorData: store.user.info.addSubContractor,
        subContractorsInfo: store.subContractors.info
    }
})
class LandingPage extends React.Component{
    constructor(props){
        super(props)
    }

    componentWillReceiveProps(nextProps){
        this.props={...nextProps}
    }

    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain  
                    />
                    <CallToAction />
                </div>
                <div className="mid">
                    <LandingInfo />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage);
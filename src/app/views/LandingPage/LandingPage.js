import React from 'react';
import  { CallToAction, LandingInfo, Footer, HeaderMain } from 'components';

const LandingPage = ()=>{
    return(
        <div className="main">
            <div className="top">
                <HeaderMain />
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

export default LandingPage;
import React from 'react';
import { connect } from 'react-redux';
import  { CallToAction, LandingInfo, Footer, HeaderMain } from 'components';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
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
}

export default App;
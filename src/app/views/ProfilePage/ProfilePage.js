import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedUserInfo } from 'extras/dispatchers';
import { HeaderMain, Footer } from 'components';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderMain />
                </div>
                <div className="mid">
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

ProfilePage.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

ProfilePage.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default ProfilePage;
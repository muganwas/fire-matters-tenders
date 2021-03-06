import React from 'react';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from 'extras/dispatchers';
import HeaderAlt from 'components/HeaderAlt/HeaderAlt';
import SignupForm from 'forms/SignupForm/SignupForm';
import Footer from 'components/Footer/Footer';
import './signup.css';
import PropTypes from 'prop-types';

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class Signup extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderAlt loc="signup" header="Sign up" sub="Login and connect with leading service providers in Australia" />
                </div>
                <div className="form mid">
                    <SignupForm />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

Signup.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

Signup.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default Signup;
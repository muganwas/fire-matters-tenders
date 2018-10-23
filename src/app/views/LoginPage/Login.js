import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { HeaderAlt, Footer } from 'components';
import { LoginForm } from 'forms';
import './login.css'

@connect((store)=>{
    return {
        user: store.user,
        search: store.search,
        genInfo: store.genInfo
    }
})
class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
            <div className="main">
                <div className="top">
                    <HeaderAlt loc="login" header="Login" sub="Login and connect with leading service providers in Australia" />
                </div>
                <div className="form mid">
                    <LoginForm history={ this.props.history } />
                </div>
                <div className="bottom">
                    <Footer />
                </div>
            </div>
        )
    }
}

Login.defaultProps = {
    user: {},
    search: {},
    genInfo: {}
}

Login.propTypes = {
    user: PropTypes.object.isRequired,
    search: PropTypes.object.isRequired,
    genInfo: PropTypes.object.isRequired
}

export default withRouter(Login);
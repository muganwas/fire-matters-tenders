import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './publicProfileImage.css';

class PublicProfileImage extends Component {
    constructor(props){
        super(props)
    }

    render(){
        let { avatarURL } = this.props;
        return(
            <div id="public-profile-avatar" className="avContainer">
                <div className="avator">
                    <div className="roundPic">
                        <img id="avator" alt="" src = { avatarURL } />
                    </div>
                </div>
            </div>
        )
    }
}

PublicProfileImage.defaultProps = {
    avatarUrl: ""
}

PublicProfileImage.propTypes = {
    avatarURL: PropTypes.string
}

export default PublicProfileImage;
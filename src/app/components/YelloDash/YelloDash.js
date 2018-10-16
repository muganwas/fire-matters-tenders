import React from 'react';
import { PropTypes } from 'prop-types';
import './yelloDash.css';

function YelloDash(props){
    const { header, sub } = props;
    return(
        <div className="dash">
            <span id="header">{ header }</span>
            <span id="sub">{ sub }</span>
        </div>
    )

}

YelloDash.defaultProps = {
    header: null,
    sub: null
}

YelloDash.propTypes = {
    header: PropTypes.string.isRequired,
    sub: PropTypes.string.isRequired
}

export default YelloDash;

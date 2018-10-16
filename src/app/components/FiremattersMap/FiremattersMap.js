import React, { Component } from 'react';
import './map.css';
import { PropTypes } from 'prop-types';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

class FiremattersMap extends Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Map google={ this.props.google }
            initialCenter={{
                lat: this.props.lat,
                lng: this.props.lng
            }}
            style = {
                { width: this.props.width, height: this.props.height }
            }
            zoom={ this.props.zoom }>
                <Marker name={'Current location'} />
            </Map>
        )
    }
}

FiremattersMap.defaultProps = {
    lat: null,
    lng: null,
    width: 200,
    height: 200,
    zoom: 1
}

FiremattersMap.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired
}

export default GoogleApiWrapper({
    apiKey: process.env.API_KEY
  })(FiremattersMap);
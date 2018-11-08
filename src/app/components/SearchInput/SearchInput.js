import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatchedGenInfo } from 'extras/dispatchers';
import './searchInput.css'


@connect((store)=>{
    return {
        searchInfo: store.search.info,
    }
})
class SearchInput extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        this.props = {...nextProps};
    }

    render(){
        return(
            <div className={this.props.className}><input placeholder={ this.props.placeholder } type="text" onChange={this.props.search} /><i className="material-icons">search</i></div>
        )
    }
}

SearchInput.defaultProps = {
    search: {},
}

SearchInput.propTypes = {
    search: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    search: PropTypes.func,
    placeholder: PropTypes.string.isRequired
}

export default SearchInput;
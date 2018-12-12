import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
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

    onPressEnter = (e)=>{
        e.persist();
        let keyCode = e.keyCode,
        term = e.target.value;
        if(keyCode === 13){
            this.props.search(term).then(res=>{
                this.goToSearchPage();
            }); 
        }
    }

    goToSearchPage = ()=> {
        this.props.history.push('/search');
    }

    render(){
        let dispatchSearchTerm = this.props.search;
        return(
            <div className={this.props.className}>
                <input 
                    placeholder={ this.props.placeholder } 
                    onChange={ (e)=>{ dispatchSearchTerm(e.target.value) } } 
                    onKeyDown = { this.onPressEnter }
                    type="text"
                 />
                <i onClick = {this.goToSearchPage} className="material-icons searchIcon">search</i>
            </div>
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

export default withRouter(SearchInput);
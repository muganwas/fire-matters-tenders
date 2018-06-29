import React from 'react';
import { connect } from 'react-redux';
import { dispatchedUserInfo } from './exras/dispatchers';
import helperFunctions from './exras/helperFunctions';

@connect((store)=>{
    return {
        user: store.user
    }
})
class App extends React.Component {
    constructor(props) {
        super(props);
        let user = {
            name: "steven",
            email: "stevenmuganwa@live.com",
            loggedIn: true
        }
        this.props.dispatch(dispatchedUserInfo(user));
    }
    
    render(){
        return(
            <div className="wrapper theme-1-active pimary-color-green">
                <div>Fire Matters Documents</div>
            </div>
        )
    }
}

export default App;
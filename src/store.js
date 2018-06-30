import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
//import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import userReducer from './extras/reducers/userReducer';
import searchReducer from './extras/reducers/userReducer';

const middleware = applyMiddleware(promise(), thunk);
const allReducers = combineReducers({
    user: userReducer,
    search: searchReducer
})
const store = createStore(
    allReducers, 
    middleware 
)

export default store
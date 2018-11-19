import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import userReducer from 'extras/reducers/userReducer';
import searchReducer from 'extras/reducers/searchReducer';
import genInfoReducer from 'extras/reducers/genInfoReducer';
import listingsReducer from 'extras/reducers/listingsReducer';
import secondarySearchReducer from 'extras/reducers/secondarySearchReducer';
import textFieldReducer from 'extras/reducers/texfieldReducer';
import buttonsReducer from 'extras/reducers/buttonsReducer';
import tendersReducer from 'extras/reducers/tendersReducer';
import sitesReducer from './extras/reducers/sitesReducer';
import messagesReducer from './extras/reducers/messagesReducer';
import subContractorsReducer from './extras/reducers/subContractorsReducer';


const middleware = applyMiddleware(promise(), thunk, logger);
const allReducers = combineReducers({
    user: userReducer,
    search: searchReducer,
    textFields: textFieldReducer,
    secondarySearch: secondarySearchReducer,
    genInfo: genInfoReducer,
    listingsInfo: listingsReducer,
    buttonsInfo: buttonsReducer,
    tenders: tendersReducer,
    sites: sitesReducer,
    messages: messagesReducer,
    subContractors: subContractorsReducer
})
const store = createStore(
    allReducers, 
    middleware 
)

export default store
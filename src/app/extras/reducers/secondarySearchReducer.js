const defaultState = {
    info: {
      searchCategory: "all"
    },
    fetching: false,
    fetched: false,
    error: null
  }
  const secondarySearchReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_SECONDARY_SEARCH_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_SECONDARY_SEARCH_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_SECONDARY_SEARCH_FULFILLED":{
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              info: action.payload.info
            }
          }
          default:
            return state;
      }  
  }
  
  export default secondarySearchReducer;
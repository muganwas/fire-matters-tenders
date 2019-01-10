const defaultState = {
    info: {
    },
    fetching: false,
    fetched: false,
    error: null
  }
  const SecondarySelectReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_SECONDARY_SELECT_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_SECONDARY_SELECT_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_SECONDARY_SELECT_FULFILLED":{
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              info: action.payload.info
            }
          }
          case "USER_LOGOUT":{
            return {
               state
            }
          }
          default:
            return state;
      }  
  }
  
  export default SecondarySelectReducer;
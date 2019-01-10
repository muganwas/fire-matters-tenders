const defaultState = {
    info: {},
    fetching: false,
    fetched: false,
    error: null
  }
  const textFieldReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_TEXFIELD_INFO_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_TEXFIELD_INFO_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_TEXFIELD_INFO_FULFILLED":{
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
  
  export default textFieldReducer;
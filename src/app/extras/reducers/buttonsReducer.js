const defaultState = {
    info: {
        login: {
            active: true
        },
        signup: {
            active: true
        }
    },
    fetching: false,
    fetched: false,
    error: null
  }
  const buttonsReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_BUTTON_INFO_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_BUTTON_INFO_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_BUTTON_INFO_FULFILLED":{
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
  
  export default buttonsReducer;
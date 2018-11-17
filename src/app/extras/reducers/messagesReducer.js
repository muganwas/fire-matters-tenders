const defaultState = {
    info: {
      messageForm:{
        errors: {},
        show:false
      },
      sites:{}
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const messagesReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_MESSAGES_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_MESSAGES_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_MESSAGES_FULFILLED":{
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
  
  export default messagesReducer;
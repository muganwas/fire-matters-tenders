const defaultState = {
    info: {
        signupInfo:{},
        filter: {},
        serviceProviders: {}
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const serviceProvidersReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_SERVICE_PROVIDERS_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_SERVICE_PROVIDERS_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_SERVICE_PROVIDERS_FULFILLED":{
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              info: action.payload.info
            }
          }
          case "USER_LOGOUT":{
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              info: defaultState.info
            }
          }
          default:
            return state;
      }  
  }
  
  export default serviceProvidersReducer;
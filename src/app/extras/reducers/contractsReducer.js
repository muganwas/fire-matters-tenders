const defaultState = {
    info: {
        contracts: {}
    },
    fetching: false,
    fetched: false,
    error: null
  }
  const contractsReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_CONTRACTS_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_CONTRACTS_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_CONTRACTS_FULFILLED":{
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
  
  export default contractsReducer;
const defaultState = {
    info: {
      createForm: {
        errors: {},
        show: false
      },
      listedJobDetails: {
        show: false
      },
      tenderForm: {
        errors:{},
        show: false
      },
      filter: {},
      postedTenders: {
        overLay:{
          show: false
        }
      },
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const listingsReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_LISTINGS_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_LISTINGS_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_LISTINGS_FULFILLED":{
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
  
  export default listingsReducer;
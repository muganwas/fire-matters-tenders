const defaultState = {
    info: {
      tenders: null,
      editTenderForm:{
        show: false,
        feedback: undefined,
        feedbackClass: "hidden"
      }
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const tendersReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_TENDERS_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_TENDERS_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_TENDERS_FULFILLED":{
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
  
  export default tendersReducer;
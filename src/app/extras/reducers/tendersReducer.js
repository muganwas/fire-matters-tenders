const defaultState = {
    info: {
      tenders: null,
      inviteToTender: {
        sender: null,
        recipient: null,
        message: "",
        currTenderType: null,
        currLister: null,
        showForm: false,
        error: false,
        feedback: null,
        feedbackClass: "hidden",
        submitButton: {
          text: "Send Invite",
          isActive: true
        }
      },
      selectedPostedTender: {
        tenderInfo: {},
        show: false
      },
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
  
  export default tendersReducer;
const defaultState = {
    info: {
      sites:{},
      activeSite: {},
      forRemoval: {
        confirmButton: {
          isActive: true
        },
        confirmationDialog: false,
      },
      addEquipment: {
        submitButton:{
          isActive: true
        }
      },
      detailsView: {
        show: false
      },
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const sitesReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_SITES_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_SITES_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_SITES_FULFILLED":{
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
  
  export default sitesReducer;
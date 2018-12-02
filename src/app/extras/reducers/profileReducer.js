const defaultState = {
    info: {
      activeProfile:{},
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const ProfileReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_PROFILE_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_PROFILE_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_PROFILE_FULFILLED":{
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
  
  export default ProfileReducer;
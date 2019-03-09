const defaultState = {
    info: {
      activeProfile:{},
      visualProps: {
        columnClass: "half left",
        windowWidth: undefined
      },
      editing:{
        personnel: { 
          disabled: true,
          edit: "enabled"
        },
        company: { 
          disabled: true,
          edit: "enabled"
        },
        insurance: { 
          disabled: true,
          edit: "enabled"
        }
        ,
        license: { 
          disabled: true,
          edit: "enabled"
        } 
      }
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
          case "USER_LOGOUT":{
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              info: state.info
            }
          }
          default:
            return state;
      }  
  }
  
  export default ProfileReducer;
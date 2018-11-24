const defaultState = {
    info: {
      subContractors: {},
      currentTab: "personnel",
      currentSub: {
        addEquipment: {
          mainCategory: null,
          subCategory: null,
          submitButton: {
            isActive: true
          }
        }
      },
      detailsView: {
        show: false
      },
      subContractorForm:{
        errors: {},
        show:false
      }
     },
    fetching: false,
    fetched: false,
    error: null
  }
  const SubContractorsReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_SUBCONTRACTOR_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_SUBCONTRACTOR_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_SUBCONTRACTOR_FULFILLED":{
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
  
  export default SubContractorsReducer;
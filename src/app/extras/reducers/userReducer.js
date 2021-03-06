const defaultState = {
    info: {
      state: "Select State",
      loginInfo: {
        messageClass: "postSubmitMessage"
      },
      createListing: {
        listingCompanyName: null,
        listingState: null,
        listingCity: null,
        listingCategory: null,
        listingCategoryOther: null,
        listingEquipmentCategory: null,
        listingEquipment: null,
        listingEquipmentQuantity: null,
        listingContractType: null,
        listingStartDate: null,
        feedback: undefined,
        feedbackClass: "hidden",
        submitButton: {
          isActive: true
        }
      },
      profileInfo:{ },
      avatarProps: {
        feedback: undefined,
        levelId: "nkkt",
        picState: "roundPic",
        avatarURL: undefined
      },
      signupInfo: {}
    },
    fetching: false,
    fetched: false,
    error: null
  }
  const userReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_USER_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_USER_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_USER_FULFILLED":{
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
  
  export default userReducer;
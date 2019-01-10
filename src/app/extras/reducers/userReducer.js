const defaultState = {
    info: {
      state: "Select State",
      signUpInfo:{
        submitButton: {
          isActive: true
        }
      },
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
      submitTender: {
        tenderListingId: null,
        tenderCompanyName: null,
        tenderRate: null,
        tenderStartDate: null,
        tenderEndDate: null,
        tenderCoverLetter: null,
        feedback: undefined,
        feedbackClass: "hidden",
        submitButton: {
          isActive: true
        }
      },
      submitSite: {
        siteName: null,
        siteLocation: null,
        currentContractor: null,
        siteContractStatus: null,
        feedback: undefined,
        feedbackClass: "hidden",
        submitButton: {
          isActive: true
        }
      },
      submitMessage: {
        messageBody: null,
        feedback: undefined,
        feedbackClass: "hidden",
        submitButton: {
          isActive: true
        }
      },
      addSubContractor: {
        contractorFullName: null,
        contractorCompanyName: null,
        contractorPhoneNumber: null,
        contractorMobileNubmer: " ",
        contractorEmailAddress: null,
        contractorState: null,
        contractorCity: null,
        contractorSuburb: null,
        contractorArea: null,
        contractorStreet: null,
        feedback: undefined,
        feedbackClass: "hidden",
        submitButton: {
          isActive: true
        }
      },
      addEquipment: {
        mainCategory: null,
        subCategory: null,
        submitButton: {
          isActive: true
        }
      },
      addServiceCategory: {
        submitButton: {
          isActive: true
        }
      },
      addCompanyUser: {
        submitButton: {
          isActive: true,
          text: "Invite User"
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
          case "USER_LOGOUT":{
            return {
               state
            }
          }
          default:
            return state;
      }  
  }
  
  export default userReducer;
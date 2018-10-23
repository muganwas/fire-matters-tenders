const defaultState = {
    info: {
      menu: "Main-Menu",
      signupFormLevel: 1,
      textfieldClass: "textfield",
      errors: {
        tmcError: undefined,
        phoneNumberError: undefined,
        emailFormatError: undefined,
        passwordMatchError: undefined,
        usernameError: undefined
      },
      messages: {
        messageClass: "postSubmitMessage"
      },
      signUpProgressBar: {
        oneClass: "one current",
        twoClass: "two",
        threeClass: "three"
      },
      dropDown:{
        dropDownClass: "hidden options-list"
      }
    },
    fetching: false,
    fetched: false,
    error: null
  }
  const genInfoReducer = (state = defaultState, action)=>{
      switch(action.type){
          case "FETCH_GEN_PENDING":{
            return {...state,
              fetched: false,
              error: null,
              fetching: true
            }
          }
          case "FETCH_GEN_REJECTED":{
            return {...state,
              fetching: false,
              fetched: false,
              error: action.payload
            }
          }
          case "FETCH_GEN_FULFILLED":{
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
  
  export default genInfoReducer;
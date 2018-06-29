export function dispatchedUserInfo (userInfo) {
    if(userInfo !== undefined && userInfo !== null){   
      return {
            type: "FETCH_USER_FULFILLED",
            payload: {
                info: userInfo
            }
        }
    }else{
        return {
            type: "FETCH_USER_REJECTED",
            payload: {
                error: "could not fetch user details"
            }
        } 
    }
}
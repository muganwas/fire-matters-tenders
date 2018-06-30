export function dispatchedUserInfo(userInfo) {
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
export function dispatchedSearchInfo(searchInfo) {
    if(searchInfo !== undefined && searchInfo !== null){   
      return {
            type: "FETCH_USER_FULFILLED",
            payload: {
                info: searchInfo
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
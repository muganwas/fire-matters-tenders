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
            type: "FETCH_SEARCH_FULFILLED",
            payload: {
                info: searchInfo
            }
        }
    }else{
        return {
            type: "FETCH_SEARCH_REJECTED",
            payload: {
                error: "could not fetch search details"
            }
        } 
    }
}

export function dispatchedSecondarySearchInfo(searchInfo) {
    if(searchInfo !== undefined && searchInfo !== null){   
      return {
            type: "FETCH_SECONDARY_SEARCH_FULFILLED",
            payload: {
                info: searchInfo
            }   
        }
    }else{
        return {
            type: "FETCH_SECONDARY_SEARCH_REJECTED",
            payload: {
                error: "could not fetch search details"
            }
        } 
    }
}

export function dispatchedSecondarySelectInfo(selectInfo) {
    if(selectInfo !== undefined && selectInfo !== null){   
      return {
            type: "FETCH_SECONDARY_SELECT_FULFILLED",
            payload: {
                info: selectInfo
            }   
        }
    }else{
        return {
            type: "FETCH_SECONDARY_SEARCH_REJECTED",
            payload: {
                error: "could not fetch search details"
            }
        } 
    }
}

export function dispatchedTextFieldInfo(Info) {
    if(Info !== undefined && Info !== null){   
      return {
            type: "FETCH_TEXFIELD_INFO_FULFILLED",
            payload: {
                info: Info
            }   
        }
    }else{
        return {
            type: "FETCH_TEXFIELD_INFO_REJECTED",
            payload: {
                error: "could not fetch textfield details"
            }
        } 
    }
}

export function dispatchedButtonInfo(Info) {
    if(Info !== undefined && Info !== null){   
      return {
            type: "FETCH_BUTTON_INFO_FULFILLED",
            payload: {
                info: Info
            }   
        }
    }else{
        return {
            type: "FETCH_BUTTON_INFO_REJECTED",
            payload: {
                error: "could not fetch button details"
            }
        } 
    }
}

export function dispatchedListingsInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_LISTINGS_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_LISTINGS_REJECTED",
            payload: {
                error: "could not fetch listing details"
            }
        } 
    }
}

export function dispatchedServiceProvidersInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_SERVICE_PROVIDERS_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_SERVICE_PROVIDERS_REJECTED",
            payload: {
                error: "could not fetch service providers details"
            }
        } 
    }
}

export function dispatchedTendersInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_TENDERS_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_TENDERS_REJECTED",
            payload: {
                error: "could not fetch tender details"
            }
        } 
    }
}

export function dispatchedSubContractorsInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_SUBCONTRACTOR_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_SUBCONTRACTOR_REJECTED",
            payload: {
                error: "could not fetch sub-contractor details"
            }
        } 
    }
}

export function dispatchedSitesInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_SITES_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_SITES_REJECTED",
            payload: {
                error: "could not fetch site details"
            }
        } 
    }
}

export function dispatchedMessagesInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_MESSAGES_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_mESSAGES_REJECTED",
            payload: {
                error: "could not fetch message details"
            }
        } 
    }
}

export function dispatchedGenInfo(info) {
    if(info !== undefined && info !== null){   
      return {
            type: "FETCH_GEN_FULFILLED",
            payload: { info }
        }
    }else{
        return {
            type: "FETCH_GEN_REJECTED",
            payload: {
                error: "could not fetch general information details"
            }
        } 
    }
}
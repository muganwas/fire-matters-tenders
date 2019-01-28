const defaultState = {
    info: {
      genSites: {},
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
      createListing:{
        show: false
      },
      createSite:{
          defaultEquipmentObject: {
            detectionAndWarningSystem:{
                firePanel: false,
                specialHazardSystem: false,
                emergencyWarningSystem: false,
                intercomSystem: false,
                equipCount: {
                  firePanel: 1,
                  specialHazardSystem: 1,
                  emergencyWarningSystem: 1,
                  intercomSystem: 1               
                }
            },
            mechanicalEquipment: {
                pump: false,
                sprinklerSystem: false,
                hydrantSystem: false,
                combinedSprinkler: false,
                waterStorageTank: false,
                equipCount: {
                  pump: 1,
                  sprinklerSystem: 1,
                  hydrantSystem: 1,
                  combinedSprinkler: 1,
                  waterStorageTank: 1,
                }
            },
            specialHazard: {
                vehicleSuppressionSystem: false,
                gaseousFireExtinguishingSystem: false,
                equipCount: {
                  vehicleSuppressionSystem: 1,
                  gaseousFireExtinguishingSystem: 1,
                }
            },
            portableFireFightingEquipment: {
                hoseReel: false,
                extinguisher: false,
                fireBlanket: false,
                deliveryLayFlatHose: false,
                equipCount: {
                  hoseReel: 1,
                  extinguisher: 1,
                  fireBlanket: 1,
                  deliveryLayFlatHose: 1
                }
            },
            passiveFireProtection: {
                fireDoors: false,
                servicePenetration: false,
                equipCount: {
                  fireDoors: 1,
                  servicePenetration: 1
                }
            },
            emergencyExitLighting: {
                emergencyLight: false,
                equipCount: {
                  emergencyLight: 1
                }
            }
        },
        addEquipmentButton: {
          isActive: true
        },
        submitButton: {
          isActive: true
        },
        show: false
      }
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
            return {...state,
              fetched: true,
              fetching: false,
              error: false,
              info: defaultState.info
            }
          }
          default:
            return state;
      }  
  }
  
  export default sitesReducer;
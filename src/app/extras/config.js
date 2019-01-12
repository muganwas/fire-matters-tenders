import firebase from 'firebase/app';

export const listingCategories = {
    all: "All Categories",
    maintenance: "Maintenance",
    repair: "Repair",
    evacTraining: "EvacTraining",
    other: "Other"
}

export const serviceCategories = {
    maintenance: "Maintenance",
    repair: "Repair",
    evacTraining: "Evac-Training",
    other: "Other"
}

export const subContractorsSearchCategories = {
    all: "All",
    emailAddress: "Email Address",
    companyName: "Company Name"
}

const config = {
    apiKey: "AIzaSyDjQJOScdSQ5CAV-YNuf-vzxgh4GOvRlwc",
    authDomain: "firematters-cbaf0.firebaseapp.com",
    databaseURL: "https://firematters-cbaf0.firebaseio.com",
    projectId: "firematters-cbaf0",
    storageBucket: "firematters-cbaf0.appspot.com",
    messagingSenderId: "544850561778"
};
firebase.initializeApp(config);

export const statesAustralia = {
    NSW: "New South Wales",
    Qld: "Queensland",
    SA: "South Australia",
    Tas: "Tasmania",
    Vic: "Victoria",
    WA: "Western Australia",
    ACT: "Australian Capital Territory",
    JBT: "Jervis Bay Territory",
    NT: "Norther Territory"
}

export const ownerOccupierOptions = {
    Profile: "Profile",
    Tenders: "My Listings",
    Contracts: "Contracts",
    Sites: "Sites",
    Messages: "Comments"
}

export const tenderOptions = {
    more:"View More..."
}

export const messagesTabs = {
    posted:"Posted Comments",
    recieved:"Recieved Comments"
}

export const listedPostedTendersOptions = { more: "View More..." }
export const listedPostedSitesOptions = { delete: "Delete", more: "View More..." }

export const serviceProviderOptions = {
    Profile: "Profile",
    Tenders: "Tenders",
    Contracts: "Contracts",
    Subcontractors: "Sub-Contractors",
    Messages: "Comments"
}

export const menuIconTitles = {
    Profile: "assignment_ind",
    Tenders: "list_alt",
    Contracts: "work",
    ServiceProviders: "build",
    Messages: "forum",
    Subcontractors: "group",
    Sites: "domain"
}

export const userTypes = {
    owner_occupier: "Owner/Occupier",
    service_provider: "Service provider"
}

export const equipmentCategories = {
    detectionAndWarningSystem: "Detection & Warning Systems",
    portableFireFightingEquipment: "Portable Equipment",
    mechanicalEquipment: "Mechanical Equipment",
    specialHazard: "Special Hazard",
    emergencyPlanning: "Emergency Planning",
    passiveFireProtection: "Passive Protection Equipment",
    emergencyExitLighting: "Emergency Exit Lighting"
}

export const equipmentCategoriesFull = {
    detectionAndWarningSystem: {
        firePanel: "Fire Panel",
        specialHazardSystem: "Special Hazard System",
        emergencyWarningSystem: "Emergency Warning System",
        intercomSystem: "Intercom System"
    },
    mechanicalEquipment: {
        pump: "Pump",
        sprinklerSystem: "Sprinkler System",
        hydrantSystem: "Hydrant System",
        combinedSprinkler: "Combined Sprinkler",
        waterStorageTank: "Water Storage Tank"
    },
    specialHazard: {
        vehicleSuppressionSystem: "Vehicle Suppression System",
        gaseousFireExtinguishingSystem:"Gaseous Fire Extinguishing System"
    },
    emergencyPlanning: {
        evacTraining: "Evacuation Training",
        fireSafetyAudit: "Fire Safety Audit",
        fireSafetyAdvisor: "Fire Safety Advisor",
        warden: "Warden/Deputy",
        generalOccupancyTraining: "General Occupancy Training",
        firstResponseTraining: "First Response Training",
        evacuationExercise: "Evacuation Exercise"
    },
    portableFireFightingEquipment: {
        hoseReel: "Hose Reel",
        extinguisher: "Extinguisher",
        fireBlanket: "Fire Blanket",
        deliveryLayFlatHose: "Delivery Lay Flat Hose"
    },
    passiveFireProtection: {
        fireDoors: "Fire Doors",
        servicePenetrations: "Service Penetrations"
    },
    emergencyExitLighting: {
        emergencyLight: "Emergency/Exit Light"
    }
}

export const detectionAndWarningSystem = {
    firePanel: "Fire Panel",
    specialHazardSystem: "Special Hazard System",
    emergencyWarningSystem: "Emergency Warning System",
    intercomSystem: "Intercom System"
}

export const mechanicalEquipment = {
    pump: "Pump",
    sprinklerSystem: "Sprinkler System",
    hydrantSystem: "Hydrant System",
    combinedSprinkler: "Combined Sprinkler",
    waterStorageTank: "Water Storage Tank"
}

export const specialHazard = {
    vehicleSuppressionSystem: "Vehicle Suppression System",
    gaseousFireExtinguishingSystem:"Gaseous Fire Extinguishing System"
}

export const emergencyPlanning = {
    evacTraining: "Evacuation Training",
    fireSafetyAudit: "Fire Safety Audit",
    fireSafetyAdvisor: "Fire Safety Advisor",
    warden: "Warden/Deputy",
    generalOccupancyTraining: "General Occupancy Training",
    firstResponseTraining: "First Response Training",
    evacuationExercise: "Evacuation Exercise"
}

export const portableFireFightingEquipment = {
    hoseReel: "Hose Reels",
    extinguisher: "Extinguishers",
    fireBlanket: "Fire Blanket",
    deliveryLayFlatHose: "Delivery Lay Flat Hose"
}

export const passiveFireProtection = {
    fireDoorsCA: "Fire Doors",
    servicePenetrations: "Service Penetrations",
    totalPassiveFireProtection: "PassiveFire Protection"
}

export const emergencyExitLighting = {
    emergencyLight: "Emergency/Exit Light"
}

export const contractTypes = {
    1: "1 year",
    2: "2 years",
    3: "3 years",
    5: "5 years",
    custom: "Custom"
}

export const ownerOccupierProfileTabs = {
    personnel: "Profile",
    company: "Company"
}

export const serviceProviderProfileTabs = {
    personnel: "Profile",
    company: "Company",
    insurance: "Insurance",
    license: "License",
    equipment: "Equipment",
}

export const subContractorProfileTabs = {
    personnel: "Profile",
    company: "Company",
    insurance: "Insurance",
    license: "License",
    equipment: "Equipment",
}
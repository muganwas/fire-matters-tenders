import firebase from 'firebase/app';

export const listingCategories = {
    all: "All",
    maintenance: "Maintenance",
    repair: "Repair",
    evacTraining: "Evacuation Training",
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
    Tenders: "Tenders",
    Contracts: "Contracts",
    Sites: "Sites",
    Messages: "Messages"
}

export const listedPostedTendersOptions = { 1: "View More..." }
export const listedPostedSitesOptions = { 1: "View More..." }

export const serviceProviderOptions = {
    Profile: "Profile",
    Tenders: "Listings",
    Contracts: "Contracts",
    Subcontractors: "Sub-Contractors",
    Messages: "Messages"
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

export const ownerOccupierProfileTabs = {
    personnel: "Personnel",
    company: "Company"
}

export const equipmentCategories = {
    detectionAndWarningSystems: "Detection & Warning Systems",
    portableEquipment: "Portable Equipment",
    passiveProtection: "Passive Protection Equipment",
    emergencyExitLighting: "Emergency Exit Lighting"
}

export const detectionAndWarningSystems = {
    fireDetectionAndWarningSystem: "Fire Detection & Warning System",
    smokeAndHeatAlarms: "Smoke & Heat Alarms",
    smokeExhaustSystem: "Smoke Exhaust System"
}

export const portableEquipment = {
    hoseReels: "Hose Reels",
    extinguishers: "Extinguishers"
}

export const passiveProtection = {
    fireDoorsCA: "Fire Doors(Common Area)",
    fireDoorsA: "Fire Doors(Appartment)",
    fireDoorsS: "Fire Doors(Sliding)",
    servicePenetrations: "Service Penetrations"
}

export const emergencyExitLighting = {
    totalEmergencyExitLighting: "Total Emergency Exit Lighting"
}

export const contractTypes = {
    longTerm: "Long-term",
    shortTerm: "Short-term"
}

export const serviceProviderProfileTabs = {
    personnel: "Personnel",
    company: "Company",
    insurance: "Insurance",
    license: "License",
    equipment: "Equipment",
}
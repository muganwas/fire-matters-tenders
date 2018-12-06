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
    evacTraining: "EvacTraining",
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

export const tenderOptions = {
    more:"View More..."
}

export const listedPostedTendersOptions = { more: "View More..." }
export const listedPostedSitesOptions = { delete: "Delete", more: "View More..." }

export const serviceProviderOptions = {
    Profile: "Profile",
    Tenders: "Tenders",
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

export const equipmentCategories = {
    detectionAndWarningSystem: "Detection & Warning Systems",
    portableFireFightingEquipment: "Portable Equipment",
    passiveFireProtection: "Passive Protection Equipment",
    emergencyExitLighting: "Emergency Exit Lighting"
}

export const equipmentCategoriesFull = {
    detectionAndWarningSystem: {
        fireDetectionAndWarningSystem: "Fire Detection & Warning System",
        smokeAndHeatAlarms: "Smoke & Heat Alarms",
        smokeExhaustSystem: "Smoke Exhaust System",
        totalDetectionAndAlarmSystem: "Total Detection & AlarmSystem"
    },
    portableFireFightingEquipment: {
        hoseReels: "Hose Reels",
        extinguishers: "Extinguishers",
        totalPortableFireFighting: "Total Portable FireFighting"
    },
    passiveFireProtection: {
        fireDoors: "Fire Doors",
        servicePenetrations: "Service Penetrations",
        totalPassiveFireProtection: "Total PassiveFire Protection"
    },
    emergencyExitLighting: {
        totalEmergencyExitLighting: "Total Emergency Exit Lighting"
    }
}

export const detectionAndWarningSystem = {
    fireDetectionAndWarningSystem: "Fire Detection & Warning System",
    smokeAndHeatAlarms: "Smoke & Heat Alarms",
    smokeExhaustSystem: "Smoke Exhaust System",
    totalDetectionAndAlarmSystem: "Total Detection & AlarmSystem"
}

export const portableFireFightingEquipment = {
    hoseReels: "Hose Reels",
    extinguishers: "Extinguishers",
    totalPortableFireFighting: "Total Portable FireFighting"
}

export const passiveFireProtection = {
    fireDoorsCA: "Fire Doors",
    servicePenetrations: "Service Penetrations",
    totalPassiveFireProtection: "Total PassiveFire Protection"
}

export const emergencyExitLighting = {
    totalEmergencyExitLighting: "Total Emergency Exit Lighting"
}

export const contractTypes = {
    1: "1 year",
    2: "2 years",
    3: "3 years",
    5: "5 years",
    custom: "Custom"
}

export const ownerOccupierProfileTabs = {
    personnel: "Personnel",
    company: "Company"
}

export const serviceProviderProfileTabs = {
    personnel: "Personnel",
    company: "Company",
    insurance: "Insurance",
    license: "License",
    equipment: "Equipment",
}

export const subContractorProfileTabs = {
    personnel: "Personnel",
    company: "Company",
    insurance: "Insurance",
    license: "License",
    equipment: "Equipment",
}
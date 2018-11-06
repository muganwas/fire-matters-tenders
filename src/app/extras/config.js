import firebase from 'firebase/app';

export const listingCategories = {
    all: "All",
    maintenance: "Maintenance",
    repair: "Repair",
    evacTraining: "Evacuation Training",
    other: "Other"
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
    ServiceProviders: "Service Providers",
    Messages: "Messages",
    Sites: "Sites"
}

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

export const ownerOccupierProfileTabs = {
    personnel: "Personnel",
    company: "Company"
}

export const serviceProviderProfileTabs = {
    personnel: "Personnel",
    company: "Company",
    insurance: "Insurance",
    license: "License",
    ratesScedule: "Rates Schedule",
}
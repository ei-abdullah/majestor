const generateYearList = () => {
    const startYear = new Date().getFullYear();
    const endYear = 2007;
    const years = [];

    for (let year = startYear; year >= endYear; year--) {
        years.push({id: year.toString(), name: year.toString()});
    }

    return years;
}

export const type = [
    {id: 'PAST_PAPER', name: 'Past Paper'},
    {id: 'QUIZ', name: 'Quiz'},
    {id: 'NOTES', name: 'Notes'},
    {id: 'ASSIGNMENT', name: 'Assignment'},
    {id: 'PROJECT', name: 'Project'},
    {id: 'REPORT', name: 'Report'},
    {id: 'OTHER', name: 'Other'},
]

export const filterByLike = [
    {id: 'true', name: 'Most'},
    {id: 'false', name: 'Least'}
]

export const semesterType = [
    {id: 'FALL', name: 'Fall'},
    {id: 'SPRING', name: 'Spring'},
    {id: 'SUMMER', name: 'Summer'},
]

// Google Maps API Key
export const GOOGLE_API_KEY = "AIzaSyCR9iqbq620EMK2XwY_yipxEeKi8hnaOgo";

// Years list
export const years = generateYearList();
// API BASE URL
const LOCAL_IP = "192.168.18.40";

export const API_BASE_URL = __DEV__
    ? `http://${LOCAL_IP}:8080/api/v1`
    : "https://majestor-app-ynclq.ondigitalocean.app/api/v1";

export const WEBSOCKET_URL = __DEV__
    ? `ws://${LOCAL_IP}:8080/ws`
    : "https://majestor-app-ynclq.ondigitalocean.app/ws";
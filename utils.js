/* =========================================
   utils.js - Shared CRM Utilities
   ========================================= */

const stateZoneMap = {
    "Andhra Pradesh": "South", "Assam": "East", "Bihar": "East", "Chandigarh": "North",
    "Chhattisgarh": "West", "Dadra and Nagar Haveli and Daman and Diu": "West",
    "Delhi": "North", "Goa": "West", "Gujarat": "West", "Haryana": "North",
    "Himachal Pradesh": "North", "Jammu And Kashmir": "North", "Jharkhand": "East",
    "Karnataka": "South", "Kerala": "South", "Madhya Pradesh": "West",
    "Maharashtra": "West", "Manipur": "East", "Meghalaya": "East", "Nagaland": "East",
    "Odisha": "East", "Pondicherry": "South", "Punjab": "North", "Rajasthan": "North",
    "Sikkim": "East", "Tamil Nadu": "South", "Telangana": "South", "Tripura": "East",
    "Uttar Pradesh": "North", "Uttarakhand": "North", "West Bengal": "East"
};

const formatName = (str) => {
    if (!str) return "User";
    if (str.includes('@')) str = str.split('@')[0];
    return str.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const generateChildGUID = () => {
    return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
};
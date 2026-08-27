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

// Normalizes Order Type values so old records saved with legacy codes
// ("Dealer" / "Retail") display with the same labels as new records
// ("Government" / "Private"). Anything else (e.g. "SI") passes through unchanged.
const orderTypeLabel = (val) => {
    const legacyMap = { "Dealer": "Government", "Retail": "Private" };
    return legacyMap[val] || val || "";
};

const generateChildGUID = () => {
    return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0').toUpperCase();
};

// Instantly converts Excel's 5-digit serial dates into YYYY-MM-DD
const formatExcelDate = (val) => {
    if (!val) return "";
    if (!isNaN(val) && Number(val) > 20000 && Number(val) < 99999) {
        const date = new Date(Math.round((Number(val) - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
    }
    if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
        return val.split('T')[0];
    }
    return val;
};

/* =========================================
   Auth
   ========================================= */
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

// Which access levels (from user-details.xlsx -> "Level" column) may see
// each page. "User" gets Sales Order Entry + Dashboard only; "Manager" gets
// everything.
const PAGE_ACCESS = {
    'Index.html': ['User', 'Manager'],
    'dashboard.html': ['User', 'Manager'],
    'grid-queue.html': ['Manager'],
    'kanban-queue.html': ['Manager'],
    'manager-analytics-dashboard.html': ['Manager'],
    'settings.html': ['Manager']
};

function getUserLevel() {
    return sessionStorage.getItem('userLevel') || 'User';
}

// Call at the top of a restricted page's window.onload (after the login
// check). Bounces anyone whose level isn't allowed here back to the
// Dashboard, so typing the URL directly doesn't bypass the sidebar.
function enforcePageAccess() {
    const page = window.location.pathname.split('/').pop() || 'Index.html';
    const allowed = PAGE_ACCESS[page];
    if (allowed && !allowed.includes(getUserLevel())) {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// Hides sidebar links the current user's level isn't permitted to see.
// Sidebar <a> tags opt in via data-roles="User,Manager" etc.
function applySidebarAccess() {
    const level = getUserLevel();
    document.querySelectorAll('.sidebar-link[data-roles]').forEach(link => {
        const roles = link.getAttribute('data-roles').split(',').map(r => r.trim());
        if (!roles.includes(level)) link.style.display = 'none';
    });
}

/* =========================================
   Sidebar nav (mobile drawer toggle)
   ========================================= */
function toggleSidebar() {
    document.querySelector('.app-sidebar')?.classList.toggle('open');
    document.querySelector('.sidebar-backdrop')?.classList.toggle('show');
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelector('.app-sidebar')?.classList.remove('open');
        document.querySelector('.sidebar-backdrop')?.classList.remove('show');
    }
});
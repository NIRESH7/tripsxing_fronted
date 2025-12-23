import { environment } from "../environments/development.environment";
// import { environment } from "../environments/testing.environment";
// import { environment } from "../environments/production.environment";

export const currentEnvironment = environment;
const base = currentEnvironment.api.url;
// const base = testingEnvironment.api.url;

const adminRoutes = {
  // login: base + '/Authentication/Authenticate',
  // register: base + '/admin/register',
  // logout: base + '/admin/logout',
  // forgotPassword: base + '/admin/forgot-password',
  // resetPassword: base + '/admin/reset-password',
  // changePassword: base + '/admin/change-password',
  // profile: base + '/admin/profile',
  GetZohoEmployeeList: base + "/UserManager/GetZohoEmployeeList",
};

const userRoutes = {
  // register: base + '/user/register',
  // logout: base + '/user/logout',
  // forgotPassword: base + '/user/forgot-password',
  // resetPassword: base + '/user/reset-password',
  // changePassword: base + '/user/change-password',
  // profile: base + '/user/profile',
  GetUserList: base + "/UserManager/GetUserList",
  GetSingleUser: base + "/UserManager/GetSingleUser",
};

// const auth = "/admin/auth";
const auth = "/auth";

export const route = {
  frontend: {
    dashboard: "/",
    login: auth + "/login",
    logout: "/logout",
    forgetPassword: auth + "/forgetpassword",
    createPassword: auth + "/createpassword",
    oauthRedirect: "/oauthredirect",
    authPage: auth + "/authpage",
    home: "/home",
    account: "/Account",
    notFound: "/404",
    // unauthorized: '/401',
    // forbidden: base + '/403',
    // serverError: base + '/500',
    // badRequest: base + '/400',
    // unauthorizedAccess: base + '/401',
    // forbiddenAccess: base + '/403',
    // serverErrorPage: base + '/500',
  },
  backend: {
    admin: adminRoutes,

    user: userRoutes,

    uploadfile: base + "/UploadFile",

    deleteFile: base + "/deleteFile",

    deleteVideos: base + "/deleteVideos",

    uploadFileCountry: base + "/uploadFileCountry",

    login: base + "/login",

    reset: base + "/reset",

    forgotPassword: base + "/forgotpassword",

    menulist: base + "/DashboardManager/GetMenuList",

    // ? Stays
    getStays: base + "/getStays",
    getStaysHistory: base + "/getStaysHistory",
    createStay: base + "/createStay",
    updateStay: base + "/updateStay",
    deleteStay: base + "/deleteStay", // UserId/StayId
    createStayHistory: base + "/createStayHistory",
    getUserStayHistory: base + "/getUserStayHistory",

    // ? Country
    getCountries: base + "/countries",
    getCountry: base + "/country", // CountryId
    createCountry: base + "/country",
    UpdateCountry: base + "/country", // CountryId
    deleteCountry: base + "/deleteCountry", // UserId/CountryId

    // ? City
    getCities: base + "/cities",
    getCity: base + "/city", // CityId
    createCity: base + "/city",
    UpdateCity: base + "/city", // CityId/UserId
    deleteCity: base + "/deleteCity", // CityId/UserId

    // ? State
    getStates: base + "/states",
    getState: base + "/state", // StateId
    createState: base + "/state",
    UpdateState: base + "/state", // StateId/UserId
    deleteState: base + "/deleteState", // StateId/UserId

    // ? Blog
    getBlog: base + "/blog", // BlogId
    getBlogs: base + "/blogs",
    updateBlog: base + "/blog", // BlogId/:id
    deleteBlog: base + "/blog", // BlogId/:userId/:id
    createBlog: base + "/blog",

    // ? Amenities
    getAmenities: base + "/amenities",
    getAmenity: base + "/amenity", // AmenityId
    createAmenity: base + "/amenity",
    updateAmenity: base + "/amenity", // AmenityId/UserId
    deleteAmenity: base + "/deleteAmenity", // AmenityId/UserId
    deleteMultipleAmenities: base + "/deleteMultipleAmenities",

    // ? Plan
    getPlans: base + "/getPlans",
    getPlan: base + "/plan", // PlanId
    createPlan: base + "/plan",
    updatePlan: base + "/plan", // PlanId/UserId
    deletePlan: base + "/plan", // PlanId/UserId

    // ? Audit Log
    getAuditLogs: base + "/auditLogs",
    getAuditLog: base + "/auditLog", // AuditLogId
    getSubscriptionAuditLogs: base + "/subscriptionAuditLogs",

    // ? Users
    getUsers: base + "/users",
    getUser: base + "/user", // UserId
    updateUser: base + "/user", // UserId
    deleteUser: base + "/deleteUser", // UserId
    createUser: base + "/user",
    changeUserPlan: base + "/changeUserPlan", // Change user plan access
    getSubscriptionCount: base + "/subscriptionCount", // Get total subscription count
    getSubscriptions: base + "/subscriptions", // Get all subscriptions

    //Reel
    getReels: base + "/reels",
    getReel: base + "/reel", // ReelId
    uploadReel: base + "/uploadReel",
    updateReel: base + "/updatereel", // ReelId/UserId
    deleteReel: base + "/deleteReel", // ReelId/UserId

    //coupoun
    getCoupouns: base + "/coupouns",
    getCoupoun: base + "/coupoun", // CoupounId
    createCoupoun: base + "/coupoun",
    updateCoupoun: base + "/coupoun",
    deleteCoupon: base + "/deleteCoupon", // CoupounId/UserId
    getUserCouponHistory: base + "/getUsersCouponHistory",
    // LandingPageAdMedia
    getLandingPageAdMedias: base + "/media",
    createLandingPageAdMedia: base + "/media", // LandingPageAdMediaId
    reorderLandingPageAdMedia: base + "/media",
    deleteLandingPageAdMedia: base + "/deleteMedia", // LandingPageAdMediaId
  },
};

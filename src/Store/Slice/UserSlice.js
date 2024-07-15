import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    isUserRegistrationLoading: false,
    isUserLoginLoading: false,
    isUserLogoutLoading: false,
    userRegistrationError: null,
    userLoginError: null,
    userLogoutError: null,
    allEmails:null,
    isGetAllEmailsLoading:false,
    getAllEmailsError:null,

    userDataUpdate:null,
    isUserUpdatedDataLoading:false,
    userUpdatedDataError:null,
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        //User Registrtion      
        userRegistrationLoading: (state) => {
            state.isUserRegistrationLoading = true;
            state.userRegistrationError = null;
        },
        userRegistrationSuccess: (state, { payload }) => {
            state.isUserRegistrationLoading = false;            
            state.userData = payload;
            state.userRegistrationError = null;
        },
        userRegistrationError: (state, { payload }) => {
            state.isUserRegistrationLoading = false;
            state.userRegistrationError = payload;
        },
        // User Login
        userLoginLoading: (state) => {
            state.isUserLoginLoading = true;
            state.userLoginError = null;
        },
        userLoginSuccess: (state, { payload }) => {
            state.isUserLoginLoading = false;
            state.userData = payload;
            state.userLoginError = null;
        },
        userLoginError: (state, { payload }) => {
            state.isUserLoginLoading = false;
            state.userLoginError = payload;
        },

        // User Logout
        userLogoutLoading: (state) => {
            state.isUserLogoutLoading = true;
            state.userLogoutError = null;
        },
        userLogoutSuccess: (state,{ payload }) => {
            state.isUserLogoutLoading = false;
            console.log(payload)
            state.userData = payload;
            state.userLogoutError = null;
        },
        userLogoutError: (state, { payload }) => {
            state.isUserLogoutLoading = false;
            state.userLogoutError = payload;
        },

         // Get All Emails
         startGetAllEmailsLoading: (state) => {
            state.isGetAllEmailsLoading = true;
            state.getAllEmailsError = null;
        },
        getAllEmailsSuccess: (state, { payload }) => {
            state.isGetAllEmailsLoading = false;                     
            state.allEmails = payload;
            state.getAllEmailsError=null;
        },
        getAllEmailsError: (state, { payload }) => {
            state.isGetAllEmailsLoading = false;
            state.getAllEmailsError = payload;
        },

         // Update user details
        startUserUpdatedDataLoading: (state) => {
            state.isUserUpdatedDataLoading = true;
            state.userUpdatedDataError = null;
        },
        getUserUpdateDataSuccess: (state, { payload }) => {
            state.isUserUpdatedDataLoading = false;                     
            state.userDataUpdate = payload;
            console.log(payload)
            state.userUpdatedDataError=null;
        },
        getUserUpdatedDataError: (state, { payload }) => {
            state.isUserUpdatedDataLoading = false;
            state.userUpdatedDataError = payload;
        },

    }
});

export default userSlice.reducer;

export const {
    userRegistrationLoading,
    userRegistrationSuccess,
    userRegistrationError,
    startGetAllEmailsLoading,
    getAllEmailsSuccess,
    getAllEmailsError,
    userLoginSuccess,
    userLoginLoading,
    userLoginError,
    userLogoutLoading,
    userLogoutSuccess,
    startUserUpdatedDataLoading,
    getUserUpdateDataSuccess,
    getUserUpdatedDataError,
    userLogoutError } = userSlice.actions;
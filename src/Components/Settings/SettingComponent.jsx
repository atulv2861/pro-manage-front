import React, { useEffect, useState } from "react";
import Style from "../Settings/SettingComponent.module.css";
import profile from "../../assets/images/Profile.png";
import emailIcon from "../../assets/images/email.png";
import lock from "../../assets/images/lock.png";
import view from "../../assets/images/view.png";
import getStorage from "../../Service/StorageService";
import useUser from "../Hook/useUser";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStorage, removeStorage } from "../../Service/StorageService";
import { toast } from "react-toastify";
export default function SettingComponent() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { handleUserDataUpdate, handleLogoutUser } = useUser();
    const { userDataUpdate } = useSelector(state => state.user);
    const navigate=useNavigate();
   
    const handleUserDetails = (e) => {
        const { name, value } = e.target;
        setUserDetails({
            ...userDetails,
            [name]: value
        });
    }

    useEffect(() => {
        const userData = JSON.parse(getStorage('user'));      
        setName(userData?.name);
        setEmail(userData?.email);
    }, []);

    const handleToggleOldPassword = (e) => {
        setShowOldPassword(!showOldPassword);
    }

    const handleToggleNewPassword = (e) => {
        setShowNewPassword(!showNewPassword);
    }

    const validateUserDetails=()=>{       
        if(!userDetails?.name?.trim() && !userDetails?.email?.trim() && 
            !userDetails?.oldPassword?.trim() && !userDetails?.newPassword?.trim()){
                return toast.error("Please put the updated value in the input field!");
        }
    }
    const handleUpdateUserDetails = async () => {
        validateUserDetails();
        if(userDetails?.oldPassword){
            if(!userDetails.newPassword){
                toast.error('New password is required!');
                return;
            }
        }
        if(userDetails?.newPassword){
            if(!userDetails.oldPassword){
                toast.error('Old password is required!');
                return;
            }
        }       
        await handleUserDataUpdate(userDetails);
    }

    useEffect(() => {
        const initial=async()=>{
            if (userDetails?.email || userDetails?.oldPassword) {
                await handleLogoutUser();
                removeStorage("accessToken");
                removeStorage("user");
                navigate('/');
                return;
            }
            setStorage("user", JSON.stringify(userDataUpdate?.updatedDetails));
        }
        if(userDataUpdate){
            initial();
        }
    }, [userDataUpdate]);

    return (
        <div className={Style.Container}>
            <div className={Style.InputContainer}>
                <img src={profile} alt="" />
                <input
                    className={Style.InputBox}
                    type='text'
                    placeholder="Name"
                    name='name'
                    value={userDetails?.name ? userDetails?.name : name}
                    onChange={e => handleUserDetails(e)}
                />
            </div>
            <div className={Style.InputContainer}>
                <img style={{ paddingLeft: '7px' }} src={emailIcon} alt="" />
                <input
                    className={Style.InputBox}
                    style={{ paddingLeft: '10px' }}
                    type='text'
                    placeholder="Update Email"
                    name='email'
                    value={userDetails?.email ? userDetails?.email : email}
                    onChange={e => handleUserDetails(e)}
                />
            </div>
            <div className={Style.InputContainer}>
                <img src={lock} alt="" />
                <input
                    className={Style.InputBox}
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Old Password"
                    name='oldPassword'
                    value={userDetails?.oldPassword}
                    onChange={e => handleUserDetails(e)}
                />
                <img src={view} onClick={handleToggleOldPassword} alt='' />
            </div>
            <div className={Style.InputContainer}>
                <img src={lock} alt="" />
                <input
                    className={Style.InputBox}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    name='newPassword'
                    value={userDetails?.newPassword}
                    onChange={e => handleUserDetails(e)}
                /><img src={view} onClick={handleToggleNewPassword} alt='' />
            </div>
            <div><button onClick={handleUpdateUserDetails} className={Style.Button}>Update</button></div>
        </div>
    )
}
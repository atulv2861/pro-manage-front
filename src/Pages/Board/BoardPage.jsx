import React, { useEffect, useState } from "react";
import Style from "../Board/BoardPage.module.css"
import BoardComponent from "../../Components/Board/BoardComponent";
import people from "../../assets/images/people.png";
import AddPeopleComponent from "../../Components/AddPeople/AddPeopleComponent";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
import useTask from "../../Components/Hook/useTask";
import { useSelector } from "react-redux";
import getStorage from "../../Service/StorageService";
export default function BoardPage({setPointerEvent}) {
    const [isAddPeoplePopupOpen, setIsAddPeoplePopupOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [username,setUsername]=useState('');
    const[filter,setFilter]=useState('This Week');
    const [dateWiseFilter,setDateWiseFilter]=useState('week');
    const {handleGetAllTaskByDate}=useTask();
    // const{userData}=useSelector(state=>state.user);
    // console.log(userData?.user?.name?.split(" ")[0]);
    
    useEffect(()=>{
        const userName=JSON.parse(getStorage('user')).name?.split(" ")[0];
        setUsername(userName);
    },[]);
    const getFormattedDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        const suffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${suffix(day)} ${month}, ${year}`;
    }

    const handleAddPeople = () => {
        setIsAddPeoplePopupOpen(true);
    }

 

    const handleGetTasksByTimeDuration=async(time)=>{
        const result=time === 'today' ? 'Today' : time === 'week' ? 'This Week' : 'This Month';
        setFilter(result);
        setIsOpen(false);
        setDateWiseFilter(time);
        await handleGetAllTaskByDate(time);
    }

    return (
        <div className={Style.Container}>
            {isAddPeoplePopupOpen && <AddPeopleComponent
                setIsAddPeoplePopupOpen={setIsAddPeoplePopupOpen} 
                setPointerEvent={setPointerEvent}/>}
            <div className={Style.Header}>
                <div className={Style.FirstHead}>
                    <div style={{ fontSize: '28px', fontWeight: '700' }}>{`Welcome! ${username}`}</div>
                    <div style={{ fontSize: '20px', fontWeight: '400', color: 'grey' }}>{getFormattedDate(new Date())}</div>
                </div>
                <div className={Style.FirstHead}>
                    <div className={Style.InnerHead}>
                        <div style={{ fontSize: '28px', fontWeight: '700', marginRight: '10px' }}>Board</div>
                        <div onClick={handleAddPeople} style={{ fontSize: '20px', fontWeight: '400', color: 'grey', cursor: 'pointer' }}><span><img src={people} alt='Add People' /></span>Add People</div>
                    </div>
                    <div>
                        <div>
                            <button className={Style.DropdownBtn} onClick={e => setIsOpen(prev => !prev)}>{filter?filter:'This Week'}
                                {!isOpen ? (<AiOutlineCaretUp />) : (<AiOutlineCaretDown />)}
                            </button>
                            {isOpen && (
                                <div className={Style.DropdownItem}>
                                    <div><button onClick={e=>handleGetTasksByTimeDuration('today')} className={Style.DropdownListBtn}>Today</button></div>
                                    <div><button onClick={e=>handleGetTasksByTimeDuration('week')} className={Style.DropdownListBtn}>This Week</button></div>
                                    <div><button onClick={e=>handleGetTasksByTimeDuration('month')} className={Style.DropdownListBtn}>This Month</button></div>    
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <BoardComponent dateWiseFilter={dateWiseFilter} setPointerEvent={setPointerEvent}/>
            </div>
        </div>
    )
};
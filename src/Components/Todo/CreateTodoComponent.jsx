import React, { useState } from "react";
import Style from "../Todo/CreateTodoComponent.module.css";
import { useRef, useEffect } from "react";
import delete1 from '../../assets/images/delete.png'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import useTask from "../Hook/useTask";
import useUser from "../Hook/useUser";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";
export default function CreateTodoComponent({ setCreateTodoPopupOpen, item,dateWiseFilter,setIsActivePointerEvent}) {
    const inputRef = useRef(null);
    const [fieldErrors, setFieldErrors] = useState();
    const [priority, setPriority] = useState('');
    const [isCalenderOpen, setIsCalenderOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(0);
    const [date, setDate] = useState(new Date());
    const [assignee, setAssignee] = useState('');
    const [noOfCheckList, setNoOfChecklist] = useState(0);
    const [checkedCheckbox, setCheckedCheckbox] = useState(0);
    const { handleCreateTask, handleUpdateTask } = useTask();
    const { handleGetAllEmails } = useUser();


    const { allEmails } = useSelector(state => state?.user);
    const { createdTask } = useSelector(state => state.task);
   
    const [todos, setTodos] = useState([{
        task: "",
        priority: "",
        checkList: [],
        currentStatus: 'TODO',
    }]);

    //Dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [assignTo, setAssignTo] = useState('');


    const getTwoCharFromStart = (str) => {
        return str.substring(0, 2).toUpperCase();
    }

    const handleAssignTo = (value) => {
        setAssignee(value);
        setAssignTo(value);
        setIsOpen(false);
    }
    //------------end---------------------
    useEffect(() => {
        const initial = async () => {
            await handleGetAllEmails();
        }
        initial();
    }, []);

    useEffect(() => {
        const initial = () => {
            let values = [...todos];
            values[0] = {
                ...values[0],
                assignTo: assignee,
            };
            setTodos(values);
        }
        if (assignee) {
            initial();
        }
    }, [assignee]);


    useEffect(() => {
        const editTodo = async () => {
            
            setTodos([{
                task: item?.task,
                priority: item?.priority,
                assignTo: item?.assignTo,
                checkList: item?.checkList,
                dueDate: item?.dueDate,
                currentStatus: item?.currentStatus,
            }])
            setPriority(item?.priority?.split(" ")[0]);
            setAssignTo(item?.assignTo ? item?.assignTo : '');
            setNoOfChecklist(item?.checkList?.length);
            const noOfCheckList = item?.checkList?.filter(item => item?.isChecked === true);
            setCheckedCheckbox(noOfCheckList && noOfCheckList?.length);
            if (item?.dueDate) {
                setDate(item?.dueDate);
                setSelectedDate(formatDate(item?.dueDate))
            }

        }
        if (item) {
            editTodo();
        }
    }, []);

    const handleAddNewTaskItem = () => {
        const newTodos = [...todos];
        const newCheckList = [...newTodos[0].checkList];
        newCheckList.push({
            isChecked: false,
            value: ""
        });
        newTodos[0].checkList = newCheckList;
        setNoOfChecklist(newTodos[0]?.checkList?.length);
        setTodos(newTodos);
    }

    const handleRemoveTaskItem = (indx, e) => {
        const newTodos = [...todos];
        const newCheckList = [...newTodos[0].checkList];
        newCheckList.splice(indx, 1);
        newTodos[0].checkList = newCheckList;
        setTodos(newTodos);
        setNoOfChecklist(newTodos[0]?.checkList?.length);
        const noOfCheckList = newTodos[0]?.checkList?.filter(item => item?.isChecked === true);
        setCheckedCheckbox(noOfCheckList && noOfCheckList?.length);
    }


    const handleDueDate = (e) => {
        setIsCalenderOpen(!isCalenderOpen);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        return `${year}/${month}/${day}`;
    }

    const handleSelectDate = (date) => {
       
        setDate(date)
        setSelectedDate(formatDate(date));
        setIsCalenderOpen(false);
        let values = [...todos];
        values[0] = {
            ...values[0],
            dueDate: date,
        };
        setTodos(values);
    }

    const handleCancelCreateTodo = () => {
        setCreateTodoPopupOpen(false);
        setIsActivePointerEvent(false);
    }

    const handleTodosChange = (e) => {
        let values = [...todos];
        if (e?.target?.name === 'task') {
            values[0] = {
                ...values[0],
                [e.target.name]: e.target.value,
            };
        } else {
            values[0] = {
                ...values[0],
                priority: e.target.innerText,
            };
            setPriority(e?.target?.innerText?.split(" ")[0]);
        }
        setTodos(values);
    }

    const handleCheckListChange = (indx, e) => {
        const newTodos = [...todos];
        const currentTodo = { ...newTodos[0] };
        const newCheckList = currentTodo.checkList.map((item, index) => {
            if (index === indx) {
                return { ...item, [e.target.name === "checkbox" ? 'isChecked' : 'value']: e.target.name === "checkbox" ? e.target.checked : e.target.value };
            }
            return item;
        });
        currentTodo.checkList = newCheckList;
        newTodos[0] = currentTodo;
        if (e.target.name === "checkbox") {
            const noOfCheckList = newCheckList.filter(item => item.isChecked === true).length;
            setCheckedCheckbox(noOfCheckList);
        }
        setTodos(newTodos);
    }

    const handleCreateTodo = async () => {
        const todoData = { ...todos[0] };
       
        if (!todoData?.task.trim()) {
            toast.error("Title is required!");
            return;
        }
        if (todoData?.task.trim()?.length<3) {
            toast.error("Title should be minimum 3 character!");
            return;
        }
        if (!todoData?.priority.trim()) {
            toast.error("Priority is required!");
            return;
        }
        if (todoData?.checkList.length <= 0) {
            toast.error("Checklist is required!");
            return;
        }

        if (todoData?.checkList.length) {
            const res=todoData?.checkList?.filter((item,indx)=>item?.value===(null||undefined||''));
            if(res.length>0){
                toast.error("Checklist value should not be empty!");
                return;
            }
                
        }

        if (item?._id) {
            const res = await handleUpdateTask(item?._id, ...todos,dateWiseFilter);
            if (res.status === 201){
                setCreateTodoPopupOpen(false);
                setIsActivePointerEvent(false);
                return toast.success('Task updated successfully!');
            }                
            return toast.error('Something went wrong!');
        }
        const res=await handleCreateTask(...todos,dateWiseFilter);
        if (res.status === 201){
            setCreateTodoPopupOpen(false);
            setIsActivePointerEvent(false);
            return toast.success('Task created successfully!');
        }            
        return toast.error('Something went wrong!');
        
    }

    
    return (<>

        <div className={Style.Container}>
            {isCalenderOpen && <div className={Style.CalendarStyle}><Calendar onChange={handleSelectDate} value={date} /></div>}
            <div className={Style.Label}>Title<span style={{ color: 'red' }}>*</span></div>
            <div className={Style.InputContainer}>
                <input
                    type="text"
                    placeholder="Enter Task Title"
                    className={Style.InputBox}
                    name="task"
                    ref={inputRef}
                    onChange={e => handleTodosChange(e)}
                    value={todos[0]['task']}
                />
            </div>
            <div className={Style.PriorityContainer}>
                <div className={Style.PriorityHeading}>Select Priority<span style={{ color: 'red', marginRight: '10px' }}>*</span></div>
                <div className={Style.PriorityType}>
                    <div className={`${Style.PriorityBtn} ${priority === 'HIGH' ? Style.Backcolor : ''}`} name='priority' onClick={e => handleTodosChange(e)}><div className={Style.Circel} style={{ background: '#FF2473' }}></div><div className=''>HIGH PRIORITY</div></div>
                    <div className={`${Style.PriorityBtn} ${priority === 'MODERATE' ? Style.Backcolor : ''}`} name='priority' onClick={e => handleTodosChange(e)}><div className={Style.Circel} style={{ background: '#18B0FF' }}></div><div className=''>MODERATE PRIORITY</div></div>
                    <div className={`${Style.PriorityBtn} ${priority === 'LOW' ? Style.Backcolor : ''}`} name='priority' onClick={e => handleTodosChange(e)}><div className={Style.Circel} style={{ background: '#63C05B' }}></div><div className=''>LOW PRIORITY</div></div>
                </div>
            </div>
            {allEmails?.peopleMail?.emails?.length>0&&<div className={Style.AssignContainer}>
                <div className={Style.AssignTo}>Assign To</div>
                <div className="">
                    <div className={Style.Wrapper}>
                        <button className={Style.DropdownBtn} onClick={e => setIsOpen(prev => !prev)}>{assignTo ? assignTo : 'Add a assignee'}
                            {!isOpen ? (<AiOutlineCaretUp />) : (<AiOutlineCaretDown />)}
                        </button>
                        {isOpen && (
                            <div className={Style.DropdownItem}>
                                {allEmails?.peopleMail?.emails?.map((value, index) => (
                                    <div className={Style.DropdownField} key={index}>
                                        <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'orange' }}>{getTwoCharFromStart(value)}</div>
                                        <div>{value}</div>
                                        <div><button onClick={e => handleAssignTo(value)} className={Style.AssignToBtn}>Assign</button></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>}
            <div className={Style.Checklist}>{`Checklist(${checkedCheckbox}/${noOfCheckList})`}<span style={{ color: 'red' }}>*</span></div>
            <div className={Style.Task}>
                {todos[0]?.checkList?.length > 0 &&
                    todos[0]?.checkList?.map((item, indx) => (
                        <div className={Style.TaskItem} key={indx}>
                            <div>
                                <input type='checkbox' name='checkbox' checked={item?.isChecked} onChange={e => handleCheckListChange(indx, e)} style={{ marginLeft: '10px' }} />
                                <input type='text' name='checkListValue' onChange={e => handleCheckListChange(indx, e)} value={item?.value} placeholder='Task to be done' className={Style.TaskInput} />
                            </div>
                            <div><button className={Style.DeleteBtn}><img onClick={e => handleRemoveTaskItem(indx, e)} src={delete1} alt='' /></button></div>
                        </div>
                    ))}

            </div>
            <div><button className={Style.AddCheckList} onClick={handleAddNewTaskItem}>+ Add New</button></div>
            <div className={Style.Btngrp}>
                <div><button name='dueDate' className={Style.Btn} onClick={e => { handleDueDate(e) }}>{selectedDate ? selectedDate : `Select Due Date`}</button></div>
                <div className={Style.SaveAndCancelBtn}>
                    <div><button onClick={handleCancelCreateTodo} className={Style.Btn} style={{ border: 'none', outline: '2px solid red' }}>Cancel</button></div>
                    <div><button onClick={handleCreateTodo} className={Style.Btn} style={{ border: 'none', backgroundColor: '#17A2B8', outline: '2px solid #17A2B8' }}>{item?._id ? 'Update' : 'Save'}</button></div>
                </div>
            </div>
        </div>
    </>
    )
}
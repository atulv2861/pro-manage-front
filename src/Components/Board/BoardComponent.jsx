import React, { useEffect, useState } from "react";
import Style from "../Board/BoardComponent.module.css";
import save from "../../assets/images/save.png"
import CreateTodoComponent from "../Todo/CreateTodoComponent";
import CardComponent from "../Card/CardComponent";
import useTask from "../Hook/useTask";
import { useSelector } from "react-redux";
export default function BoardComponent({dateWiseFilter}) {
    const [createTodoPopupOpen, setCreateTodoPopupOpen]=useState(false);
    const [backlogs,setBacklogs]=useState([]);
    const [todos,setTodos]=useState([]);
    const [inProgress,setInProgress]=useState([]);
    const [done,setDone]=useState([]);
    const [isActivePointerEvent,setIsActivePointerEvent]=useState(false);
    //const [filterDate, setFilterDate]=useState(dateWiseFilter);
    const [isOpenAllChecklist, setIsOpenAllChecklist] = useState(true);
    const {handleGetAllTasks,handleGetAllTaskByDate}=useTask();
    const {allTasks}=useSelector(state=>state.task);
   
    
    useEffect(()=>{
        const initial=async()=>{
            //await handleGetAllTasks();
            await handleGetAllTaskByDate(dateWiseFilter)
        }

        initial();
    },[]);

     useEffect(()=>{
        let backlogs=allTasks?.tasks?.map(item=>item?.BACKLOG);
        let todos=allTasks?.tasks?.map(item=>item?.TODO);
        let inprogress=allTasks?.tasks?.map(item=>item?.INPROGRESS);
        let done=allTasks?.tasks?.map(item=>item?.DONE);
        setBacklogs(backlogs?backlogs[0]:[]);
        setTodos(todos?todos[0]:[]);
        setInProgress(inprogress?inprogress[0]:[]);
        setDone(done?done[0]:[]);
     },[allTasks]);

    const handleCreateTodo=()=>{
        setCreateTodoPopupOpen(true);
        setIsActivePointerEvent(true)
    }

    const handleCloseChecklist=()=>{
        setIsOpenAllChecklist(false)
    }
    
    return (<>
    {createTodoPopupOpen&&<CreateTodoComponent setCreateTodoPopupOpen={setCreateTodoPopupOpen}
    dateWiseFilter={dateWiseFilter}
    setIsActivePointerEvent={setIsActivePointerEvent}
    />}
        <div className={`${Style.Container} ${isActivePointerEvent&&Style.PointerEvent}`} >
            <div className={Style.BoardSection}>
                <div className={Style.Header}>
                    <div>Backlog</div>
                    <div><img onClick={e=>handleCloseChecklist()} src={save} alt="icon" /></div>
                </div>
                <div className={Style.CardContainer}>
                {backlogs?.length>0&&
                    backlogs?.map((item,indx)=>(<CardComponent key={indx} item={item} 
                        isOpenAllChecklist={isOpenAllChecklist} 
                        setIsOpenAllChecklist={setIsOpenAllChecklist}
                        dateWiseFilter={dateWiseFilter}
                        /> ))
                    }
                </div>
            </div>
            <div className={Style.BoardSection}>
                <div className={Style.Header} >
                    <div>To Do</div>
                    <div style={{marginTop:'-6px'}}><span onClick={handleCreateTodo} style={{fontSize:"24px", cursor:"pointer"}}>+&nbsp;&nbsp;</span><img onClick={e=>handleCloseChecklist()} src={save} alt="icon" /></div>
                </div>
                <div className={Style.CardContainer}>
                    {todos?.length>0&&
                    todos?.map((item,indx)=>(<CardComponent key={indx} item={item}
                        isOpenAllChecklist={isOpenAllChecklist} 
                        setIsOpenAllChecklist={setIsOpenAllChecklist}
                        dateWiseFilter={dateWiseFilter}/> ))
                    }                                   
                </div>
            </div>
            <div className={Style.BoardSection}>
                <div className={Style.Header}>
                    <div>In Progress</div>
                    <div><img onClick={e=>handleCloseChecklist()} src={save} alt="icon" /></div>
                </div>
                <div className={Style.CardContainer}>
                {inProgress?.length>0&&
                    inProgress?.map((item,indx)=>(<CardComponent key={indx} item={item}
                        isOpenAllChecklist={isOpenAllChecklist} 
                        setIsOpenAllChecklist={setIsOpenAllChecklist}
                        dateWiseFilter={dateWiseFilter}/> ))
                    }                
                </div>
            </div>
            <div className={Style.BoardSection}>
                <div className={Style.Header}>
                    <div>Done</div>
                    <div><img onClick={e=>handleCloseChecklist()} src={save} alt="icon" /></div>
                </div>
                <div className={Style.CardContainer}>
                {done?.length>0&&
                    done?.map((item,indx)=>(<CardComponent key={indx} item={item}
                        isOpenAllChecklist={isOpenAllChecklist} 
                        setIsOpenAllChecklist={setIsOpenAllChecklist}
                        dateWiseFilter={dateWiseFilter}/> ))
                    } 
                </div>
            </div>
        </div>
        </>
    )
}
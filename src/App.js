import './App.css';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Header(){

  const[task, setTask] = useState(""); 
  const[sideBar, setSideBar] = useState(false);
  const[selectedDate, setSelectedDate] = useState(new Date());
  const[showCalendar, setShowCalendar] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov","Dec"];
  //Function to setup formatted Date
  const formatDate = (dateObj)=>{
    const d = dateObj.getDate();
    const m = months[dateObj.getMonth()];
    return `${d} ${m}`;
  }

  //Using local storage to load data

 const [submittedTask, setSubmittedTask] = useState(() => {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
});

// Save to localStorage only when tasks change
useEffect(() => {
  localStorage.setItem("tasks", JSON.stringify(submittedTask));
}, [submittedTask]);

  //Submit handling function

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(task.trim() !== ""){
      const newTask = {
        id : Date.now(),
        text : task,
        completed: false,
        date: selectedDate.toDateString()  
      };
      setSubmittedTask([...submittedTask, newTask]);
      setTask("");
    }
  }
  
  const toggleTask = (id) => {
    setSubmittedTask(submittedTask.map( t =>
      t.id === id ? {...t, completed: !t.completed}: t
    ));
  }

  const getDayLabel = (date) => {
    const today = new Date();
    const d1 = new Date(date.toDateString());
    const d2 = new Date(today.toDateString());

    const diffTime = d1 - d2;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) return "TODAY";
    if (diffTime === oneDay) return "TOMORROW";
    if (diffTime === -oneDay) return "YESTERDAY";
    // Return weekday name (e.g., Monday, Tuesday)
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return(
    
    <div className='body'>
      <div className='container'>
        <img src='/menu.svg' 
        className='menu' 
        onClick={() => setSideBar(!sideBar)}
        />
        <div className={`sideBar ${sideBar ? "open" : ''}`}>
          <h3>Menu</h3>
          <ul>
            <li style={{cursor: "pointer"}}>
              <span onClick={()=> {
                setShowCalendar(!showCalendar);
                setSideBar(!sideBar);
              }
                }>Calender</span>
            </li>
            <li>
              Notes
            </li>
          </ul>
          
        </div>
        <div id='vertical'></div>
        <div className='top'>
          {/*Changing the Day text*/}
          <h2>
            {getDayLabel(selectedDate)}
          </h2>
          <img src='/calender.svg'
            onClick={() =>setShowCalendar(!showCalendar)}
            style={{cursor: "pointer"}} />
          {/*Changing the Date*/}
            <date id='date'>{formatDate(selectedDate)}</date>
        </div>
        <div className='horizontal1'></div>
        
        {
        // CALENDAR
        showCalendar && (
                <div className='centered-calendar'>
                  <Calendar 
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(!showCalendar);
                    }}
                    value={selectedDate}
                  />
                </div>
        )
        }


        {/* SHOWING THE COMPONENTS ONLY WHEN THE CALNEDAR IS NOT OPEN */}
        {!showCalendar && (
          <div className='hiddenComponents'>
            <div className='gate'>

          
            <form onSubmit={handleSubmit} className='taskentry'>
              <button type='submit' className='submit'><img src='/plus.svg' /></button>
              <input type="text" 
              placeholder=" + Add Task"
              value={task}
              onChange={(e)=>setTask(e.target.value)}
               />
            
            </form>
          
            </div>
            <div className='horizontal2'></div>
            <div className='listitem'>
              <ul>
                {
                  submittedTask
                  .filter(t => t.date === selectedDate.toDateString())
                  .map((t) => (
                    <li key={t.id} >
                      <input 
                        type='checkbox'
                        checked = {t.completed}
                        onChange={() => toggleTask(t.id)}
                        className='checkbox'
                      />
                      <div className='taskform'>
                        <span className='tasktext'>{t.text}</span>
                        <img src='./tripledots.svg' className='tripledots'/>
                      </div>
                      
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        )}
        
      </div>
    </div> 
  );
}


function App(){
  
  return(
    <div>
      <Header />
      
    </div>
  );
}

export default App;
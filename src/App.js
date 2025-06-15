import './App.css';
import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Header() {
  const [task, setTask] = useState("");
  const [sideBar, setSideBar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showtdmenu, setShowtdmenu] = useState(null);
  const menuRefs = useRef({});
  const sideBarRef = useRef(null);


  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const formatDate = (dateObj) => {
    const d = dateObj.getDate();
    const m = months[dateObj.getMonth()];
    return `${d} ${m}`;
  };

  const [submittedTask, setSubmittedTask] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(submittedTask));
  }, [submittedTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
        date: selectedDate.toDateString()
      };
      setSubmittedTask([...submittedTask, newTask]);
      setTask("");
    }
  };

  const toggleTask = (id) => {
    setSubmittedTask(submittedTask.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const toggletdMenu = (id) => {
    setShowtdmenu(prevId => (prevId === id ? null : id));
  };

  const getDayLabel = (date) => {
    const today = new Date();
    const d1 = new Date(date.toDateString());
    const d2 = new Date(today.toDateString());

    const diffTime = d1 - d2;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diffTime === 0) return "TODAY";
    if (diffTime === oneDay) return "TOMORROW";
    if (diffTime === -oneDay) return "YESTERDAY";
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    setTimeout(()=>{
      const ref = menuRefs.current[showtdmenu];
      if (ref && !ref.contains(event.target)) {
        setShowtdmenu(null);
      }
    

      const clickedOutsideSidebar = sideBarRef.current && !sideBarRef.current.contains(event.target);

      if (clickedOutsideSidebar) {
        setSideBar(false); // or your sidebar close logic
      }
    },0);
}
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showtdmenu]);

  return (
    <div className='body'>
      <div className='container'>
        <img src='/menu.svg'
          className='menu'
          onClick={() => setSideBar(!sideBar)} 
          ref={sideBarRef}
        />
        <div className={`sideBar ${sideBar ? "open" : ''}`}>
          <h3>Menu</h3>
          <ul>
            <li style={{ cursor: "pointer" }}>
              <span onClick={() => {
                setShowCalendar(true);
                setTimeout(() => setSideBar(false), 0);
              }}>Calender</span>
            </li>
            <li>Notes</li>
          </ul>
        </div>

        <div id='vertical'></div>

        <div className='top'>
          <h2>{getDayLabel(selectedDate)}</h2>
          <img src='/calender.svg'
            onClick={() => setShowCalendar(!showCalendar)}
            style={{ cursor: "pointer" }} />
          <date id='date'>{formatDate(selectedDate)}</date>
        </div>

        <div className='horizontal1'></div>

        {showCalendar && <p>this is on</p> && (
          <div className='centered-calendar'>
            <Calendar
              onChange={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              value={selectedDate}
            />
          </div>
        )}

        {!showCalendar && (
          <div className='hiddenComponents'>
            
              <div className='gate'>
                <form onSubmit={handleSubmit} className='taskentry'>
                  <button type='submit' className='submit'><img src='/plus.svg' /></button>
                  <input type="text"
                    placeholder=" + Add Task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                  />
                </form>
              </div>
            
            <div className='listitem'>
              <ul>
                {submittedTask
                  .filter(t => t.date === selectedDate.toDateString())
                  .map((t) => (
                    <li key={t.id}>
                      <input
                        type='checkbox'
                        checked={t.completed}
                        onChange={() => toggleTask(t.id)}
                        className='checkbox'
                      />
                      <div className='taskform'>
                        <span className='tasktext'>{t.text}</span>
                        <div className='dotsWrapper' ref={(el) => (menuRefs.current[t.id] = el)}>
                          <img
                            src='./tripledots.svg'
                            className='tripledots'
                            onClick={() => toggletdMenu(t.id)}
                          />
                          {showtdmenu === t.id && (
                            <ul className="tdMenu">
                              <li>Mark Star</li>
                              <li>Delete</li>
                              <li>Edit</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}

export default App;

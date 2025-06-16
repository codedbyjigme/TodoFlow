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
  const [starredTasks, setStarredTasks] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const menuRefs = useRef({});
  const sideBarRef = useRef(null);
   const menuButtonRef = useRef(null); // Add ref for menu button


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


  // Handle calendar click from sidebar
  const handleCalendarClick = (e) => {
    e.stopPropagation();
    setShowCalendar(prev => !prev);
    setSideBar(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle triple dot menu
      if (showtdmenu) {
        const ref = menuRefs.current[showtdmenu];
        if (ref && !ref.contains(event.target)) {
          setShowtdmenu(null);
        }
      }

      // Handle sidebar - only close if clicking outside both sidebar and menu button
      if (sideBar) {
        const clickedOutsideSidebar = sideBarRef.current && !sideBarRef.current.contains(event.target);
        const clickedOutsideMenuButton = menuButtonRef.current && !menuButtonRef.current.contains(event.target);
        
        if (clickedOutsideSidebar && clickedOutsideMenuButton) {
          setSideBar(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showtdmenu, sideBar]); // Add sideBar to dependencies

  //Deleting The tasks
  const deleteTask = (id)=>{
    setSubmittedTask(prev => prev.filter(items => items.id !== id));
    setShowtdmenu(null);
  }

  //Marking a Star in the task
  const toggleStar = (id) => {
    setStarredTasks(prev =>
      prev.includes(id)
        ? prev.filter(starId => starId !== id)
        : [...prev, id]
    );
  };

  //editing a task
  const editTask = (id) => {
    const taskToEdit = submittedTask.find(t => t.id === id);
    setEditText(taskToEdit.text);
    setEditTaskId(id);
    setShowEdit(true);
    setShowtdmenu(null);
  };

  //handling the confirm and cancel
  const handleConfirmEdit = () => {
    setSubmittedTask(prev =>
      prev.map(task =>
        task.id === editTaskId ? { ...task, text: editText } : task
      )
    );
    setShowEdit(false);
    setEditTaskId(null);
  };

  const handleCancelEdit = () => {
    setShowEdit(false);
    setEditTaskId(null);
  };

  return (
    <div className='body'>
      <div className='container'>
        <img 
          src='./menu.svg'
          alt = 'menu'
          className='menu'
          onClick={() => setSideBar(!sideBar)} 
          ref={menuButtonRef} // Use separate ref for menu button
        />
        <div className={`sideBar ${sideBar ? "open" : ''}`} ref={sideBarRef}>
          <h3>Menu</h3>
          <ul>
            <li style={{ cursor: "pointer" }}>
              <span onClick={handleCalendarClick}>Calendar</span>
            </li>
            <li>Notes</li>
          </ul>
        </div>

        <div id='vertical'></div>

        <div className='top'>
          <h2>{getDayLabel(selectedDate)}</h2>
          <img src='./calender.svg'
            alt='calendar'
            onClick={() => setShowCalendar(!showCalendar)}
            style={{ cursor: "pointer" }} />
          <date id='date'>{formatDate(selectedDate)}</date>
        </div>

        <div className='horizontal1'></div>

        {showCalendar && (
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
                  <button type='submit' className='submit'><img src='./plus.svg' alt='insetion logo'/></button>
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
                      <div className={`taskform ${
                        showtdmenu === t.id
                          ? "force-hover"
                          : showtdmenu !== null
                          ? "disable-hover"
                          : ""
                      }`}>
                        <span className='tasktext'>{t.text}</span>
                        {starredTasks.includes(t.id) && <span>⭐</span>}
                        <div className='dotsWrapper' ref={(el) => (menuRefs.current[t.id] = el)}>
                          <img
                            src='./tripledots.svg'
                            className='tripledots'
                            onClick={() => toggletdMenu(t.id)}
                          />
                          {showtdmenu === t.id && (
                            <ul className="tdMenu">
                              <li onClick={() => {toggleStar(t.id); setShowtdmenu(prev => (prev === t.id ? null : t.id))}}>{starredTasks.includes(t.id) ? "Remove Star" : "Add Star"}</li>
                              <li onClick={() => deleteTask(t.id)}>Delete</li>
                              <li onClick={() => {editTask(t.id); setShowtdmenu(prev => (prev === t.id ? null : t.id))}}>Edit</li>
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
      {showEdit && (
        <div className='editModal'>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className='editInput'
            autoFocus
          />
          <div className='editButtons'>
            <button onClick={handleConfirmEdit}>Confirm</button>
            <button onClick={handleCancelEdit}>Cancel</button>
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

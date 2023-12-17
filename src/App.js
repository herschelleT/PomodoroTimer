import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(25 * 60);
  const [timerStatus, setTimerStatus] =
    useState(false);
  const [breakTime, setBreakTime] = useState(
    10 * 60
  );
  const [sessionTime, setSessionTime] = useState(
    25 * 60
  );
  const [onBreak, setOnBreak] = useState(false);
  const sound = document.getElementById("beep");

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;

    if (!timerStatus) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setTime((prev) => {
            return prev - 1;
          });
          nextDate = nextDate + second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem(
        "interval-id",
        interval
      );
    }
    if (timerStatus) {
      clearInterval(
        localStorage.getItem("interval-id")
      );
    }
    setTimerStatus(!timerStatus);
  };

  useEffect(() => {
    if (time <= -1 && onBreak) {
      setOnBreak(false);
      setTime(sessionTime);
      sound.play();
    } else if (time <= -1 && !onBreak) {
      setOnBreak(true);
      setTime(breakTime);
      sound.play();
    }
  }, [
    time,
    onBreak,
    breakTime,
    sessionTime,
    timerStatus,
    sound,
  ]);

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;

    return `${min < 10 ? "0" + min : min}:${
      sec < 10 ? "0" + sec : sec
    }`;
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if (breakTime <= 60 && amount < 0) return;
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 60 && amount < 0) return;
      setSessionTime((prev) => prev + amount);
      if (!timerStatus) {
        setTime(sessionTime + amount);
      }
    }
  };
  const resetTimer = () => {
    setTime(60 * 25);
    setBreakTime(5 * 60);
    setSessionTime(60 * 25);
  };
  return (
    <div className="App">
      <header className="App-header center-align">
        <h1>Pomodoro Timer</h1>
        <div className="dual-container">
          <Length
            id="break-label"
            idS="break-decrement"
            idP="break-increment"
            title={"Break"}
            getTime={formatTime}
            type={"break"}
            changeTime={changeTime}
            time={breakTime}
          />
          <Length
            id="session-label"
            idS="session-decrement"
            idP="session-increment"
            title={"Session"}
            getTime={formatTime}
            type={"session"}
            changeTime={changeTime}
            time={sessionTime}
          />
        </div>
        <div
          id="displayTime"
          className="#ab47bc purple lighten-1"
        >
          <div id="container">
            <h2 id="timer-label">
              {onBreak ? "Break" : "Session"}
            </h2>
            <h2 id="timer-left">
              {formatTime(time)}
            </h2>
            <audio
              id="beep"
              src="\beep.mp3"
            ></audio>
          </div>
          <div id="container-2">
            {timerStatus ? (
              <button
                className="btn-large primary #f44336 red"
                id="start_stop"
                onClick={controlTime}
              >
                <i className="large material-icons">
                  pause
                </i>
              </button>
            ) : (
              <button
                className="btn-large primary "
                id="start_stop"
                onClick={controlTime}
              >
                <i className="large material-icons">
                  start
                </i>
              </button>
            )}

            <button
              className="btn-large primary"
              onClick={resetTimer}
              id="reset"
            >
              <i className="large material-icons">
                autorenew
              </i>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
function Length({
  title,
  id,
  idP,
  idS,
  getTime,
  type,
  time,
  changeTime,
}) {
  return (
    <div>
      <h4 id={id}>{title}</h4>
      <div className="time-set">
        <button
          id={idS}
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(-60, type)}
        >
          <i className="material-icons">
            arrow_downward
          </i>
        </button>
        <h5>{getTime(time)}</h5>
        <button
          id={idP}
          className="btn-small deep-purple lighten-2"
          onClick={() => changeTime(60, type)}
        >
          <i className="material-icons">
            arrow_upward
          </i>
        </button>
      </div>
    </div>
  );
}

export default App;

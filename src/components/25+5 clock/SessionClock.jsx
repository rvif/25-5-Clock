import React from "react";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

class SessionClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reset: false,
      break: 5,
      session: 25,
      play: false,
      timeLeft: 1500,
      type: "Session",
    };
    this.setReset = this.setReset.bind(this);
    this.setDecreaseBreak = this.setDecreaseBreak.bind(this);
    this.setIncreaseBreak = this.setIncreaseBreak.bind(this);
    this.setDecreaseSession = this.setDecreaseSession.bind(this);
    this.setIncreaseSession = this.setIncreaseSession.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.setTimeLeft = this.setTimeLeft.bind(this);
    this.timeout = this.timeout.bind(this);
  }
  setReset() {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.setState((prevState) => ({
      play: false,
      break: 5,
      session: 25,
      timeLeft: 1500,
      reset: !prevState.reset,
    }));
    if (this.state.reset) {
      this.setState({
        timeLeft: 1500,
      });
    }
  }

  timeFormatter() {
    const minutes = Math.floor(this.state.timeLeft / 60);
    const seconds = this.state.timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  setTimeLeft(val) {
    this.setState({
      timeLeft: val,
    });
  }
  setDecreaseBreak() {
    if (!this.state.play)
      if (this.state.break > 1 && this.state.break <= 60) {
        this.setState((prevState) => ({
          break: prevState.break - 1,
          timeLeft: this.setTimeLeft(this.state.break * 60 - 60),
        }));
      }
  }
  setIncreaseBreak() {
    if (!this.state.play)
      if (this.state.break >= 0 && this.state.break < 60) {
        this.setState((prevState) => ({
          break: prevState.break + 1,
          timeLeft: this.setTimeLeft(this.state.break * 60 + 60),
        }));
      }
  }
  setDecreaseSession() {
    if (!this.state.play)
      if (this.state.session > 1 && this.state.session <= 60) {
        this.setState((prevState) => ({
          session: prevState.session - 1,
          timeLeft: this.setTimeLeft(this.state.session * 60 - 60),
        }));
      }
  }

  setIncreaseSession() {
    if (!this.state.play)
      if (this.state.session >= 0 && this.state.session < 60) {
        this.setState((prevState) => ({
          session: prevState.session + 1,
          timeLeft: this.setTimeLeft(this.state.session * 60 + 60),
        }));
      }
  }

  timeout() {
    setTimeout(() => {
      if (this.state.timeLeft && this.state.play) {
        this.setTimeLeft(this.state.timeLeft - 1);
      }
    }, 1000);
  }
  resetTimer() {
    const audio = document.getElementById("beep");
    if (!this.state.timeLeft && this.state.type === "Session") {
      this.setTimeLeft(this.state.break * 60);
      this.setState({
        type: "Break",
      });
      audio.play();
      this.setState({ play: false }, () => {
        setTimeout(() => {
          this.setState({ play: true });
        }, 1000);
      });
    }
    if (!this.state.timeLeft && this.state.type === "Break") {
      this.setTimeLeft(this.state.session * 60);
      this.setState({
        type: "Session",
      });
      audio.pause();
      audio.currentTime = 0;
      this.setState({ play: false }, () => {
        setTimeout(() => {
          this.setState({ play: true });
        }, 1000);
      });
    }
  }
  clock = () => {
    if (this.state.play) {
      this.timeout();
      this.resetTimer();
    } else {
      clearTimeout(this.timeout);
    }
  };

  componentDidUpdate(prevState) {
    if (
      this.state.play !== prevState.play ||
      this.state.timeLeft !== prevState.timeLeft
    ) {
      this.clock();
    }
  }

  handlePlay() {
    clearTimeout(this.timeout);
    this.setState((prevState) => ({
      play: !prevState.play,
    }));
  }

  render() {
    const title = this.state.type === "Session" ? "Session" : "Break";
    const alertTextStyle = this.state.timeLeft < 60 ? "text-red-500" : "";
    const alertBorderStyle =
      this.state.timeLeft < 60 ? "border-red-500" : "border-white";
    return (
      <div className="session-main w-full h-screen bg-cyan-600 text-white flex flex-col items-center">
        <div className="font-orbitron sm:text-[50px] text-[35px] w-full h-32 sm:h-40 flex justify-center items-end">
          <h1>25 + 5 Clock</h1>
        </div>
        <div className="w-full sm:h-24 h-40 length-control flex sm:flex-row flex-col justify-center sm:space-x-4 items-center">
          <div className="break-length sm:w-60 w-56 h-full sm:mb-0 mb-1 font-orbitron flex flex-col items-center sm:text-[26px] text-[20px]">
            <h1 id="break-label">Break Length</h1>
            <div className="length-control flex items-center justify-center w-full h-full">
              <button
                id="break-decrement"
                className="hover:cursor-pointer"
                onClick={this.setDecreaseBreak}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>

              <div className="0-60 sm:w-12 w-10 h-full mr-2 ml-2 flex items-center justify-center">
                <p id="break-length">{this.state.break}</p>
              </div>
              <button
                id="break-increment"
                className="hover:cursor-pointer"
                onClick={this.setIncreaseBreak}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            </div>
          </div>
          <div
            id="session-label"
            className="session-length sm:w-60 w-56 h-full font-orbitron flex flex-col items-center sm:text-[26px] text-[20px]"
          >
            <h1>Session Length</h1>
            <div className="session-control flex items-center justify-center w-full h-full">
              <button
                id="session-decrement"
                className="hover:cursor-pointer"
                onClick={this.setDecreaseSession}
              >
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
              <div
                id="session-length"
                className="0-60 sm:w-12 w-10 h-full mr-2 ml-2 flex items-center justify-center"
              >
                {this.state.session}
              </div>
              <button
                id="session-increment"
                className="hover:cursor-pointer"
                onClick={this.setIncreaseSession}
              >
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            </div>
          </div>
        </div>
        <div className="display w-full h-32 sm:h-40 flex justify-center">
          <div
            className={`clock-display sm:w-[300px] w-[250px] h-full border-solid ${alertBorderStyle} border-[1px] sm:rounded-2xl rounded-xl font-orbitron flex flex-col items-center sm:text-[32px] text-[28px]`}
          >
            <h1 id="timer-label" className={`${alertTextStyle}`}>
              {title}
            </h1>
            <div className="session-timer-display w-full h-full text-[46px] sm:text-[52px] flex items-center justify-center">
              <h3 id="time-left" className={`${alertTextStyle}`}>
                {this.timeFormatter()}
              </h3>
            </div>
          </div>
        </div>
        <audio
          id="beep"
          preload="auto"
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
          crossorigin="anonymous"
        ></audio>
        <div className="play-reset sm:pt-4 w-full h-auto  flex items-center flex-col">
          <div className="buttons sm:w-[150px] w-[100px] h-12 flex justify-center items-center space-x-4 sm:text-[36px] text-[24px]">
            <button
              id="start_stop"
              className="hover:cursor-pointer"
              onClick={this.handlePlay}
            >
              <FontAwesomeIcon icon={!this.state.play ? faPlay : faPause} />
            </button>

            <button
              id="reset"
              className="hover:cursor-pointer"
              onClick={this.setReset}
            >
              <FontAwesomeIcon icon={faRefresh} />
            </button>
          </div>
          <div className="foot tracking-wider mt-4 sm:text-[15px] text-[12px]">
            <a
              href="https://github.com/rvif"
              target="_blank"
              className="footer pt-2 font-orbitron"
            >
              created by rvif
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default SessionClock;

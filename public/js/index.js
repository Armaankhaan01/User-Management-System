const sidebar = document.querySelector(".sidebar");
const pieChart = document.querySelector(".pieChart");
const root = document.querySelector(":root");

function updateSidebarWidth() {
  const sidebarWidth = sidebar.getBoundingClientRect().width;
  const pieChartWidth = Math.round(pieChart.getBoundingClientRect().width);
  root.style.setProperty("--sidebar-width", sidebarWidth + "px");
  root.style.setProperty("--piechart-width", pieChartWidth + "px");
}

// Call the updateSidebarWidth function whenever the window is resized
window.addEventListener("resize", updateSidebarWidth);

// Call the updateSidebarWidth function initially to set the sidebar width
updateSidebarWidth();

// for the timer
// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 50;
const ALERT_THRESHOLD = 15;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

let timePassed = 0;
let timerInterval = null;
let remainingPathColor;
let timeLeft = 0;
function calculateColor(timeLeft, TIME_LIMIT) {
  const percent = (timeLeft / TIME_LIMIT) * 100;
  if (percent <= ALERT_THRESHOLD) {
    return COLOR_CODES.alert.color;
  } else if (percent <= WARNING_THRESHOLD) {
    return COLOR_CODES.warning.color;
  } else {
    return COLOR_CODES.info.color;
  }
}

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer(TIME_LIMIT) {
  document.getElementById("app").innerHTML = `
  <div class="col-10">
        <h1 class="text-center">Pie Chart for Server Ram usage</h1>
      </div>
      <div class="base-timer col-2 text-end">
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
</div>
`;
  clearInterval(timerInterval);
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  remainingPathColor = COLOR_CODES.info.color;

  timerInterval = setInterval(() => {
    // timePassed += 1;
    // timeLeft = TIME_LIMIT - timePassed;
    timeLeft--;
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray(TIME_LIMIT);
    setRemainingPathColor(timeLeft, TIME_LIMIT);

    if (timeLeft === 0) {
      timeLeft = TIME_LIMIT; // for infinite loop on dashboard
      // onTimesUp(); // for one time after that 0
    }
  }, 1000);
}

function setRemainingPathColor(timeLeft, TIME_LIMIT) {
  const remainingPath = document.getElementById("base-timer-path-remaining");
  const color = calculateColor(timeLeft, TIME_LIMIT);

  remainingPath.setAttribute("class", `base-timer__path-remaining ${color}`);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function calculateTimeFraction(TIME_LIMIT) {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray(TIME_LIMIT) {
  const circleDasharray = `${(
    calculateTimeFraction(TIME_LIMIT) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

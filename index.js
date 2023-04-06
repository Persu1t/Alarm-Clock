
let clockContainer = document.querySelector('.clock-container');
let dateInput = document.querySelector('#date-input');
let hoursSet = document.querySelector('#hours');
let minutesSet = document.querySelector('#minutes');
let secondsSet = document.querySelector('#seconds');
let sessionSet = document.querySelector('#am-pm');
let alarmList = document.querySelector('#alarm-list');
let alarmSubmitBtn = document.querySelector('#alarm-submit-btn');
let dateFetched = document.querySelector('.date-container');
let dayFetched = document.querySelector('.day-container');

window.addEventListener("DOMContentLoaded", (event) => {
    dropDown(1, 12, hoursSet)
    dropDown(0, 59, minutesSet)
    dropDown(0, 59, secondsSet)
    setInterval(setClock, 1000)
    updateDayAndDate()
    fetchingAlarm()
})

// Adding the event listeners to the submit button
alarmSubmitBtn.addEventListener('click', fetchInput)

// Filling up the dropdowns from the js
function dropDown(start, end, element) {
    for (let i = start; i <= end; i++) {
        let option = document.createElement('option')
        option.value = i < 10 ? '0' + i : i;
        option.innerHTML = i < 10 ? '0' + i : i
        element.appendChild(option)
    }
}

// Showing the clock and rendering time
function setClock() {
    let time = new Date()
    let option =  {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    }
    let formattedTimeString = time.toLocaleTimeString("en-US", option)
    let formattedDateString = time.toLocaleDateString("en-US", {month: "long",  day:"numeric", year:"numeric"})
    let formattedDayString = time.toLocaleDateString("en-US", {weekday: "short"})
    clockContainer.innerHTML = formattedTimeString
    dayFetched.innerHTML = formattedDayString
    dateFetched.innerHTML = formattedDateString
    return formattedTimeString
}

function updateDayAndDate(){
    let today  = new Date()
    let tommrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1)
    let timeUntilMidnight = tommrow-today
    setInterval(() => {
        updateDayAndDate()
        setClock()
    }, timeUntilMidnight);
}


function fetchInput(e) {
    e.preventDefault()
    let getHours = hoursSet.value
    let getMinutes = minutesSet.value
    let getSeconds = secondsSet.value
    let getAmPm = sessionSet.value

    let alarmTime = convertInTime(getHours, getMinutes, getSeconds, getAmPm)
    setAndRingAlarm(alarmTime)
}

// Converting the time into clock time format

function convertInTime(hours, minutes, seconds, amPm) {
    return `${parseInt(hours)}:${minutes}:${seconds} ${amPm}`
}

//  setting and ringing the alarm

function setAndRingAlarm(alarmTime, fetching = false) {
    let alarm = setInterval(() => {
        if(alarmTime === setClock()){
            alert("Alarm is ringing")
        }
    }, 500);
    addAlarmToDOM(alarmTime, alarm )

    if(!fetching){
        saveAlarm(alarmTime)
    }
}

// Adding the alarmTime into the DOM
function addAlarmToDOM(alarmTime,  intervalID) {
    let li = document.createElement("li");
    li.innerHTML =`<span class = "time-set-by-user large">${alarmTime}</span>
    <button class = "btn delete-btn " data-id = "${intervalID}">Delete</button>
    `
    let deleteBtn = li.querySelector(".delete-btn")
    deleteBtn.addEventListener("click",  (e)=>deleteAlarm(e, alarmTime, intervalID))

    alarmList.prepend(li)
}

// Checking the alarm present already in the storage
function checkAlarm(){
    let alarmsArray = [];
    let isAlarmActive = localStorage.getItem("alarmsArray")
    if(isAlarmActive) alarmsArray = JSON.parse(isAlarmActive)

    return alarmsArray
}
//  saving the alarm in the storage
function saveAlarm(alarmTime){
    let alarms = checkAlarm()

    alarms.push(alarmTime)
    localStorage.setItem("alarmsArray", JSON.stringify(alarms))
}

// fetching the alarm
function fetchingAlarm(){
    let alarms = checkAlarm()
    alarms.forEach((time)=>{
        setAndRingAlarm(time, true)
    })
}

//  deleting the alarm
function deleteAlarm(event, alarmTime, intervalID){
    const target = event.target
    clearInterval(intervalID)
    const alarm = target.parentElement

    deleteAlarmFromStorage(alarmTime)
    alarm.remove()
}

// Delete from the storage
function deleteAlarmFromStorage(time){
    const alarm = checkAlarm()

    const index = alarm.indexOf(time)
    alarm.splice(index, 1)
    localStorage.setItem("alarmsArray", JSON.stringify(alarm))
}




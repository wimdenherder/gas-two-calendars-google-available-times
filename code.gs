function main() {
  let day = new Date(2020, 4, 4);
  let startTime = "8:00";
  let endTime = "19:00";
  let minBlockDuration = 60;
  let res = getAvailableTimeSlots(
    ["Person1", "Person2", "Person3"],
    day,
    startTime,
    endTime,
    minBlockDuration
  );
  // debug & log here
}

function getAvailableTimeSlots(
  calNames,
  day,
  startTime,
  endTime,
  minBlockDuration
) {
  let calsEvents = calNames.map((calName) => getEventsForCal(calName, day));
  [startTimeToMinuteIndex, endTimeToMinuteIndex] = [startTime, endTime].map(
    (time) => dayAndTimeToMinuteIndex(day, time)
  );
  let availableMinutes = getAvailableMinutes(
    startTimeToMinuteIndex,
    endTimeToMinuteIndex,
    calsEvents
  );
  return getAvailableBlocks(availableMinutes, minBlockDuration);
}

const getAvailableBlocks = (availableMinutes, minBlockDuration) => {
  let availableBlocks = [];
  availableMinutes.sort();
  for (let i = 0; i < availableMinutes.length; i++) {
    let min = availableMinutes[i];
    let k = 1;
    while (availableMinutes.includes(min + k)) {
      k++;
    }
    if ((k) => minBlockDuration) {
      availableBlocks.push([displayDate(min), displayDate(min + k)]);
    }
    i += k - 1;
  }
  return availableBlocks;
};

const getAvailableMinutes = (
  startTimeToMinuteIndex,
  endTimeToMinuteIndex,
  calsEvents
) => {
  let availableMinutes = [];
  for (let min = startTimeToMinuteIndex; min < endTimeToMinuteIndex; min++) {
    if (!calsEvents.some((calEvents) => calEvents.containsMinute(min)))
      availableMinutes.push(min);
  }
  return availableMinutes;
};

const dayAndTimeToMinuteIndex = (day, time) => {
  day.setHours(time.split(":")[0]);
  day.setMinutes(time.split(":")[1]);
  return day.getTime() / 1000 / 60;
};

const displayDate = (min) => {
  let date = new Date(min * 60 * 1000);
  return date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
};

const getEventsForCal = (nameCal, day) => {
  let cal = CalendarApp.getCalendarsByName(nameCal)[0];
  let calEvents = cal.getEventsForDay(day);
  let eventsWithTimes = calEvents.map(function (calEvent) {
    return new Event(calEvent);
  });
  return new Events(eventsWithTimes);
};

class Event {
  constructor(calendarEvent) {
    this.startTime = Math.floor(
      calendarEvent.getStartTime().getTime() / 60 / 1000
    );
    this.endTime = Math.floor(calendarEvent.getEndTime().getTime() / 60 / 1000);
  }
  containsMinute(minute) {
    return this.startTime <= minute && minute < this.endTime;
  }
}

class Events {
  constructor(events) {
    this.events = events;
  }
  containsMinute(minute) {
    return this.events.some((event) => event.containsMinute(minute));
  }
}
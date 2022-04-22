function main() {
  const day = new Date(2020, 4, 4);
  const startTime = "8:00";
  const endTime = "19:00";
  const minBlockDuration = 60;
  const res = getAvailableTimeSlots(
    ["Person1", "Person2", "Person3"],
    day,
    startTime,
    endTime,
    minBlockDuration
  );
  // debug & log here
  Logger.log(res);
}

function getAvailableTimeSlots(
  calNames,
  day,
  startTime,
  endTime,
  minBlockDuration
) {
  const calsEvents = calNames.map((calName) => getEventsForCal(calName, day));
  [startTimeToMinuteIndex, endTimeToMinuteIndex] = [startTime, endTime].map(
    (time) => dayAndTimeToMinuteIndex(day, time)
  );
  const availableMinutes = getAvailableMinutes(
    startTimeToMinuteIndex,
    endTimeToMinuteIndex,
    calsEvents
  );
  return getAvailableBlocks(availableMinutes, minBlockDuration);
}

const getAvailableBlocks = (availableMinutes, minBlockDuration) => {
  const availableBlocks = [];
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
  const availableMinutes = [];
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
  const date = new Date(min * 60 * 1000);
  return date.getHours() + ":" + ("00" + date.getMinutes()).slice(-2);
};

const getEventsForCal = (nameCal, day) => {
  const cal = CalendarApp.getCalendarsByName(nameCal)[0];
  const calEvents = cal.getEventsForDay(day);
  const eventsWithTimes = calEvents.map(function (calEvent) {
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

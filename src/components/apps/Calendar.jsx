import { useState } from "react";
import Icon from "../Icons";
import { useOSStore } from "../../store/osStore";

const Calendar = () => {
  const { settings } = useOSStore();
  const isLight = settings.theme === 'light';
  const textColor = isLight ? 'text-black' : 'text-white';
  const textMuted = isLight ? 'text-black/60' : 'text-white/60';
  const textFaint = isLight ? 'text-black/40' : 'text-white/40';
  const bgCard = isLight ? 'bg-black/5' : 'bg-white/5';
  const bgHover = isLight ? 'hover:bg-black/10' : 'hover:bg-white/10';
  const borderColor = isLight ? 'border-black/10' : 'border-white/10';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: "Team Meeting", date: new Date(), time: "10:00", color: "#e94560" },
    { id: 2, title: "Lunch Break", date: new Date(), time: "12:30", color: "#3b82f6" },
    { id: 3, title: "Project Review", date: new Date(), time: "15:00", color: "#10b981" },
  ]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "09:00", color: "#e94560" });

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day, isCurrentMonth) => {
    const today = new Date();
    return (
      isCurrentMonth &&
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day, isCurrentMonth) => {
    return (
      isCurrentMonth &&
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventsForDate = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleAddEvent = () => {
    if (newEvent.title) {
      setEvents([
        ...events,
        {
          id: Date.now(),
          ...newEvent,
          date: selectedDate,
        },
      ]);
      setNewEvent({ title: "", time: "09:00", color: "#e94560" });
      setShowEventForm(false);
    }
  };

  const selectedDateEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className={`h-full flex ${isLight ? 'bg-gray-50' : 'bg-os-bg'}`}>
      {/* Calendar */}
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${textColor}`}>
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg ${bgHover} transition-colors`}
              onClick={prevMonth}
            >
              <Icon name="ChevronLeft" size={20} className={textMuted} />
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${bgHover} transition-colors text-sm ${textMuted}`}
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDate(new Date());
              }}
            >
              Today
            </button>
            <button
              className={`p-2 rounded-lg ${bgHover} transition-colors`}
              onClick={nextMonth}
            >
              <Icon name="ChevronRight" size={20} className={textMuted} />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className={`text-center text-xs ${textFaint} py-2`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentDate).map((item, index) => {
            const dayEvents = getEventsForDate(item.day, item.isCurrentMonth);
            return (
              <button
                key={index}
                className={`aspect-square p-1 rounded-lg transition-colors relative ${
                  item.isCurrentMonth ? bgHover : "opacity-30"
                } ${isSelected(item.day, item.isCurrentMonth) ? "bg-os-primary/20 ring-1 ring-os-primary" : ""}`}
                onClick={() => {
                  if (item.isCurrentMonth) {
                    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), item.day));
                  }
                }}
              >
                <span
                  className={`text-sm ${
                    isToday(item.day, item.isCurrentMonth)
                      ? "w-7 h-7 rounded-full bg-os-primary text-white flex items-center justify-center mx-auto"
                      : item.isCurrentMonth
                      ? textMuted
                      : (isLight ? "text-black/30" : "text-white/30")
                  }`}
                >
                  {item.day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`w-72 border-l ${borderColor} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-medium ${textColor}`}>
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </h3>
          <button
            className={`p-1.5 rounded-lg ${bgHover} transition-colors`}
            onClick={() => setShowEventForm(!showEventForm)}
          >
            <Icon name="Plus" size={18} className={textMuted} />
          </button>
        </div>

        {showEventForm && (
          <div className={`mb-4 p-3 rounded-lg ${bgCard} space-y-3`}>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${bgCard} border ${borderColor} text-sm ${textColor} placeholder:${textFaint}`}
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg ${bgCard} border ${borderColor} text-sm ${textColor}`}
            />
            <div className="flex gap-2">
              {["#e94560", "#3b82f6", "#10b981", "#f59e0b"].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full ${
                    newEvent.color === color ? "ring-2 ring-white/50" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewEvent({ ...newEvent, color })}
                />
              ))}
            </div>
            <button
              className="w-full py-2 rounded-lg bg-os-primary hover:bg-os-primary/80 text-white text-sm transition-colors"
              onClick={handleAddEvent}
            >
              Add Event
            </button>
          </div>
        )}

        <div className="space-y-2">
          {selectedDateEvents.length === 0 ? (
            <p className={`text-sm ${textFaint} text-center py-4`}>No events</p>
          ) : (
            selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg ${bgCard} flex items-start gap-3`}
              >
                <div
                  className="w-1 h-full rounded-full self-stretch"
                  style={{ backgroundColor: event.color }}
                />
                <div>
                  <h4 className={`text-sm font-medium ${textColor}`}>{event.title}</h4>
                  <p className={`text-xs ${textFaint}`}>{event.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, addWeeks, addDays, subWeeks, subDays } from 'date-fns';

interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location?: string;
  type: 'meeting' | 'task' | 'event';
  color: string;
  description?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id'>) => void;
  selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: format(selectedDate, 'yyyy-MM-dd'),
    time: '',
    location: '',
    type: 'event' as Event['type'],
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.time.trim()) return;

    const eventColors = {
      meeting: 'bg-blue-500',
      task: 'bg-orange-500',
      event: 'bg-purple-500'
    };

    onSubmit({
      ...formData,
      date: new Date(formData.date),
      color: eventColors[formData.type]
    });

    setFormData({
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '',
      location: '',
      type: 'event',
      description: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Event</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="event">Event</option>
              <option value="meeting">Meeting</option>
              <option value="task">Task</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Team Meeting',
      date: new Date(2024, 0, 15),
      time: '10:00',
      location: 'Conference Room A',
      type: 'meeting',
      color: 'bg-blue-500',
      description: 'Weekly team sync meeting'
    },
    {
      id: 2,
      title: 'Product Launch',
      date: new Date(2024, 0, 20),
      time: '14:00',
      location: 'Main Hall',
      type: 'event',
      color: 'bg-purple-500',
      description: 'Launch event for new product'
    },
    {
      id: 3,
      title: 'Client Presentation',
      date: new Date(2024, 0, 25),
      time: '15:30',
      location: 'Online',
      type: 'meeting',
      color: 'bg-blue-500',
      description: 'Present quarterly results to client'
    },
    {
      id: 4,
      title: 'Code Review',
      date: new Date(2024, 0, 18),
      time: '11:00',
      type: 'task',
      color: 'bg-orange-500',
      description: 'Review pull requests for authentication module'
    }
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getDayEvents = (date: Date) => {
    return getEventsForDate(date);
  };

  const next = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const prev = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleAddEvent = () => {
    setShowEventModal(true);
  };

  const handleEventSubmit = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderMonthView = () => (
    <>
      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                !isSameMonth(day, currentDate)
                  ? 'bg-gray-50 dark:bg-gray-900 text-gray-400'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday
                  ? 'bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                  : isSelected
                  ? 'text-primary-600 dark:text-primary-400'
                  : isSameMonth(day, currentDate)
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderWeekView = () => (
    <>
      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {weekDays.map((day) => (
          <div key={day.toString()} className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {format(day, 'EEE d')}
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day)}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${
                isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : ''
              } ${isToday ? 'bg-primary-500 text-white' : ''}`}
            >
              <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderDayView = () => {
    const dayEvents = getDayEvents(selectedDate);
    const isToday = isSameDay(selectedDate, new Date());

    return (
      <div className="p-6">
        <h3 className={`text-lg font-semibold mb-4 ${isToday ? 'text-primary-500' : ''}`}>
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        {dayEvents.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No events scheduled</p>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} />
                  {formatTime(event.time)}
                  {event.location && (
                    <>
                      <MapPin size={12} />
                      {event.location}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your schedule and events</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            {['month', 'week', 'day'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType as typeof view)}
                className={`px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  view === viewType
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${viewType === 'month' ? 'rounded-l-md' : viewType === 'day' ? 'rounded-r-md' : ''}`}
              >
                {viewType}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {view === 'month' && format(currentDate, 'MMMM yyyy')}
                {view === 'week' && `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`}
                {view === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h2>
              <button
                onClick={next}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Today
            </button>
          </div>

          {/* Render view based on state */}
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-3">
              {getDayEvents(selectedDate).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-1 ${event.color}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} />
                      {formatTime(event.time)}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    )}
                    {event.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {getDayEvents(selectedDate).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No events scheduled
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={handleAddEvent}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <CalendarIcon size={16} className="text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule Meeting</span>
              </button>
              <button 
                onClick={handleAddEvent}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Plus size={16} className="text-accent-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSubmit={handleEventSubmit}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Calendar;
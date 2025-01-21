import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  isBefore,
  subDays,
  differenceInCalendarDays,
} from "date-fns";

const DatePicker = ({ onDateSelect = () => {}, initialDate = new Date() }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const getWeekStart = (date) => {
    return isMobile
      ? subDays(
          date,
          Math.min(
            2,
            differenceInCalendarDays(
              date,
              startOfWeek(date, { weekStartsOn: 1 })
            )
          )
        )
      : startOfWeek(date, { weekStartsOn: 1 });
  };
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(initialDate)
  );

  useEffect(() => {
    setCurrentWeekStart(getWeekStart(selectedDate));
  }, [isMobile, selectedDate]);

  const formatDate = (date) => format(date, "yyyy-MM-dd");

  const daysInWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const generateDays = () => {
    const days = [];
    const daysToShow = isMobile ? 5 : 7;
    const today = new Date();

    for (let i = 0; i < daysToShow; i++) {
      const currentDate = addDays(currentWeekStart, i);
      days.push({
        date: currentDate,
        dayNumber: format(currentDate, "d"),
        day: daysInWeek[format(currentDate, "i") - 1], // Lấy thứ trong tuần
        isToday: isSameDay(currentDate, today),
        isSelected: isSameDay(currentDate, selectedDate),
        isPast: isBefore(currentDate, today),
      });
    }
    return days;
  };

  const generateMonthsGrid = () => {
    const currentYear = format(currentWeekStart, "yyyy");
    const currentMonth = format(currentWeekStart, "M") - 1; // Tháng bắt đầu từ 0
    return months.map((month, index) => ({
      name: month,
      index,
      isCurrent: index === currentMonth,
    }));
  };

  const navigateWeek = (direction) => {
    const daysToMove = isMobile ? 5 : 7;
    setCurrentWeekStart(
      addDays(currentWeekStart, direction === "next" ? daysToMove : -daysToMove)
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(formatDate(date));
  };

  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(currentWeekStart);
    newDate.setMonth(monthIndex);
    setCurrentWeekStart(getWeekStart(newDate));
    setShowMonthPicker(false);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentWeekStart);
    newDate.setFullYear(
      currentWeekStart.getFullYear() + (direction === "next" ? 1 : -1)
    );
    setCurrentWeekStart(newDate);
  };

  const getColorClasses = (isSelected, isToday, isPast) => {
    if (isSelected) {
      return `!wp-bg-[#0d8888] !wp-text-white`;
    }
    if (isToday) {
      return `!wp-border-2 !wp-border-[#0d8888] !wp-text-[#0d8888]`;
    }
    if (isPast) {
      return "!wp-text-gray-400";
    }
    return "!wp-text-gray-700 hover:!wp-bg-gray-100";
  };
  // console.log(format(currentWeekStart, "MMMM yyyy"), "format(currentWeekStart");

  return (
    <div className="!wp-bg-white !wp-py-[10px] md:!wp-p-4 !wp-rounded-lg ">
      {/* Header with month/year selector */}
      <div className="!wp-flex !wp-items-center !wp-justify-between !wp-mb-4">
        <button
          onClick={() => setShowMonthPicker(!showMonthPicker)}
          className="!wp-flex !wp-items-center !wp-space-x-2 md:!wp-px-3 !wp-py-1 !wp-px-0 !wp-rounded-lg hover:!wp-bg-gray-100 !wp-transition-colors !wp-bg-white"
        >
          {/* <Calendar className="w-4 h-4" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="!wp-size-4 md:!wp-size-6 !wp-text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>

          <span className="!wp-font-medium !wp-text-sm !wp-text-gray-500">
            {format(currentWeekStart, "MMMM yyyy")}
          </span>
        </button>
        <div className="!wp-text-sm !wp-text-gray-500">
          Selected: {selectedDate ? formatDate(selectedDate) : "None"}
        </div>
      </div>

      {/* Month Picker Overlay */}
      {showMonthPicker && (
        <div className="!wp-absolute !wp-z-10 !wp-bg-white !wp-rounded-lg !wp-shadow-xl !wp-p-4 !wp-border">
          <div className="!wp-flex !wp-items-center !wp-justify-between !wp-mb-4">
            <button
              onClick={() => navigateYear("prev")}
              className="!wp-p-2 !wp-rounded-full hover:!wp-bg-gray-100 !wp-bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="!wp-size-6 !wp-text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <span className="!wp-font-bold">
              {format(currentWeekStart, "yyyy")}
            </span>
            <button
              onClick={() => navigateYear("next")}
              className="!wp-p-2 !wp-rounded-full hover:!wp-bg-gray-100 !wp-bg-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="!wp-size-6 !wp-text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
          <div className="!wp-grid !wp-grid-cols-3 !wp-gap-2">
            {generateMonthsGrid().map((month) => (
              <button
                key={month.index}
                onClick={() => handleMonthClick(month.index)}
                className={`
                  !wp-p-2 !wp-rounded-lg !wp-transition-colors  
                  ${
                    month.isCurrent
                      ? `!wp-bg-[#0d8888] !wp-text-white`
                      : "hover:!wp-bg-gray-100 !wp-bg-white !wp-text-black"
                  }
                `}
              >
                {month.name.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Week Selector */}
      <div className="!wp-flex !wp-items-center !wp-justify-center">
        <button
          onClick={() => navigateWeek("prev")}
          className="!wp-p-2 !wp-rounded-full !wp-bg-white hover:!wp-bg-gray-100 !wp-transition-colors md:!wp-mr-2"
          aria-label="Previous week"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="!wp-size-3.5 md:!wp-size-6 !wp-text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <div className="!wp-flex !wp-w-full !wp-space-x-2">
          {generateDays().map((dayInfo, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(dayInfo.date)}
              className={`
             !wp-flex !wp-flex-col !wp-items-center !wp-justify-center 
             ${
               isMobile ? "!wp-w-1/6" : "!wp-w-[41px]"
             } !wp-h-[38px] md:!wp-w-14 md:!wp-h-20 
             !wp-rounded-lg !wp-cursor-pointer !wp-transition-all !wp-duration-200 !wp-ease-in-out
             !wp-transform hover:!wp-scale-105
             ${getColorClasses(
               dayInfo.isSelected,
               dayInfo.isToday,
               dayInfo.isPast
             )}
           `}
            >
              <span className="!wp-text-xs !wp-font-normal md:!wp-font-medium md:!wp-mb-1">
                {dayInfo.day}
              </span>
              <span
                className={`!wp-text-xs md:!wp-text-lg ${
                  dayInfo.isSelected || dayInfo.isToday
                    ? "!wp-font-bold"
                    : "!wp-font-medium"
                }`}
              >
                {dayInfo.dayNumber}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigateWeek("next")}
          className="!wp-p-2 !wp-rounded-full !wp-bg-white hover:!wp-bg-gray-100 !wp-transition-colors md:!wp-ml-2"
          aria-label="Next week"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="!wp-size-3.5 md:!wp-size-6 !wp-text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DatePicker;

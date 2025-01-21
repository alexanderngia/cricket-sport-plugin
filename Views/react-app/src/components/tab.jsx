"use client";

import React, { useState, useEffect } from "react";
import { Card } from "../components/card";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "../components/datePicker";
import { format, addDays } from "date-fns";

export const Tab = () => {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(format(today, "yyyy-MM-dd"));
  const [tabContentID, setTabContentID] = useState(null);

  const [active, setActive] = useState(1);
  const [tabContent, setTabContent] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = [
    {
      id: 1,
      title: "Live Score",
      apiEndpoint: `/live/schedule.json`,
      data: "https://api.turbosify.com/api/cricket/daily-live-schedule",
    },
    {
      id: 2,
      title: "Recent Match",
      apiEndpoint: `/2024-10-10/results.json`,
      data: `https://api.turbosify.com/api/cricket/daily-results?time=${format(
        today,
        "yyyy-MM-dd"
      )}`,
    },
    {
      id: 3,
      title: "Upcoming Match",
      apiEndpoint: "Upcoming Match",
      data: `https://api.turbosify.com/api/cricket/daily-results?time=${format(
        today,
        "yyyy-MM-dd"
      )}`,
    },
    {
      id: 4,
      title: "Match Result",
      apiEndpoint: "Match Result",
      data: `https://api.turbosify.com/api/cricket/daily-results?time=${selectedDate}`,
    },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      setTabContent([]);

      try {
        const activeTab = navigation.find((tab) => tab.id === active);
        if (!activeTab) {
          setError("No Data");
          return;
        }

        setTabContentID(activeTab.id);

        if (activeTab.id === 2) {
          const today = new Date();
          const dates = [
            format(addDays(today, -2), "yyyy-MM-dd"),
            format(addDays(today, -1), "yyyy-MM-dd"),
            format(today, "yyyy-MM-dd"),
            format(addDays(today, 1), "yyyy-MM-dd"),
            format(addDays(today, 2), "yyyy-MM-dd"),
          ];
          await fetchAndSetTabContent(activeTab.data, dates);
        } else if (activeTab.id === 3) {
          const today = new Date();
          const dates = Array.from({ length: 6 }, (_, i) =>
            format(addDays(today, i), "yyyy-MM-dd")
          );
          await fetchAndSetTabContent(activeTab.data, dates);
        } else {
          await fetchAndSetTabContent(activeTab.data);
        }
      } catch (err) {
        setError("No Data");
      } finally {
        setLoading(false);
      }
    };

    const fetchAndSetTabContent = async (baseUrl, dates = []) => {
      try {
        let combinedData = [];

        if (dates.length > 0) {
          const responses = await Promise.all(
            dates.map((date) =>
              fetch(`${baseUrl.split("?")[0]}?time=${date}`, {
                method: "GET",
                headers: { accept: "application/json" },
              })
            )
          );
          const results = await Promise.all(responses.map((res) => res.json()));
          combinedData = results.flatMap((result) => result.data || []);
        } else {
          const response = await fetch(baseUrl, {
            method: "GET",
            headers: { accept: "application/json" },
          });
          if (!response.ok) throw new Error("No Data");
          const { data } = await response.json();
          combinedData = data || [];
        }

        if (combinedData.length === 0) {
          setError("No Data");
          return;
        }

        const grouped = combinedData.reduce((acc, match) => {
          if (!match?.tournament_name) return acc;
          if (!acc[match.tournament_name]) {
            acc[match.tournament_name] = {
              tournament_name: match.tournament_name,
              matches: [],
            };
          }
          acc[match.tournament_name].matches.push(match);
          return acc;
        }, {});

        const groupedValues = Object.values(grouped);
        if (groupedValues.length === 0) {
          setError("No Data");
          return;
        }

        setTabContent(groupedValues);
      } catch (err) {
        setError("No Data");
      }
    };

    fetchContent();
  }, [active, selectedDate]);

  useEffect(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    setSelectedDate(today);
  }, [active]);
  const handleDateSelect = (dateString) => {
    if (!dateString) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(dateString);
  };

  return (
    <>
      <div className="wp-py-[10px] md:wp-py-[50px] !wp-flex md:!wp-items-center !wp-items-start wp-justify-center wp-flex-col md:wp-gap-[30px] wp-px-[20px] wp-bg-white !wp-rounded-[16px] ">
        <div className="wp-overflow-auto wp-rounded-[6.4px] md:wp-bg-[#d1eeee] wp-flex wp-items-center md:!wp-justify-center md:!wp-w-[854px] !wp-w-full wp-h-[60px] wp-gap-3 md:wp-gap-0">
          {navigation.map(({ id, title }, index) => {
            const isLast = index === navigation.length - 1;
            const classes = isLast ? "md:!wp-w-[190px]" : "md:!wp-w-[213.43px]";

            return (
              <div
                onClick={() => setActive(id)}
                key={id}
                className={`wp-px-[10px] wp-py-[8px] wp-rounded-[5px] wp-h-[37.5px] wp-flex wp-items-center wp-justify-center wp-cursor-pointer ${classes} ${
                  active === id ? "wp-bg-[#0d8888]" : "wp-bg-[#d1eeee]"
                }`}
              >
                <p
                  className={`wp-w-fit wp-text-[#292929] wp-text-base wp-text-center wp-whitespace-nowrap ${
                    active === id ? "wp-text-[#ffffff]" : "wp-text-[#292929]"
                  }`}
                >
                  {title}
                </p>
              </div>
            );
          })}
        </div>
        {tabContentID === 4 && (
          <div className="!wp-w-full md:!wp-w-auto md:!wp-mb-4">
            <DatePicker primaryColor="blue" onDateSelect={handleDateSelect} />
          </div>
        )}
      </div>
      <div className=" wp-bg-[#F5F5F5] wp-flex wp-flex-col md:wp-items-center md:wp-justify-center">
        {loading && (
          <div
            role="status"
            className="wp-p-11 wp-flex wp-items-center wp-justify-center"
          >
            <svg
              aria-hidden="true"
              className="wp-w-8 wp-h-8 wp-text-gray-200 wp-animate-spin dark:wp-text-gray-600 wp-fill-[#0d8888]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}
        {error && <p className="wp-text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="wp-flex !wp-flex-col md:!wp-flex-row wp-space-y-4 wp-gap-0 wp-mt-0 wp-p-[20px] md:wp-p-0  md:wp-py-[60px] md:!wp-flex-wrap md:!wp-gap-6 md:!wp-w-[80%] md:wp-max-w-[1200px]">
            {tabContent.length > 0 &&
              tabContent
                .filter(({ matches }) => {
                  if (tabContentID === 1) {
                    return matches.some(
                      (match) => match.match_status === "live"
                    );
                  } else if (tabContentID === 3) {
                    return matches.some(
                      (match) =>
                        match.match_status === "not-started" &&
                        match.team_1.score.length === 0
                    );
                  } else {
                    return true;
                  }
                })
                .map(({ tournament_name, matches }) => {
                  return (
                    <div
                      className="md:!wp-w-fit md:wp-max-w-[100%] md:!wp-mt-0"
                      key={uuidv4()}
                    >
                      <h3
                        className={`wp-font-semibold md:wp-font-medium wp-text-[16px] wp-uppercase md:wp-text-[29px] wp-mb-[20px] md:wp-mb-[30px] !wp-font-sans`}
                      >
                        {tournament_name}
                      </h3>
                      <div className="wp-flex wp-flex-col md:wp-flex-row md:wp-gap-6 wp-gap-3 md:wp-overflow-auto wp-custom-scroll-bar">
                        {matches.map((content) => (
                          <Card
                            data={content}
                            key={uuidv4()}
                            tabContentID={tabContentID}
                            selectedDate={selectedDate}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
          </div>
        )}
      </div>
    </>
  );
};

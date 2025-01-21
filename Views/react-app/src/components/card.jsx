import React from "react";
import VSicon from "../asset/VSICON.png";
import { v4 as uuidv4 } from "uuid";

export const Card = ({ data, tabContentID, selectedDate }) => {
  const {
    tournament_type,
    tournament_name,
    team_1,
    team_2,
    match_details,
    match_status,
    start_time,
  } = data;
  const shouldHide =
    (tabContentID === 1 && match_status !== "live") ||
    (tabContentID === 3 && team_1.score.length > 0);

  const generateOutput = (inputString) => {
    if (!inputString) return "";

    const words = inputString.split(" ");
    const firstLetters = words.map((word) => word[0]?.toUpperCase()).join("");

    const numbers = inputString.replace(/\D/g, "");

    if (numbers.length >= 7 && firstLetters) {
      return (
        firstLetters +
        numbers.slice(-7) +
        numbers.slice(-5) +
        firstLetters.slice(-1)
      );
    } else if (firstLetters) {
      return firstLetters;
    }

    return "";
  };

  return (
    <div className={`${shouldHide ? "wp-hidden" : ""}`}>
      <div
        className={`wp-w-full sm:wp-w-[375px] wp-h-[271px] wp-bg-white wp-p-[20px] wp-flex wp-flex-col wp-mb-2 wp-gap-[15px] wp-rounded-[16px]`}
      >
        <div className="wp-flex wp-w-full wp-justify-between">
          <div className="!wp-w-[70%]">
            <h3 className="!wp-text-[14px] md:!wp-text-[16px] !wp-font-regular wp-text-[#5C5C5C] !wp-font-sans !wp-whitespace-nowrap !wp-w-full !wp-overflow-hidden">
              {tournament_name}
            </h3>
            <p className="wp-w-1/2 !wp-text-[10px] md:!wp-text-[12px] !wp-font-regular !wp-text-[#5c5c5c] !wp-font-sans">
              {start_time}
            </p>
          </div>

          <span
            className={`wp-bg-[#ededed] wp-w-[69px] wp-h-[28px] wp-text-[14px] wp-font-medium wp-uppercase wp-flex wp-justify-center wp-items-center wp-rounded-[4px]`}
          >
            <p
              className={` !wp-text-center ${
                tournament_type.length < 4 ? "!wp-w-fit" : "!wp-w-[30px]"
              } wp-whitespace-nowrap wp-overflow-hidden`}
            >
              {generateOutput(`${tournament_type}`)}
            </p>
          </span>
        </div>

        <div className="wp-flex wp-justify-between wp-items-center wp-relative !wp-px-[10px] md:!wp-px-[22px] ">
          <div
            key={uuidv4()}
            className="wp-flex wp-flex-col wp-items-center wp-justify-center wp-gap-[10px]"
          >
            <img src={team_1.flag} height={42} width={65} alt="flag icon" />
            <span className="wp-text-[14px] md:wp-text-[16px] wp-uppercase wp-font-medium wp-text-[#292929] wp-leading-[18.75px] wp-whitespace-nowrap wp-w-[65px] wp-overflow-hidden wp-text-center">
              {team_1.name}
            </span>
            <span className="wp-text-[#5c5c5c] wp-font-normal wp-text-[12px] md:wp-text-[14px] wp-leading-[16.41px] wp-h-[17px]">
              {team_1.score ? team_1.score : "----"}
            </span>
          </div>
          <img
            className={`wp-absolute wp-left-[42%]`}
            src={VSicon}
            height={51}
            width={51}
            alt="vs icon"
          />
          <div
            key={uuidv4()}
            className="wp-flex wp-flex-col wp-items-center wp-justify-center wp-gap-[10px]"
          >
            <img src={team_2.flag} height={42} width={65} alt="flag icon" />
            <span className="wp-text-[14px] md:wp-text-[16px] wp-uppercase wp-font-medium wp-text-[#292929] wp-leading-[18.75px] wp-whitespace-nowrap wp-w-[65px] wp-overflow-hidden wp-text-center">
              {team_2.name}
            </span>
            <span className="wp-text-[#5c5c5c] wp-font-normal wp-text-[12px] md:wp-text-[14px] wp-leading-[16.41px] wp-h-[17px]">
              {team_2.score ? team_2.score : "----"}
            </span>
          </div>
        </div>
        <div
          className={`wp-w-full wp-h-[36px] wp-rounded-[4px] ${
            match_status === "live" ? "wp-bg-[#D1EEEE]" : "wp-bg-[#ededed]"
          }`}
        >
          <p
            className={`wp-flex wp-items-center wp-justify-center wp-h-[36px] wp-text-[14px] wp-font-normal ${
              match_status === "live" ? "text-[#0D8888]" : "text-[#5c5c5c]"
            }`}
          >
            {tabContentID === 1 && match_status === "live" ? "Living" : ""}

            {tabContentID === 3 && match_status === "not-started"
              ? "Upcomming"
              : ""}
            {tabContentID === 2 &&
              (match_status === "live"
                ? "Living"
                : match_status === "not-started"
                ? "Not started"
                : match_details)}
            {tabContentID === 4 &&
              (match_status === "live"
                ? "Living"
                : team_1.score.length === 0
                ? "Not started"
                : match_details)}
          </p>
        </div>
      </div>
    </div>
  );
};

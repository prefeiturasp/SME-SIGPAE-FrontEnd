import { WEEK } from "src/configs/constants";
import React from "react";
import "./style.scss";

export const Weekly = ({ ...props }) => {
  const { handleWeekly, arrayDiasSemana, dataTestId } = props;
  return (
    <div
      className={`weekly ${props.classNameArgs || ""}`}
      data-testid={dataTestId}
    >
      {props.label && [
        props.required && <span className="required-asterisk">*</span>,
        <label key={1} htmlFor={props.name} className="col-form-label">
          {props.label}
        </label>,
      ]}
      <div>
        {WEEK.map((day, key) => {
          return (
            <span
              key={key}
              onClick={async () => await handleWeekly(day.value)}
              className={
                arrayDiasSemana && arrayDiasSemana.includes(day.value)
                  ? "week-circle-clicked"
                  : "week-circle"
              }
              data-cy={`dia-${key}`}
              value={day.value}
              data-testid={`${dataTestId}-${key}`}
            >
              {day.label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Weekly;

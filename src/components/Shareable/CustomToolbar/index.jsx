import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import moment from "moment";
import React from "react";
import { useEffect } from "react";

export const CustomToolbar = (toolbar) => {
  useEffect(() => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate("current");
  }, []);

  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate("prev");
  };

  const goToMonthView = () => {
    toolbar.onView("month");
  };

  const goToNext = async () => {
    await toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    await toolbar.onNavigate("next");
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span>
        {date.format("MMMM")} {date.format("YYYY")}
      </span>
    );
  };

  return (
    <div className="row toolbar-container mb-3">
      <div className="col-6">
        <div
          className="mes-tab"
          role="button"
          tabIndex={0}
          onClick={goToMonthView}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goToMonthView();
            }
          }}
        >
          Mês
        </div>
      </div>
      {toolbar.view === "month" && (
        <div className="col-6 text-end">
          <div className={"back-next-buttons"}>
            <Botao
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              icon={BUTTON_ICON.ARROW_LEFT}
              onClick={() => goToBack()}
            />
            <span className="label-month">{label()}</span>
            <Botao
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              icon={BUTTON_ICON.ARROW_RIGHT}
              onClick={() => goToNext()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

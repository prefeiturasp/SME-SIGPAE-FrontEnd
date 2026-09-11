import React, { useState } from "react";
import { arrayOf, string, number, func, node } from "prop-types";
import "./style.scss";

const Tab = ({ index, activeIndex, setActiveIndex, title }) => {
  const active = index === activeIndex;
  return (
    <div
      onClick={() => setActiveIndex(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActiveIndex(index);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      className={`tab col ${active ? "active" : "inactive"}`}
    >
      {title}
    </div>
  );
};
Tab.propTypes = {
  index: number,
  activeIndex: number,
  setActiveIndex: func,
  title: string,
};

const Tabs = ({ tabs, children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabs-container">
      <div className="tabs">
        <div className="row">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              title={tab}
            />
          ))}
        </div>
      </div>
      {children({ activeIndex })}
    </div>
  );
};

Tabs.propTypes = {
  tabs: arrayOf(string),
  children: node,
};

export default Tabs;

import React from "react";
import { NavLink } from "react-router-dom";

export const ListItem = ({ icon, to, children }) => (
  <li className="nav-item">
    <NavLink className={`nav-link collapsed`} to={to}>
      <i className={`fas ${icon}`} />
      <span>{children}</span>
    </NavLink>
  </li>
);

export const SubMenu = ({
  icon,
  path,
  title,
  onClick,
  activeMenu,
  dataTestId,
  children,
}) => (
  <div>
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(path);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick(path);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={activeMenu === path}
      data-testid={dataTestId}
      className={`collapse-item ${activeMenu === path ? "active" : ""}`}
    >
      {title}
      <i className={`fas ${icon}`} />
    </div>
    {activeMenu === path && <div className="submenu">{children}</div>}
  </div>
);

export const LeafItem = ({ to, dataTestId, children }) => {
  return (
    <NavLink data-testid={dataTestId} className="collapse-item" to={to}>
      {" "}
      {children}
    </NavLink>
  );
};

export const Menu = ({ id, title, icon, dataTestId, children }) => {
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentElement = document.querySelector(`#collapse${id}`);
    const otherElements = document.querySelectorAll(".nav-item .show");
    otherElements.forEach((element) => {
      if (element !== currentElement) element.classList.remove("show");
    });
    currentElement.classList.toggle("show");
  };

  return (
    <li className="nav-item" data-testid={dataTestId}>
      <div
        className={`nav-link collapsed`}
        data-toggle="collapse"
        data-target={`#collapse${id}`}
        aria-expanded="false"
        aria-controls={`collapse${id}`}
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleToggle(e);
          }
        }}
      >
        <i className={`fas ${icon}`} />
        <span>{title}</span>
      </div>
      <div
        id={`collapse${id}`}
        className={`collapse`}
        aria-labelledby="headingConfig"
        data-parent="#accordionSidebar"
      >
        <div className="bg-white py-2 collapse-inner rounded">{children}</div>
      </div>
    </li>
  );
};

import React from "react";
import "./style.scss";

export const CardLogo = (props) => {
  const { titulo, disabled, onClick, "data-testid": testId } = props;
  return (
    <div
      onClick={onClick}
      className={`card card-logo ${disabled ? "disabled" : ""}`}
      data-testid={testId || `card-logo-${titulo}`}
    >
      <div className="card-body mt-4">
        <div className="icon-component">{props.children}</div>
        <div className="card-title">{titulo}</div>
      </div>
    </div>
  );
};

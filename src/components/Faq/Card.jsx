import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { string } from "prop-types";
import { ToggleExpandir } from "../Shareable/ToggleExpandir";
import "./style.scss";

const Card = ({ question, answer }) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggle = () => {
    setCollapsed((currentValue) => !currentValue);
  };

  return (
    <div className="card faq-card">
      <div className="card-border" aria-hidden="true" />

      <div className="container-fluid faq-card-content">
        <div className="row align-items-center g-0">
          <div className="col card-title">{question}</div>

          <div className="col-auto toggle-expand">
            <ToggleExpandir onClick={handleToggle} ativo={!collapsed} />
          </div>
        </div>

        <Collapse isOpened={!collapsed}>
          <div className="card-body">{answer}</div>
        </Collapse>
      </div>
    </div>
  );
};

Card.propTypes = {
  question: string.isRequired,
  answer: string.isRequired,
};

export default Card;

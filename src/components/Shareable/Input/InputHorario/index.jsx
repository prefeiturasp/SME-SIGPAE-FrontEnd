import React from "react";
import { TimePicker } from "antd";
import { InputErroMensagem } from "../InputErroMensagem";
import { HelpText } from "../../../Shareable/HelpText";
import "antd/dist/antd.css";
import moment from "moment";
import "./style.scss";

export const InputHorario = props => {
  const {
    input: { onChange, onBlur }
  } = props;
  const { hora, disabled, nameEmpty, size, className, helpText, meta } = props;
  return (
    <div className={`input-horario ${className}`}>
      <TimePicker
        defaultValue={moment(hora, "HH:mm:ss")}
        defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
        size={size}
        placeholder={nameEmpty}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      />
      <HelpText helpText={helpText} />
      <InputErroMensagem meta={meta} />
    </div>
  );
};

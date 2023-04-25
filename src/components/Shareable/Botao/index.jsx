import PropTypes from "prop-types";
import React, { useState } from "react";
import { BUTTON_STYLE, BUTTON_TYPE } from "./constants";
import { Tooltip } from "antd";
import "./style.scss";

export const Botao = props => {
  const {
    accept,
    className,
    disabled,
    icon,
    iconPosition,
    iconId,
    onClick,
    style,
    titulo,
    texto,
    type,
    exibirTooltip,
    tooltipTitulo,
    classTooltip,
    tooltipExterno,
    tabindex
  } = props;
  const [exibeMensagem, setExibeMensagem] = useState(false);
  return (
    <button
      type={type}
      title={titulo}
      data-cy={texto}
      className={`general-button ${style} ${className}`}
      onClick={onClick}
      onMouseOver={() => setExibeMensagem(true)}
      onMouseOut={() => setExibeMensagem(false)}
      disabled={disabled}
      accept={accept}
      tabIndex={tabindex}
    >
      {iconPosition !== "right" && icon && (
        <i id={iconId} className={`${icon} ${texto && "text-and-icon-left"}`} />
      )}
      <Tooltip
        open={exibeMensagem && tooltipExterno}
        title={tooltipExterno ? tooltipExterno : ""}
      >
        {texto}
      </Tooltip>
      {iconPosition === "right" && icon && (
        <i
          id={iconId}
          className={`${icon} ${texto && "text-and-icon-right"}`}
        />
      )}
      {exibirTooltip && (
        <Tooltip open={exibeMensagem} title={tooltipTitulo}>
          <i className={`fas fa-info ${classTooltip}`} />
        </Tooltip>
      )}
    </button>
  );
};

Botao.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  iconPosition: PropTypes.string,
  iconId: PropTypes.string,
  style: PropTypes.string,
  texto: PropTypes.string,
  titulo: PropTypes.string,
  type: PropTypes.string,
  exibirTooltip: PropTypes.bool,
  tooltipTitulo: PropTypes.string,
  classTooltip: PropTypes.string
};

Botao.defaultProps = {
  className: "",
  disabled: false,
  style: BUTTON_STYLE.GREEN,
  texto: "",
  titulo: "",
  type: BUTTON_TYPE.BUTTON,
  exibirTooltip: false,
  tooltipTitulo: "",
  classTooltip: ""
};

export default Botao;

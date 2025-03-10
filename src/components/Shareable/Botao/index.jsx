import PropTypes from "prop-types";
import React, { useState } from "react";
import { Tooltip } from "antd";
import "./style.scss";

export const Botao = (props) => {
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
    tabindex,
    dataTestId,
  } = props;

  const [exibeMensagem, setExibeMensagem] = useState(false);

  return (
    <button
      type={type}
      title={titulo}
      data-cy={texto}
      data-testid={dataTestId}
      className={`general-button ${style} ${className}`}
      onClick={onClick}
      onMouseOver={() =>
        (tooltipExterno || exibirTooltip) && setExibeMensagem(true)
      }
      onMouseOut={() =>
        (tooltipExterno || exibirTooltip) && setExibeMensagem(false)
      }
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
  classTooltip: PropTypes.string,
  dataTestId: PropTypes.string,
};

export default Botao;

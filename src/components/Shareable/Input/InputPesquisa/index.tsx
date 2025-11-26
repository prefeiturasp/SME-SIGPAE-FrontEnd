import React from "react";
import "./style.scss";

interface InputPesquisaProps {
  valor: string;
  onChange: (_: string) => void;
  placeholder?: string;
  className?: string;
}

export const InputPesquisa: React.FC<InputPesquisaProps> = ({
  valor,
  onChange,
  placeholder = "Pesquisar",
  className = "",
}) => (
  <div className={`container-input-pesquisa ${className}`}>
    <input
      type="text"
      className="input-pesquisa"
      placeholder={placeholder}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
    <i className="fas fa-search icone-pesquisa" />
  </div>
);

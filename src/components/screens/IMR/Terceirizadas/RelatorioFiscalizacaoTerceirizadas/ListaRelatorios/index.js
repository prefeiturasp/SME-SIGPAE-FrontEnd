import { jsx as _jsx } from "react/jsx-runtime";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
  SUPERVISAO,
  TERCEIRIZADAS,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
export const ListaRelatorios = () => {
  const navigate = useNavigate();
  return _jsx("div", {
    className: "lista-relatorios-fiscalizacao-terceirizadas",
    children: _jsx("div", {
      className: "card mt-3",
      children: _jsx("div", {
        className: "card-body",
        children: _jsx(Botao, {
          texto: "Cadastrar Novo Relat\u00F3rio de Fiscaliza\u00E7\u00E3o",
          type: BUTTON_TYPE.BUTTON,
          onClick: () =>
            navigate(
              `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO}`
            ),
          style: BUTTON_STYLE.GREEN,
          className: "ms-3",
        }),
      }),
    }),
  });
};

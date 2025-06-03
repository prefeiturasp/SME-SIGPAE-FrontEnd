import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Switch } from "antd";
export const CamposEditalContrato = ({ editalContrato }) => {
  return _jsxs(_Fragment, {
    children: [
      _jsxs("div", {
        className: "row mb-2",
        children: [
          _jsx("div", {
            className: "col-2 title",
            children: "Edital com IMR?",
          }),
          _jsxs("div", {
            className: "col-10 switch-imr-disabled",
            children: [
              !editalContrato.eh_imr &&
                _jsx("div", { className: "imr-nao", children: "N\u00E3o" }),
              _jsx(Switch, {
                size: "small",
                disabled: true,
                checked: editalContrato.eh_imr,
              }),
              editalContrato.eh_imr &&
                _jsx("div", { className: "imr-sim", children: "Sim" }),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-2 title",
            children: "Objeto resumido:",
          }),
          _jsx("div", { className: "col-10", children: editalContrato.objeto }),
        ],
      }),
      editalContrato.contratos.map((contrato, indexContrato) => {
        return _jsxs(
          "div",
          {
            children: [
              _jsx("div", {
                className: "row pt-3",
                children: _jsx("div", {
                  className: "col-12",
                  children: _jsx("div", {
                    className: "label",
                    children: _jsx("span", {
                      className: "com-linha",
                      children: "Contratos Relacionados",
                    }),
                  }),
                }),
              }),
              _jsxs("div", {
                className: "row pt-2",
                children: [
                  _jsxs("div", {
                    className: "col-6 d-flex",
                    children: [
                      _jsx("div", {
                        className: "title pe-2",
                        children: "Contrato n\u00BA:",
                      }),
                      contrato.numero,
                    ],
                  }),
                  _jsx("div", {
                    className: "col-6",
                    children: contrato.vigencias.map(
                      (vigencia, indexVigencia) => {
                        return _jsxs(
                          "div",
                          {
                            children: [
                              indexVigencia === 0 &&
                                _jsx("span", {
                                  className: "title pe-2",
                                  children: "Vig\u00EAncia:",
                                }),
                              _jsxs("span", {
                                className: `${
                                  indexVigencia ===
                                  contrato.vigencias.length - 1
                                    ? vigencia.status
                                    : ""
                                }`,
                                style: {
                                  paddingLeft: `${
                                    indexVigencia > 0 ? "4.7em" : 0
                                  }`,
                                },
                                children: [
                                  vigencia.data_inicial,
                                  " at\u00E9 ",
                                  vigencia.data_final,
                                ],
                              }),
                            ],
                          },
                          indexVigencia
                        );
                      }
                    ),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "row pt-2",
                children: [
                  _jsxs("div", {
                    className: "col-6 d-flex",
                    children: [
                      _jsx("div", {
                        className: "title pe-2",
                        children: "Processo administrativo do contrato:",
                      }),
                      contrato.processo,
                    ],
                  }),
                  _jsxs("div", {
                    className: "col-6 d-flex",
                    children: [
                      _jsx("div", {
                        className: "title pe-2",
                        children: "Data da proposta:",
                      }),
                      contrato.data_proposta,
                    ],
                  }),
                ],
              }),
              _jsxs("div", {
                className: "row pt-2",
                children: [
                  _jsxs("div", {
                    className: "col-6",
                    children: [
                      _jsx("div", { className: "title", children: "Lotes:" }),
                      contrato.lotes.map((lote) => lote.nome).join(" | "),
                    ],
                  }),
                  _jsxs("div", {
                    className: "col-6",
                    children: [
                      _jsx("div", { className: "title", children: "DREs:" }),
                      contrato.diretorias_regionais.map((dre, indexDRE) => {
                        return _jsx("div", { children: dre.nome }, indexDRE);
                      }),
                    ],
                  }),
                ],
              }),
              _jsx("div", {
                className: "row pt-2",
                children: _jsxs("div", {
                  className: "col-12",
                  children: [
                    _jsx("div", { className: "title", children: "Empresa:" }),
                    contrato.terceirizada.nome_fantasia,
                  ],
                }),
              }),
            ],
          },
          indexContrato
        );
      }),
    ],
  });
};

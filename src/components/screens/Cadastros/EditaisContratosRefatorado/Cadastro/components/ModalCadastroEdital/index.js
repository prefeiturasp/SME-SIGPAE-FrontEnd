import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { Modal } from "react-bootstrap";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "../../style.scss";
export const ModalCadastroEdital = ({
  showModal,
  closeModal,
  submitting,
  values,
  onSubmit,
  lotes,
  DREs,
  empresas,
}) => {
  return _jsxs(Modal, {
    dialogClassName: " modal-90w",
    show: showModal,
    onHide: closeModal,
    children: [
      _jsx(Modal.Header, {
        closeButton: true,
        children: _jsx(Modal.Title, {
          className: "modal-cadastro-edital",
          children: "Deseja Cadastrar um novo contrato?",
        }),
      }),
      _jsx(Modal.Body, {
        children: _jsxs("section", {
          children: [
            _jsxs("article", {
              className: "modal-cadastro-edital",
              children: [
                _jsx("header", { children: "Resumo" }),
                _jsxs("div", {
                  className: "detalhes",
                  children: [
                    _jsxs("div", {
                      children: [
                        _jsx("span", {
                          children: "Tipo de contrata\u00E7\u00E3o:",
                        }),
                        " ",
                        values.tipo_contratacao,
                      ],
                    }),
                    _jsxs("div", {
                      children: [
                        _jsx("span", { children: "N\u00BA do edital:" }),
                        " ",
                        values.numero,
                      ],
                    }),
                    _jsxs("div", {
                      children: [
                        _jsx("span", {
                          children: "Processo administrativo do contrato:",
                        }),
                        " ",
                        values.processo,
                      ],
                    }),
                    _jsxs("div", {
                      children: [
                        _jsx("span", { children: "Objeto resumido:" }),
                        " ",
                        values.objeto,
                      ],
                    }),
                  ],
                }),
              ],
            }),
            _jsx("hr", {}),
            _jsxs("article", {
              className: "modal-cadastro-edital",
              children: [
                _jsx("header", {
                  className: "pb-3",
                  children: "Contratos relacionados",
                }),
                values.contratos.map((contrato, key) => {
                  return _jsxs(
                    Fragment,
                    {
                      children: [
                        _jsx("section", {
                          children: _jsxs("div", {
                            className: "detalhes",
                            children: [
                              _jsxs("div", {
                                children: [
                                  _jsx("span", {
                                    children: "Contrato n\u00B0:",
                                  }),
                                  " ",
                                  contrato.numero,
                                ],
                              }),
                              _jsxs("div", {
                                className: "vigencias",
                                children: [
                                  _jsx("span", { children: "Vig\u00EAncia: " }),
                                  _jsx("div", {
                                    className: "iteracao-elementos",
                                    children: contrato.vigencias?.map(
                                      (vigencia, key) => {
                                        return _jsxs(
                                          "div",
                                          {
                                            className: "elementos",
                                            children: [
                                              "De ",
                                              vigencia?.data_inicial,
                                              " at\u00E9",
                                              " ",
                                              vigencia?.data_final,
                                              ";",
                                            ],
                                          },
                                          key
                                        );
                                      }
                                    ),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                children: [
                                  _jsx("span", {
                                    children:
                                      "Processo administrativo do contrato:",
                                  }),
                                  " ",
                                  contrato.processo,
                                ],
                              }),
                              _jsxs("div", {
                                children: [
                                  _jsx("span", {
                                    children: "Data da proposta:",
                                  }),
                                  " ",
                                  contrato.data_proposta,
                                ],
                              }),
                              _jsxs("div", {
                                className: "iteracao-elementos",
                                children: [
                                  _jsx("span", { children: "Lote:" }),
                                  _jsx("div", {
                                    className: "iteracao-elementos",
                                    children: contrato.lotes?.map(
                                      (lote, key) => {
                                        return _jsxs(
                                          "div",
                                          {
                                            className: "elementos",
                                            children: [
                                              lotes.find(
                                                (lote_) => lote_.uuid === lote
                                              )?.nome,
                                              ";",
                                              " ",
                                            ],
                                          },
                                          key
                                        );
                                      }
                                    ),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "iteracao-elementos",
                                children: [
                                  _jsx("span", { children: "DRE:" }),
                                  _jsx("div", {
                                    className: "iteracao-elementos",
                                    children:
                                      contrato.diretorias_regionais?.map(
                                        (dre, key) => {
                                          return _jsxs(
                                            "div",
                                            {
                                              className: "elementos",
                                              children: [
                                                DREs.find(
                                                  (dre_) => dre_.uuid === dre
                                                )?.nome,
                                                ";",
                                                " ",
                                              ],
                                            },
                                            key
                                          );
                                        }
                                      ),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "iteracao-elementos",
                                children: [
                                  _jsx("span", { children: "Empresa: " }),
                                  _jsx("div", {
                                    className: "iteracao-elementos",
                                    children: empresas.find(
                                      (empresa) =>
                                        empresa.uuid === contrato.terceirizada
                                    )?.nome_fantasia,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        _jsx("hr", {}),
                      ],
                    },
                    key
                  );
                }),
              ],
            }),
          ],
        }),
      }),
      _jsxs(Modal.Footer, {
        children: [
          _jsx(Botao, {
            texto: "N\u00E3o",
            type: BUTTON_TYPE.BUTTON,
            onClick: closeModal,
            style: BUTTON_STYLE.GREEN_OUTLINE,
            className: "ms-3",
          }),
          _jsx(Botao, {
            texto: "Sim",
            type: BUTTON_TYPE.BUTTON,
            disabled: submitting,
            onClick: () => {
              onSubmit(values);
            },
            style: BUTTON_STYLE.GREEN,
            className: "ms-3",
          }),
        ],
      }),
    ],
  });
};

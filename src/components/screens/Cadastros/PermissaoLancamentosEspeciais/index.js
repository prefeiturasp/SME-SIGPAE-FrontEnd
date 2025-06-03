import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import Select from "src/components/Shareable/Select";
import { Paginacao } from "src/components/Shareable/Paginacao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  getEscolasComPermissoesLancamentosEspeciais,
  getPermissoesLancamentosEspeciais,
} from "src/services/medicaoInicial/permissaoLancamentosEspeciais.service";
import "./style.scss";
export const PermissaoLancamentosEspeciais = () => {
  const [erroAPI, setErroAPI] = useState("");
  const navigate = useNavigate();
  const [permissoes, setPermissoes] = useState([]);
  const [responsePermissoes, setResponsePermissoes] = useState();
  const [escolasComPermissoes, setEscolasComPermissoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const getPermissoesLancamentosEspeciaisAsync = async (
    page = null,
    values = null
  ) => {
    setLoading(true);
    const params = {
      page: page,
    };
    if (values?.escola) {
      params.escola__uuid = values.escola;
      setPaginaAtual(1);
    }
    const response = await getPermissoesLancamentosEspeciais(params);
    if (response.status === HTTP_STATUS.OK) {
      setResponsePermissoes(response);
      setPermissoes(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar Permissões de Lançamentos Especiais. Tente novamente mais tarde."
      );
    }
    setLoading(false);
  };
  const getEscolasComPermissoesLancamentosEspeciaisAsync = async () => {
    setLoading(true);
    const response = await getEscolasComPermissoesLancamentosEspeciais();
    if (response.status === HTTP_STATUS.OK) {
      setEscolasComPermissoes(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar Escolas com Permissões de Lançamentos Especiais. Tente novamente mais tarde."
      );
    }
    setLoading(false);
  };
  const onChangePage = async (page, form) => {
    setPaginaAtual(page);
    setLoading(true);
    form.reset();
    await getPermissoesLancamentosEspeciaisAsync(page);
    setLoading(false);
  };
  const handleClickEditar = (permissao) => {
    navigate(
      {
        pathname:
          "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais/editar-permissao-lancamento-especial",
        search: `uuid=${permissao.uuid}`,
      },
      {
        state: { permissao: permissao },
      }
    );
  };
  useEffect(() => {
    setPaginaAtual(1);
    getPermissoesLancamentosEspeciaisAsync();
    getEscolasComPermissoesLancamentosEspeciaisAsync();
  }, []);
  return _jsxs("div", {
    className: "card mt-3",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsx("div", {
        className: "card-body",
        children: _jsx(Spin, {
          tip: "Carregando...",
          spinning: loading,
          children:
            !erroAPI &&
            _jsx(Form, {
              onSubmit: () => {},
              children: ({ handleSubmit, form, values }) =>
                _jsxs("form", {
                  onSubmit: handleSubmit,
                  children: [
                    _jsx(Field, {
                      component: Select,
                      className: "mb-4",
                      options: [
                        { nome: "Selecione uma unidade educacional", uuid: "" },
                        ...escolasComPermissoes,
                      ],
                      name: "escola",
                      label: "Filtrar por Nome da Unidade",
                      naoDesabilitarPrimeiraOpcao: true,
                    }),
                    _jsxs("div", {
                      className: "d-flex justify-content-between",
                      children: [
                        _jsx(Link, {
                          to: "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais/nova-permissao-lancamento-especial",
                          style: { display: "contents" },
                          children: _jsx(Botao, {
                            texto: "Nova Permiss\u00E3o",
                            style: BUTTON_STYLE.GREEN,
                          }),
                        }),
                        _jsxs("div", {
                          children: [
                            _jsx(Botao, {
                              texto: "Limpar Filtro",
                              style: BUTTON_STYLE.GREEN_OUTLINE,
                              onClick: () => {
                                form.reset();
                                setPaginaAtual(1);
                                getPermissoesLancamentosEspeciaisAsync();
                              },
                            }),
                            _jsx(Botao, {
                              className: "ms-3",
                              texto: "Filtrar",
                              style: BUTTON_STYLE.GREEN,
                              onClick: () =>
                                getPermissoesLancamentosEspeciaisAsync(
                                  null,
                                  values
                                ),
                            }),
                          ],
                        }),
                      ],
                    }),
                    permissoes.length === 0 &&
                      !loading &&
                      _jsx("div", {
                        className: "pt-3",
                        children: "Nenhum resultado encontrado.",
                      }),
                    permissoes.length > 0 &&
                      _jsxs("div", {
                        className: "tabela-permissao-lancamentos-especiais",
                        children: [
                          _jsx("div", {
                            className: "titulo-tabela mt-5 mb-3",
                            children:
                              "Unidades com Permiss\u00E3o de Lan\u00E7amentos Especiais",
                          }),
                          _jsxs("table", {
                            className: "permissao-lancamentos-especiais",
                            children: [
                              _jsx("thead", {
                                children: _jsxs("tr", {
                                  className: "row",
                                  children: [
                                    _jsx("th", {
                                      className: "col-3",
                                      children: "Nome da UE",
                                    }),
                                    _jsx("th", {
                                      className: "col-1",
                                      children: "Per\u00EDodo",
                                    }),
                                    _jsx("th", {
                                      className: "col-4",
                                      children:
                                        "Permiss\u00F5es de Lan\u00E7amentos",
                                    }),
                                    _jsx("th", {
                                      className: "col-2",
                                      children:
                                        "\u00DAltima Atualiza\u00E7\u00E3o",
                                    }),
                                    _jsx("th", {
                                      className: "col-1",
                                      children: "Status",
                                    }),
                                    _jsx("th", { className: "col-1" }),
                                  ],
                                }),
                              }),
                              _jsx("tbody", {
                                children: permissoes.map((permissao, key) => {
                                  return _jsxs(
                                    "tr",
                                    {
                                      className: "row",
                                      children: [
                                        _jsx("td", {
                                          className: "col-3",
                                          children: _jsx("div", {
                                            children: permissao.escola.nome,
                                          }),
                                        }),
                                        _jsx("td", {
                                          className: "col-1",
                                          children: _jsx("div", {
                                            children:
                                              permissao.periodo_escolar.nome,
                                          }),
                                        }),
                                        _jsx("td", {
                                          className: "col-4",
                                          children: _jsx("div", {
                                            children:
                                              permissao.alimentacoes_lancamento_especial
                                                .map((ali) => ali.nome)
                                                .join(", "),
                                          }),
                                        }),
                                        _jsx("td", {
                                          className: "col-2",
                                          children: _jsx("div", {
                                            children: permissao.alterado_em,
                                          }),
                                        }),
                                        _jsx("td", {
                                          className: "col-1",
                                          children: _jsx("div", {
                                            children: permissao.ativo
                                              ? "Ativo"
                                              : "Inativo",
                                          }),
                                        }),
                                        _jsx("td", {
                                          className: "col-1 text-center",
                                          children: _jsx(Botao, {
                                            type: BUTTON_TYPE.BUTTON,
                                            style: `${BUTTON_STYLE.GREEN_OUTLINE} no-border`,
                                            icon: BUTTON_ICON.EDIT,
                                            onClick: () =>
                                              handleClickEditar(permissao),
                                          }),
                                        }),
                                      ],
                                    },
                                    key
                                  );
                                }),
                              }),
                            ],
                          }),
                          _jsx(Paginacao, {
                            onChange: (page) => onChangePage(page, form),
                            total: responsePermissoes.data.count,
                            pageSize: responsePermissoes.data.page_size,
                            current: paginaAtual,
                          }),
                        ],
                      }),
                  ],
                }),
            }),
        }),
      }),
    ],
  });
};

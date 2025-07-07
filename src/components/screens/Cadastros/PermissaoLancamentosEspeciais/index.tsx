import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import { FormApi } from "final-form";
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

import {
  EscolasComPermissoesLancamentosEspeciaisInterface,
  PermissaoLancamentosEspeciaisInterface,
} from "src/interfaces/medicao_inicial.interface";
import { ResponsePermissoesLancamentosEspeciaisInterface } from "src/interfaces/responses.interface";

import "./style.scss";

export const PermissaoLancamentosEspeciais = () => {
  const [erroAPI, setErroAPI] = useState("");
  const navigate = useNavigate();
  const [permissoes, setPermissoes] = useState<
    PermissaoLancamentosEspeciaisInterface[]
  >([]);
  const [responsePermissoes, setResponsePermissoes] =
    useState<ResponsePermissoesLancamentosEspeciaisInterface>();
  const [escolasComPermissoes, setEscolasComPermissoes] = useState<
    EscolasComPermissoesLancamentosEspeciaisInterface[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const getPermissoesLancamentosEspeciaisAsync = async (
    page: number = null,
    values: Record<string, any> = null
  ) => {
    setLoading(true);
    const params: { page?: number; escola__uuid?: string } = {
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

  const onChangePage = async (
    page: number,
    form: FormApi<Record<string, any>, Partial<Record<string, any>>>
  ) => {
    setPaginaAtual(page);
    setLoading(true);
    form.reset();

    await getPermissoesLancamentosEspeciaisAsync(page);
    setLoading(false);
  };

  const handleClickEditar = (
    permissao: PermissaoLancamentosEspeciaisInterface
  ) => {
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

  return (
    <div className="card mt-3">
      {erroAPI && <div>{erroAPI}</div>}
      <div className="card-body">
        <Spin tip="Carregando..." spinning={loading}>
          {!erroAPI && (
            <Form onSubmit={() => {}}>
              {({ handleSubmit, form, values }) => (
                <form onSubmit={handleSubmit}>
                  <Field
                    component={Select}
                    className="mb-4"
                    options={[
                      { nome: "Selecione uma unidade educacional", uuid: "" },
                      ...escolasComPermissoes,
                    ]}
                    name="escola"
                    label="Filtrar por Nome da Unidade"
                    naoDesabilitarPrimeiraOpcao
                  />
                  <div className="d-flex justify-content-between">
                    <Link
                      to={
                        "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais/nova-permissao-lancamento-especial"
                      }
                      style={{ display: "contents" }}
                    >
                      <Botao
                        texto="Nova Permissão"
                        style={BUTTON_STYLE.GREEN}
                      />
                    </Link>
                    <div>
                      <Botao
                        texto="Limpar Filtro"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        onClick={() => {
                          form.reset();
                          setPaginaAtual(1);
                          getPermissoesLancamentosEspeciaisAsync();
                        }}
                      />
                      <Botao
                        className="ms-3"
                        texto="Filtrar"
                        style={BUTTON_STYLE.GREEN}
                        onClick={() =>
                          getPermissoesLancamentosEspeciaisAsync(null, values)
                        }
                      />
                    </div>
                  </div>
                  {permissoes.length === 0 && !loading && (
                    <div className="pt-3">Nenhum resultado encontrado.</div>
                  )}
                  {permissoes.length > 0 && (
                    <div className="tabela-permissao-lancamentos-especiais">
                      <div className="titulo-tabela mt-5 mb-3">
                        Unidades com Permissão de Lançamentos Especiais
                      </div>
                      <table className="permissao-lancamentos-especiais">
                        <thead>
                          <tr className="row">
                            <th className="col-3">Nome da UE</th>
                            <th className="col-1">Período</th>
                            <th className="col-4">Permissões de Lançamentos</th>
                            <th className="col-2">Última Atualização</th>
                            <th className="col-1">Status</th>
                            <th className="col-1" />
                          </tr>
                        </thead>
                        <tbody>
                          {permissoes.map((permissao, key) => {
                            return (
                              <tr key={key} className="row">
                                <td className="col-3">
                                  <div>{permissao.escola.nome}</div>
                                </td>
                                <td className="col-1">
                                  <div>{permissao.periodo_escolar.nome}</div>
                                </td>
                                <td className="col-4">
                                  <div>
                                    {permissao.alimentacoes_lancamento_especial
                                      .map((ali) => ali.nome)
                                      .join(", ")}
                                  </div>
                                </td>
                                <td className="col-2">
                                  <div>{permissao.alterado_em}</div>
                                </td>
                                <td className="col-1">
                                  <div>
                                    {permissao.ativo ? "Ativo" : "Inativo"}
                                  </div>
                                </td>
                                <td className="col-1 text-center">
                                  <Botao
                                    type={BUTTON_TYPE.BUTTON}
                                    style={`${BUTTON_STYLE.GREEN_OUTLINE} no-border`}
                                    icon={BUTTON_ICON.EDIT}
                                    onClick={() => handleClickEditar(permissao)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <Paginacao
                        onChange={(page: number) => onChangePage(page, form)}
                        total={responsePermissoes.data.count}
                        pageSize={responsePermissoes.data.page_size}
                        current={paginaAtual}
                      />
                    </div>
                  )}
                </form>
              )}
            </Form>
          )}
        </Spin>
      </div>
    </div>
  );
};

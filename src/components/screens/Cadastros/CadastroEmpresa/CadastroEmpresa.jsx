import React, { useEffect } from "react";
import moment from "moment";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import Select from "components/Shareable/Select";
import { Link, useHistory } from "react-router-dom";
import { Botao } from "../../../Shareable/Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Shareable/Botao/constants";
import { DadosEmpresa } from "./components/Form/DadosEmpresa";
import { EnderecoEmpresa } from "./components/Form/EnderecoEmpresa";
import { UsuarioResponsavel } from "./components/Form/UsuarioResponsavel";
import { ContratosFormSet } from "./components/Form/ContratosFormSet";
import { ContatoFormSet } from "./components/Form/ContatoFormSet";
import { PERFIL } from "constants/shared";
import { formataJsonParaEnvio } from "./helper";
import {
  createTerceirizada,
  createNaoTerceirizada,
  getTerceirizadaUUID,
  updateNaoTerceirizada,
  updateTerceirizada
} from "services/terceirizada.service";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import { formatarCPFouCNPJ, getError } from "helpers/utilities";
import { AdministradorSistemaFormSet } from "./components/Form/AdministradorSistemaFormSet";
import { NutricionistaFormSet } from "./components/Form/NutricionistaFormSet";
import { LotesFormSet } from "./components/Form/LotesFormSet";
import { ModalCadastroEmpresa } from "./components/ModalCadastroEmpresa";

import "./style.scss";

const verificarUsuarioEhDistribuidor = () => {
  const tipoPerfil = localStorage.getItem("perfil");
  if (tipoPerfil === PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA) {
    return false;
  } else if (
    tipoPerfil === PERFIL.COORDENADOR_LOGISTICA ||
    tipoPerfil === PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA ||
    tipoPerfil === PERFIL.DILOG_CRONOGRAMA
  ) {
    return true;
  }
  return false;
};

export const CadastroEmpresa = () => {
  const history = useHistory();
  const [lotesSelecionados, setLotesSelecionados] = useState([]);
  const [initialValuesForm, setInitialValuesForm] = useState({
    data_cadastro: moment().format("DD/MM/YYYY"),
    cep: undefined,
    cnpj: undefined,
    nome_fantasia: undefined,
    razao_social: undefined,
    representante_legal: undefined,
    email_representante_legal: undefined,
    telefone_representante: undefined,
    bairro: undefined
  });
  const [carregando, setCarregando] = useState(false);
  const [ehDistribuidor, setEhDistribuidor] = useState(false);
  const [superUser, setSuperUser] = useState({
    email: null,
    nome: null,
    cpf: null,
    telefone: null,
    cargo: null
  });
  const [contatosPessoaEmpresaForm, setContatosPessoaEmpresaForm] = useState([
    "contatoPessoaEmpresa_0"
  ]);
  const [contatosEmpresaForm, setContatosEmpresaForm] = useState([
    "contatoEmpresa_0"
  ]);
  const [contatosTerceirizadaForm, setContatosTerceirizadaForm] = useState([
    "contatoTerceirizada_0"
  ]);
  const [contatosEmpresa, setContatosEmpresa] = useState([
    {
      telefone: null,
      email: ""
    }
  ]);
  const [contatosNutricionista, setContatosNutricionista] = useState([
    {
      vinculo_atual: null,
      telefone: null,
      responsavel: null,
      crn: null,
      email: null,
      super_admin_terceirizadas: false
    }
  ]);
  const [contratos, setContratos] = useState([
    {
      numero_processo: null,
      numero_contrato: null,
      vigencia_de: null,
      vigencia_ate: null
    }
  ]);
  const [terceirizada, setTerceirizada] = useState(undefined);
  const [uuid, setUuid] = useState(null);
  const [tituloModal, setTituloModal] = useState(
    "Confirma cadastro de Empresa?"
  );
  const [exibirModal, setExibirModal] = useState(false);
  const [contatosPessoaEmpresa, setContatosPessoaEmpresa] = useState([
    {
      nome: "",
      telefone: null,
      email: ""
    }
  ]);
  const atribuiContatosEmpresaForm = data => {
    const { contatos } = data;
    contatos
      .filter(contato => !contato.nome)
      .forEach((contato, indice) => {
        if (indice !== 0 && contatos.length > contatosEmpresaForm.length) {
          contatosEmpresaForm.push(`contatoEmpresa_${indice}`);
          contatosEmpresa.push({
            telefone: null,
            email: null
          });
        }
        setContatosEmpresaForm(contatosEmpresaForm);

        contatosEmpresa[indice]["email"] = contato.email;
        contatosEmpresa[indice]["telefone"] = contato.telefone;

        setContatosEmpresa(contatosEmpresa);

        data[`telefone_empresa_${indice}`] = contato.telefone;
        data[`email_empresa_${indice}`] = contato.email;
      });

    return data;
  };

  const atribuiContatosPessoaEmpresaForm = data => {
    const { contatos } = data;

    contatos
      .filter(contato => contato.nome)
      .forEach((contato, indice) => {
        if (
          indice !== 0 &&
          contatos.length > contatosPessoaEmpresaForm.length
        ) {
          contatosPessoaEmpresaForm.push(`contatoPessoaEmpresa_${indice}`);
          contatosPessoaEmpresa.push({
            telefone: null,
            email: null
          });
        }
        setContatosEmpresaForm(contatosPessoaEmpresaForm);

        contatosPessoaEmpresa[indice]["nome"] = contato.nome;
        contatosPessoaEmpresa[indice]["email"] = contato.email;
        contatosPessoaEmpresa[indice]["telefone"] = contato.telefone;
        setContatosEmpresa(contatosPessoaEmpresa);
        data[`nome_contato_${indice}`] = contato.nome;
        data[`telefone_contato_${indice}`] = contato.telefone;
        data[`email_contato_${indice}`] = contato.email;
      });
    return data;
  };

  const atribuiNutricionistaEmpresaForm = data => {
    const { contatos, nutricionistas } = data;
    const antigosUsuariosNutri = nutricionistas;
    if (antigosUsuariosNutri.length) {
      antigosUsuariosNutri.forEach((nutri, indice) => {
        if (
          indice !== 0 &&
          antigosUsuariosNutri.length > contatosNutricionista.length
        ) {
          contatosTerceirizadaForm.push(`contatoTerceirizada_${indice}`);
          contatosNutricionista.push({
            telefone: null,
            responsavel: null,
            crn: null,
            email: null
          });
        }
        contatosNutricionista[indice]["telefone"] =
          nutri.contatos.length === 0 ? null : nutri.contatos[0].telefone;
        contatosNutricionista[indice]["responsavel"] = nutri.nome;
        contatosNutricionista[indice]["crn"] = nutri.crn_numero;
        contatosNutricionista[indice]["vinculo_atual"] = nutri.vinculo_atual;
        contatosNutricionista[indice]["super_admin_terceirizadas"] =
          nutri.super_admin_terceirizadas;
        contatosNutricionista[indice]["email"] =
          nutri.contatos.length === 0 ? null : nutri.contatos[0].email;

        setContatosNutricionista(contatosNutricionista);
        data[`nutricionista_nome_${indice}`] = nutri.nome;
        data[`nutricionista_crn_${indice}`] = nutri.crn_numero;
        data[`telefone_terceirizada_${indice}`] =
          nutri.contatos.length === 0 ? null : nutri.contatos[0].telefone;
        data[`email_terceirizada_${indice}`] =
          nutri.contatos.length === 0 ? null : nutri.contatos[0].email;
      });
    } else {
      contatos
        .filter(contato => contato.eh_nutricionista)
        .forEach((nutri, indice) => {
          if (indice !== 0 && contatos.length > contatosNutricionista.length) {
            contatosTerceirizadaForm.push(`contatoTerceirizada_${indice}`);
            contatosNutricionista.push({
              telefone: null,
              responsavel: null,
              crn: null,
              email: null
            });
          }
          contatosNutricionista[indice]["telefone"] = nutri.telefone;
          contatosNutricionista[indice]["responsavel"] = nutri.nome;
          contatosNutricionista[indice]["crn"] = nutri.crn_numero;
          contatosNutricionista[indice]["vinculo_atual"] = nutri.vinculo_atual;
          contatosNutricionista[indice]["super_admin_terceirizadas"] =
            nutri.super_admin_terceirizadas;
          contatosNutricionista[indice]["email"] = nutri.email;

          setContatosNutricionista(contatosNutricionista);

          data[`nutricionista_nome_${indice}`] = nutri.nome;
          data[`nutricionista_crn_${indice}`] = nutri.crn_numero;
          data[`telefone_terceirizada_${indice}`] = nutri.telefone;
          data[`email_terceirizada_${indice}`] = nutri.email;
        });

      return data;
    }
  };

  const setaValoresForm = data => {
    const super_admin = data.super_admin;
    data.cnpj = formatarCPFouCNPJ(data.cnpj);
    data.numero_contrato = data.numero;
    data.email_representante_legal = data.representante_email;
    data.telefone_representante = data.representante_telefone;
    data.situacao = data.ativo;

    data.data_cadastro = moment(data.criado_em, "DD/MM/YYYY").format(
      "DD/MM/YYYY"
    );
    data = atribuiContatosPessoaEmpresaForm(data);
    data = atribuiContratosForm(data);
    data = atribuiContatosEmpresaForm(data);
    data = atribuiNutricionistaEmpresaForm(data);
    if (super_admin) {
      const super_admin_contato = data.super_admin.contatos.pop();

      data.superuser_nome = data.super_admin.nome
        ? data.super_admin.nome
        : undefined;
      data.superuser_cpf = data.super_admin.cpf;
      data.superuser_cargo = data.super_admin.cargo;
      data.superuser_telefone = super_admin_contato
        ? super_admin_contato.telefone
        : undefined;
      data.superuser_email = data.super_admin.email;
      setSuperUser({
        nome: data.superuser_nome,
        cpf: data.superuser_cpf,
        cargo: data.superuser_cargo,
        telefone: data.superuser_telefone,
        email: data.superuser_email
      });
    }
    setInitialValuesForm(data);
    setTerceirizada(data);
  };

  const atribuiContratosForm = data => {
    setContratos(data.contratos);
    data.contratos.forEach((contato, indice) => {
      data[`numero_contrato_${indice}`] = contato.numero;
      data[`numero_processo_${indice}`] = contato.processo;
      data[`vigencia_de_${indice}`] = contato.vigencias[0].data_inicial;
      data[`vigencia_ate_${indice}`] = contato.vigencias[0].data_final;
    });

    return data;
  };

  const abrirModal = () => {
    setExibirModal(true);
  };

  const fecharModal = () => {
    setExibirModal(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid) {
      setUuid(uuid);
      setCarregando(true);
      setTituloModal("Confirma atualização de Empresa?");
      getTerceirizadaUUID(uuid).then(response => {
        if (response.status !== HTTP_STATUS.NOT_FOUND) {
          let lotesNomesSelecionados = [];
          let lotesSelecionados = [];
          response.data.lotes.forEach(lote => {
            lotesNomesSelecionados.push(lote.nome);
            lotesSelecionados.push(lote.uuid);
          });
          setLotesSelecionados(lotesSelecionados);
        }
        setaValoresForm(response.data);
        setCarregando(false);
      });
    }
    setEhDistribuidor(verificarUsuarioEhDistribuidor());
  }, []);
  const onSubmit = async values => {
    const dados = {
      ehDistribuidor: ehDistribuidor,
      contatosPessoaEmpresa: contatosPessoaEmpresa,
      contratos: contratos,
      contatosEmpresa: contatosEmpresa,
      contatosNutricionista: contatosNutricionista,
      lotesSelecionados: lotesSelecionados,
      super_admin: superUser
    };
    const data = formataJsonParaEnvio(values, dados);
    if (uuid !== null) {
      if (!ehDistribuidor) {
        updateTerceirizada(uuid, data).then(response => {
          if (response.status === HTTP_STATUS.OK) {
            toastSuccess("Empresa atualizada com sucesso!");
            history.push("/configuracoes/cadastros/empresas-cadastradas");
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(
              `Erro ao atualizar cadastro de empresa: ${getError(
                response.data
              )}.`
            );
          } else {
            toastError(`Erro ao atualizar cadastro de empresa`);
          }
        });
      } else {
        updateNaoTerceirizada(uuid, data).then(response => {
          if (response.status === HTTP_STATUS.OK) {
            toastSuccess("Empresa atualizada com sucesso!");
            history.push("/configuracoes/cadastros/empresas-cadastradas");
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(
              `Erro ao atualizar cadastro de empresa: ${getError(
                response.data
              )}.`
            );
          } else {
            toastError(`Erro ao atualizar cadastro de empresa`);
          }
        });
      }
    } else {
      if (!ehDistribuidor) {
        createTerceirizada(data).then(response => {
          if (response.status === HTTP_STATUS.CREATED) {
            toastSuccess("Empresa cadastrada com sucesso!");
            history.push("/configuracoes/cadastros/empresas-cadastradas");
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(
              `Erro ao cadastrar empresa: ${getError(response.data)}.`
            );
          } else {
            toastError(`Erro ao cadastrar empresa`);
          }
        });
      } else {
        createNaoTerceirizada(data).then(response => {
          if (response.status === HTTP_STATUS.CREATED) {
            toastSuccess("Empresa cadastrada com sucesso!");
            history.push("/configuracoes/cadastros/empresas-cadastradas");
          } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
            toastError(
              `Erro ao cadastrar empresa: ${getError(response.data)}.`
            );
          } else {
            toastError(`Erro ao cadastrar empresa`);
          }
        });
      }
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="cadastro cadastro-empresa pt-3">
        <div className="card">
          <div>
            <div>
              {!carregando && (
                <Form
                  initialValues={initialValuesForm}
                  onSubmit={onSubmit}
                  render={({ handleSubmit, form, values }) => (
                    <form onSubmit={handleSubmit}>
                      <DadosEmpresa ehDistribuidor={ehDistribuidor} />
                      <EnderecoEmpresa
                        values={values}
                        ehDistribuidor={ehDistribuidor}
                        contatosEmpresaForm={contatosEmpresaForm}
                        setContatosEmpresaForm={setContatosEmpresaForm}
                        contatosEmpresa={contatosEmpresa}
                        setContatosEmpresa={setContatosEmpresa}
                      />
                      <AdministradorSistemaFormSet
                        ehDistribuidor={ehDistribuidor}
                        superUser={superUser}
                        setSuperUser={setSuperUser}
                      />
                      <UsuarioResponsavel ehDistribuidor={ehDistribuidor} />
                      <ContatoFormSet
                        ehDistribuidor={ehDistribuidor}
                        contatosPessoaEmpresaForm={contatosPessoaEmpresaForm}
                        setContatosPessoaEmpresaForm={
                          setContatosPessoaEmpresaForm
                        }
                        contatosPessoaEmpresa={contatosPessoaEmpresa}
                        setContatosPessoaEmpresa={setContatosPessoaEmpresa}
                      />
                      <NutricionistaFormSet
                        ehDistribuidor={ehDistribuidor}
                        contatosTerceirizadaForm={contatosTerceirizadaForm}
                        setContatosTerceirizadaForm={
                          setContatosTerceirizadaForm
                        }
                        contatosNutricionista={contatosNutricionista}
                        setContatosNutricionista={setContatosNutricionista}
                      />
                      <ContratosFormSet
                        ehDistribuidor={ehDistribuidor}
                        contratos={contratos}
                        setContratos={setContratos}
                        terceirizada={terceirizada}
                      />
                      <LotesFormSet
                        ehDistribuidor={ehDistribuidor}
                        lotesSelecionados={lotesSelecionados}
                        setLotesSelecionados={setLotesSelecionados}
                        terceirizada={terceirizada}
                      />
                      <ModalCadastroEmpresa
                        titulo={tituloModal}
                        values={values}
                        onSubmit={() => handleSubmit()}
                        closeModal={fecharModal}
                        showModal={exibirModal}
                      />
                      {/* Situação */}
                      {ehDistribuidor && (
                        <div className="card-body">
                          <div className="w-25">
                            <Field
                              component={Select}
                              label="Situação"
                              name="situacao"
                              required
                              options={[
                                {
                                  nome: "Selecione...",
                                  uuid: ""
                                },
                                {
                                  nome: "Ativo",
                                  uuid: true
                                },
                                {
                                  nome: "Inativo",
                                  uuid: false
                                }
                              ]}
                            />
                          </div>
                        </div>
                      )}
                      {/* /Situação */}
                      <div className="card-body">
                        <div className="row mt-5">
                          {uuid === null ? (
                            <div className="col-12 text-right">
                              <Botao
                                texto="Cancelar"
                                onClick={event => this.resetForm(event)}
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                              />
                              <Botao
                                texto={"Salvar"}
                                className="ml-3"
                                onClick={e => {
                                  e.preventDefault();
                                  abrirModal();
                                }}
                                type={BUTTON_TYPE.SUBMIT}
                                style={BUTTON_STYLE.GREEN}
                              />
                            </div>
                          ) : (
                            <div className="col-12 text-right">
                              <Link to="/configuracoes/cadastros/empresas-cadastradas">
                                <Botao
                                  texto="Cancelar"
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                />
                              </Link>
                              <Botao
                                texto={"Atualizar"}
                                onClick={e => {
                                  e.preventDefault();
                                  abrirModal();
                                }}
                                className="ml-3"
                                type={BUTTON_TYPE.SUBMIT}
                                style={BUTTON_STYLE.GREEN}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

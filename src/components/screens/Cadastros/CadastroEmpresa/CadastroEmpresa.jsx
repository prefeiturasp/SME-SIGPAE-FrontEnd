import React, { useEffect, useRef } from "react";
import moment from "moment";
import HTTP_STATUS from "http-status-codes";
import { Spin } from "antd";
import { useState } from "react";
import { Field, Form } from "react-final-form";
import Select from "src/components/Shareable/Select";
import { Link, useNavigate } from "react-router-dom";
import { Botao } from "../../../Shareable/Botao";
import { BUTTON_TYPE, BUTTON_STYLE } from "../../../Shareable/Botao/constants";
import { DadosEmpresa } from "./components/Form/DadosEmpresa";
import { EnderecoEmpresa } from "./components/Form/EnderecoEmpresa";
import { UsuarioResponsavel } from "./components/Form/UsuarioResponsavel";
import { ContratosFormSet } from "./components/Form/ContratosFormSet";
import { ContatoFormSet } from "./components/Form/ContatoFormSet";
import { PERFIL } from "src/constants/shared";
import { formataJsonParaEnvio } from "./helper";
import {
  createTerceirizada,
  createNaoTerceirizada,
  getTerceirizadaUUID,
  updateNaoTerceirizada,
  updateTerceirizada,
  obterNumeroContratosCadastrados,
} from "src/services/terceirizada.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { formatarCPFouCNPJ, getError } from "src/helpers/utilities";
import { AdministradorSistemaFormSet } from "./components/Form/AdministradorSistemaFormSet";
import { NutricionistaFormSet } from "./components/Form/NutricionistaFormSet";
import { LotesFormSet } from "./components/Form/LotesFormSet";
import { ModalCadastroEmpresa } from "./components/ModalCadastroEmpresa";

import "./style.scss";
import { getListaModalidades } from "../../../../services/terceirizada.service";
import { usuarioEhCODAEGestaoProduto } from "../../../../helpers/utilities";

const verificarUsuarioEhDistribuidor = () => {
  const tipoPerfil = localStorage.getItem("perfil");
  if (
    tipoPerfil === PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA ||
    tipoPerfil === PERFIL.DILOG_CRONOGRAMA ||
    tipoPerfil === PERFIL.ADMINISTRADOR_CONTRATOS ||
    usuarioEhCODAEGestaoProduto()
  ) {
    return true;
  }
  return false;
};

export const CadastroEmpresa = () => {
  const navigate = useNavigate();
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
    bairro: undefined,
  });
  const [carregando, setCarregando] = useState(true);
  const [ehDistribuidor, setEhDistribuidor] = useState(false);
  const [superUser, setSuperUser] = useState({
    email: null,
    nome: null,
    cpf: null,
    telefone: null,
    cargo: null,
  });
  const [contatosEmpresaForm, setContatosEmpresaForm] = useState([
    "contatoEmpresa_0",
  ]);
  const [contatosTerceirizadaForm, setContatosTerceirizadaForm] = useState([
    "contatoTerceirizada_0",
  ]);
  const [contatosEmpresa, setContatosEmpresa] = useState([
    {
      telefone: null,
      email: "",
    },
  ]);
  const [contatosNutricionista, setContatosNutricionista] = useState([
    {
      vinculo_atual: null,
      telefone: null,
      responsavel: null,
      crn: null,
      email: null,
      super_admin_terceirizadas: false,
    },
  ]);
  const [contratos, setContratos] = useState([
    {
      numero_processo: null,
      numero_contrato: null,
      modalidade: null,
      numero_ata: null,
      numero_pregao: null,
      numero_chamada_publica: null,
      vigencia_de: null,
      vigencia_ate: null,
      programa: null,
    },
  ]);
  const [terceirizada, setTerceirizada] = useState(undefined);
  const [uuid, setUuid] = useState(null);
  const [tituloModal, setTituloModal] = useState("Cadastro Empresa");
  const [exibirModal, setExibirModal] = useState(false);
  const [contatosPessoaEmpresa, setContatosPessoaEmpresa] = useState([
    {
      nome: "",
      telefone: null,
      email: "",
    },
  ]);
  const [optionsModalidade, setOptionsModalidade] = useState([]);

  const numerosContratosCadastrados = useRef([]);

  const atribuiContatosEmpresaForm = (data) => {
    const { contatos } = data;
    contatos
      .filter((contato) => !contato.nome)
      .forEach((contato, indice) => {
        if (indice !== 0 && contatos.length > contatosEmpresaForm.length) {
          contatosEmpresaForm.push(`contatoEmpresa_${indice}`);
          contatosEmpresa.push({
            telefone: null,
            email: null,
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

  const atribuiContatosPessoaEmpresaForm = (data) => {
    const { contatos } = data;

    contatos
      .filter((contato) => contato.nome)
      .forEach((contato, indice) => {
        if (indice !== 0 && contatos.length > contatosPessoaEmpresa.length) {
          contatosPessoaEmpresa.push({
            telefone: null,
            email: null,
          });
        }

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

  const atribuiNutricionistaEmpresaForm = (data) => {
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
            email: null,
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
      return data;
    } else {
      contatos
        .filter((contato) => contato.eh_nutricionista)
        .forEach((nutri, indice) => {
          if (indice !== 0 && contatos.length > contatosNutricionista.length) {
            contatosTerceirizadaForm.push(`contatoTerceirizada_${indice}`);
            contatosNutricionista.push({
              telefone: null,
              responsavel: null,
              crn: null,
              email: null,
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

  const setaValoresForm = (data) => {
    data.cnpj = formatarCPFouCNPJ(data.cnpj);
    data.numero_contrato = data.numero;
    data.email_representante_legal = data.representante_email;
    data.telefone_representante = data.representante_telefone;
    data.situacao = data.ativo;

    data.data_cadastro = moment(data.criado_em, "DD/MM/YYYY").format(
      "DD/MM/YYYY",
    );
    data = atribuiContatosPessoaEmpresaForm(data);
    data = atribuiContratosForm(data);
    data = atribuiContatosEmpresaForm(data);
    data = atribuiNutricionistaEmpresaForm(data);

    data.superuser_nome = data.responsavel_nome;
    data.superuser_cpf = data.responsavel_cpf;
    data.superuser_cargo = data.responsavel_cargo;
    data.superuser_telefone = data.responsavel_telefone;
    data.superuser_email = data.responsavel_email;
    setSuperUser({
      nome: data.superuser_nome,
      cpf: data.superuser_cpf,
      cargo: data.superuser_cargo,
      telefone: data.superuser_telefone,
      email: data.superuser_email,
    });

    setInitialValuesForm(data);
    setTerceirizada(data);
  };

  const atribuiContratosForm = (data) => {
    setContratos(data.contratos);
    data.contratos.forEach((contrato, indice) => {
      data[`numero_contrato_${indice}`] = contrato.numero;
      data[`numero_processo_${indice}`] = contrato.processo;
      data[`modalidade_${indice}`] = contrato.modalidade?.uuid;
      data[`numero_ata_${indice}`] = contrato.ata;
      data[`numero_pregao_${indice}`] = contrato.numero_pregao;
      data[`numero_chamada_publica_${indice}`] =
        contrato.numero_chamada_publica;
      data[`vigencia_de_${indice}`] = contrato.vigencias[0]?.data_inicial;
      data[`vigencia_ate_${indice}`] = contrato.vigencias[0]?.data_final;
      data[`programa_${indice}`] = contrato.programa;
    });

    return data;
  };

  const abrirModal = () => {
    setExibirModal(true);
  };

  const fecharModal = () => {
    setExibirModal(false);
  };

  const atualizarEmpresa = (uuid, dados, ehDistribuidor) => {
    const service = ehDistribuidor ? updateNaoTerceirizada : updateTerceirizada;

    service(uuid, dados).then((response) => {
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Empresa atualizada com sucesso!");
        navigate("/configuracoes/cadastros/empresas-cadastradas");
      } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
        toastError(
          `Erro ao atualizar cadastro de empresa: ${getError(response.data)}.`,
        );
      } else {
        toastError(`Erro ao atualizar cadastro de empresa`);
      }
    });
  };

  const cadastrarEmpresa = (dados, ehDistribuidor) => {
    const service = ehDistribuidor ? createNaoTerceirizada : createTerceirizada;

    service(dados).then((response) => {
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Empresa cadastrada com sucesso!");
        navigate("/configuracoes/cadastros/empresas-cadastradas");
      } else if (response.status === HTTP_STATUS.BAD_REQUEST) {
        toastError(`Erro ao cadastrar empresa: ${getError(response.data)}.`);
      } else {
        toastError(`Erro ao cadastrar empresa`);
      }
    });
  };

  const onSubmit = async (values) => {
    const dados = {
      ehDistribuidor: ehDistribuidor,
      contatosPessoaEmpresa: contatosPessoaEmpresa,
      contratos: contratos,
      contatosEmpresa: contatosEmpresa,
      contatosNutricionista: contatosNutricionista,
      lotesSelecionados: lotesSelecionados,
    };

    const data = formataJsonParaEnvio(values, dados);

    if (uuid !== null) {
      atualizarEmpresa(uuid, data, ehDistribuidor);
    } else {
      cadastrarEmpresa(data, ehDistribuidor);
    }
  };

  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (uuid) {
      setUuid(uuid);
      setTituloModal("Confirma atualização de Empresa?");

      const response = await getTerceirizadaUUID(uuid);

      if (response.status !== HTTP_STATUS.NOT_FOUND) {
        let lotesNomesSelecionados = [];
        let lotesSelecionados = [];

        response.data.lotes.forEach((lote) => {
          lotesNomesSelecionados.push(lote.nome);
          lotesSelecionados.push(lote.uuid);
        });

        setLotesSelecionados(lotesSelecionados);
        setaValoresForm(response.data);
      }
    }

    const response = await obterNumeroContratosCadastrados();
    numerosContratosCadastrados.current =
      response.data.numeros_contratos_cadastrados;

    const distribuidor = verificarUsuarioEhDistribuidor();

    if (distribuidor) {
      const modalidades = await getListaModalidades();
      const options = [
        {
          nome: "Selecione...",
          uuid: "",
        },
        ...modalidades.data.results,
      ];
      setOptionsModalidade(options);
    }

    setEhDistribuidor(distribuidor);

    setCarregando(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <Spin spinning={carregando}>
      <div className="cadastro cadastro-empresa pt-3">
        <div className="card">
          <div>
            <div>
              <Form
                initialValues={initialValuesForm}
                onSubmit={onSubmit}
                render={({
                  form,
                  handleSubmit,
                  values,
                  hasValidationErrors,
                  submitting,
                }) => (
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
                      values={values}
                      contatosPessoaEmpresa={contatosPessoaEmpresa}
                      setContatosPessoaEmpresa={setContatosPessoaEmpresa}
                    />
                    <NutricionistaFormSet
                      ehDistribuidor={ehDistribuidor}
                      contatosTerceirizadaForm={contatosTerceirizadaForm}
                      setContatosTerceirizadaForm={setContatosTerceirizadaForm}
                      contatosNutricionista={contatosNutricionista}
                      setContatosNutricionista={setContatosNutricionista}
                    />
                    <ContratosFormSet
                      ehDistribuidor={ehDistribuidor}
                      contratos={contratos}
                      setContratos={setContratos}
                      terceirizada={terceirizada}
                      values={values}
                      numerosContratosCadastrados={
                        numerosContratosCadastrados.current
                      }
                      form={form}
                      optionsModalidade={optionsModalidade}
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
                                uuid: "",
                              },
                              {
                                nome: "Ativo",
                                uuid: true,
                              },
                              {
                                nome: "Inativo",
                                uuid: false,
                              },
                            ]}
                          />
                        </div>
                      </div>
                    )}
                    {/* /Situação */}
                    <div className="card-body">
                      <div className="row mt-5">
                        {uuid === null ? (
                          <div className="col-12 text-end">
                            <Botao
                              texto="Cancelar"
                              onClick={() => form.restart()}
                              type={BUTTON_TYPE.BUTTON}
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                            />
                            <Botao
                              texto={"Salvar"}
                              className="ms-3"
                              onClick={(e) => {
                                e.preventDefault();
                                abrirModal();
                              }}
                              type={BUTTON_TYPE.SUBMIT}
                              style={BUTTON_STYLE.GREEN}
                              disabled={hasValidationErrors || submitting}
                            />
                          </div>
                        ) : (
                          <div className="col-12 text-end">
                            <Link to="/configuracoes/cadastros/empresas-cadastradas">
                              <Botao
                                texto="Cancelar"
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                              />
                            </Link>
                            <Botao
                              texto={"Atualizar"}
                              onClick={(e) => {
                                e.preventDefault();
                                abrirModal();
                              }}
                              className="ms-3"
                              type={BUTTON_TYPE.SUBMIT}
                              style={BUTTON_STYLE.GREEN}
                              disabled={hasValidationErrors || submitting}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};

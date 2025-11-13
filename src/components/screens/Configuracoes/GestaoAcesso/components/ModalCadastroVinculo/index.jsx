import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { Form, Field } from "react-final-form";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { Radio } from "antd";
import InputText from "src/components/Shareable/Input/InputText";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import {
  email,
  required,
  tamanhoCnpj,
  validaCPF,
  SMEPrefeituraEmail,
} from "src/helpers/fieldValidators";
import {
  composeValidators,
  formataCPFCensurado,
  formatarCPFouCNPJ,
  getError,
} from "src/helpers/utilities";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { getDadosUsuarioEOLCompleto } from "src/services/permissoes.service";
import { useEffect } from "react";
import {
  getSubdivisoesCodae,
  getVinculoEmpresa,
} from "src/services/vinculos.service";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import ModalExclusaoVinculo from "../ModalExclusaoVinculo";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { cnpjMask, cpfMask } from "src/constants/shared";
import InputErroMensagem from "src/components/Shareable/Input/InputErroMensagem";
import { getPerfisPorVisao } from "../../helper";

const ENTER = 13;

const campoObrigatorio = {
  touched: true,
  error: "Informação não localizada",
};

const ModalCadastroVinculo = ({
  show,
  toggleShow,
  listaPerfis,
  listaVisao,
  diretor_escola,
  onSubmit,
  vinculo,
  toggleExclusao,
  empresa,
  visaoUnica,
  codae,
  cogestor,
  ehUEParceira,
  master,
}) => {
  const [tipoUsuario, setTipoUsuario] = useState();
  const [subdivisoes, setSubdivisoes] = useState();
  const [showExclusao, setShowExclusao] = useState(false);
  const [valoresEdicao, setValoresEdicao] = useState();
  const [rfBuscado, setRfBuscado] = useState(false);
  const [desabilitaEmail, setDesabilitaEmail] = useState(true);

  const { meusDados } = useContext(MeusDadosContext);
  const handleClose = () => {
    setRfBuscado(false);
    setDesabilitaEmail(true);
    setTipoUsuario("");
    toggleShow(false, null);
  };

  const listaVisaoFiltrada = listaVisao.filter((elem) => {
    return elem.nome !== "Empresa";
  });

  const buscaSubdivisoes = async () => {
    const subdivisoes = await getSubdivisoesCodae();

    let options_subs = subdivisoes.results.map((sub) => ({
      uuid: sub.uuid,
      nome: sub.nome,
    }));
    const perfil = JSON.parse(localStorage.getItem("perfil"));

    const subdivisoes_restrita_por_perfil = {
      ADMINISTRADOR_GESTAO_PRODUTO: "CODAE - Gestão de Produtos",
      COORDENADOR_DIETA_ESPECIAL: "CODAE - Gestão Dieta Especial",
      COORDENADOR_GESTAO_PRODUTO: "CODAE - Gestão de Produtos",
      COORDENADOR_SUPERVISAO_NUTRICAO:
        "CODAE - Coordenador Supervisão de Nutrição",
    };

    if (perfil in subdivisoes_restrita_por_perfil) {
      options_subs = options_subs.filter(
        (option) => option.nome === subdivisoes_restrita_por_perfil[perfil],
      );
    }

    setSubdivisoes(options_subs);
  };

  const buscaEOL = async (form, values) => {
    let response = await getDadosUsuarioEOLCompleto(values.registro_funcional);

    if (response.status === 200) {
      const usuarioEOL = response.data;
      if (diretor_escola) {
        const codigo_eol_unidade =
          meusDados.vinculo_atual.instituicao.codigo_eol;
        if (codigo_eol_unidade !== usuarioEOL.codigo_eol_unidade) {
          return toastError("RF não pertence a sua unidade!");
        }
      }
      form.change(
        "nome_servidor",
        usuarioEOL.nome ? usuarioEOL.nome : undefined,
      );
      form.change(
        "cargo_servidor",
        usuarioEOL.cargo ? usuarioEOL.cargo : undefined,
      );
      form.change(
        "email_servidor",
        usuarioEOL.email ? usuarioEOL.email : setDesabilitaEmail(false),
      );
      form.change("cpf", usuarioEOL.cpf);
      form.change(
        "cpf_servidor",
        usuarioEOL.cpf ? formataCPFCensurado(usuarioEOL.cpf) : undefined,
      );
      form.change("codigo_eol_unidade", usuarioEOL.codigo_eol_unidade);
      form.change("nome_escola", usuarioEOL.nome_escola);

      let t = document.getElementById("inputRF");
      t.blur();
      t.focus();
      setRfBuscado(true);
    } else {
      if (values.registro_funcional) {
        toastError(getError(response.data));
      }
    }
  };

  const buscaEOLFuncionarioUnidadeParceira = async (values, form) => {
    let response = await getDadosUsuarioEOLCompleto(
      values.cpf_pesquisado.replace(/[^\w\s]/gi, ""),
    );

    if (response.status === 200) {
      const usuarioEOL = response.data;
      form.change(
        "nome_parceira",
        usuarioEOL.nome ? usuarioEOL.nome : undefined,
      );
      form.change(
        "cargo_parceira",
        usuarioEOL.cargo ? usuarioEOL.cargo : undefined,
      );
      form.change("cpf", usuarioEOL.cpf);
      form.change(
        "cpf_parceira",
        usuarioEOL.cpf ? formatarCPFouCNPJ(usuarioEOL.cpf) : undefined,
      );
      form.change("codigo_eol_unidade", usuarioEOL.codigo_eol_unidade);
      form.change("nome_escola", usuarioEOL.nome_escola);

      let t = document.getElementById("inputCPF");
      t.blur();
      t.focus();
      setRfBuscado(true);
    } else {
      if (values.cpf_pesquisado) {
        toastError(
          `API do EOL não retornou nada para o CPF ${values.cpf_pesquisado}`,
        );
      }
    }
  };

  const abreDeletar = () => {
    toggleExclusao(true, vinculo);
    toggleShow(false, vinculo);
  };

  const onKeyPress = (event, form, values) => {
    if (event.which === ENTER) {
      if (ehUEParceira) {
        buscaEOLFuncionarioUnidadeParceira(values, form);
      } else {
        buscaEOL(form, values);
      }
    }
  };

  const getVinculoEmpresaAsync = async () => {
    const response = await getVinculoEmpresa();
    if (response.cnpj) {
      let valueCnpj = {};
      valueCnpj.cnpj = formatarCPFouCNPJ(response.cnpj);
      setValoresEdicao(valueCnpj);
    } else {
      return toastError(response.erro);
    }
  };

  useEffect(() => {
    if (empresa) {
      const perfil = JSON.parse(localStorage.getItem("perfil"));
      if (perfil !== "ADMINISTRADOR_CONTRATOS") {
        getVinculoEmpresaAsync();
      }
    }
    buscaSubdivisoes();
    try {
      if (vinculo && show) {
        setTipoUsuario("NAO_SERVIDOR");
        let values = {};
        values.nome = vinculo.nome_usuario;
        values.email = vinculo.email_usuario;
        values.cpf = formatarCPFouCNPJ(vinculo.cpf_usuario);
        values.cnpj = formatarCPFouCNPJ(vinculo.cnpj_empresa);
        values.perfil = vinculo.nome_perfil;
        values.visao = vinculo.visao_perfil;
        setValoresEdicao(values);
      }
    } catch (error) {
      toggleShow(false, null);
      toastError("Ocorreu um erro ao carregar este usuário.", error);
    }
    if (empresa) {
      setTipoUsuario("NAO_SERVIDOR");
    } else if (diretor_escola && ehUEParceira) {
      setTipoUsuario("UNIDADE_PARCEIRA");
    } else if (diretor_escola || visaoUnica || cogestor || codae) {
      setTipoUsuario("SERVIDOR");
    }
  }, [
    vinculo,
    show,
    diretor_escola,
    empresa,
    toggleShow,
    visaoUnica,
    codae,
    ehUEParceira,
  ]);

  return (
    <>
      <ModalExclusaoVinculo show={showExclusao} setShow={setShowExclusao} />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        dialogClassName="modal-cadastro-vinculo"
      >
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Acesso</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={onSubmit}
          initialValues={valoresEdicao}
          render={({ form, handleSubmit, values, errors }) => (
            <>
              <Modal.Body>
                <form
                  onSubmit={handleSubmit}
                  className=""
                  onKeyPress={(event) => onKeyPress(event, form, values)}
                >
                  {diretor_escola ||
                    empresa ||
                    visaoUnica !== undefined ||
                    (!vinculo && !codae && (
                      <div className="row mx-0 my-1">
                        <span className="label-radio">
                          Selecione o tipo de usuário:
                        </span>
                        <Radio.Group
                          onChange={(event) =>
                            setTipoUsuario(event.target.value)
                          }
                          value={tipoUsuario}
                        >
                          <Radio className="" value={"SERVIDOR"}>
                            Servidor
                          </Radio>
                          <Radio className="" value={"NAO_SERVIDOR"}>
                            Não Servidor
                          </Radio>
                          {master && (
                            <Radio className="" value={"UNIDADE_PARCEIRA"}>
                              Unidade Parceira
                            </Radio>
                          )}
                        </Radio.Group>
                      </div>
                    ))}
                  {tipoUsuario === "SERVIDOR" && (
                    <>
                      <div className="row">
                        <div className="col-6">
                          <Field
                            component={InputText}
                            id="inputRF"
                            label="Pesquisar RF"
                            name="registro_funcional"
                            placeholder="Digite o RF do Servidor"
                            className="input-busca-produto"
                            validate={required}
                          />
                        </div>
                        <div className="col-1 ps-0">
                          <Botao
                            texto=""
                            icon="fas fa-search"
                            type={BUTTON_TYPE.BUTTON}
                            onClick={() =>
                              buscaEOL(form, form.getState().values)
                            }
                            style={BUTTON_STYLE.GREEN}
                            className="botao-rf"
                          />
                        </div>
                        <div className="col-5">
                          <Field
                            component={InputText}
                            label="UE"
                            name="nome_escola"
                            className="input-busca-produto"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-7">
                          <Field
                            component={InputText}
                            label="Nome do Usuário"
                            name="nome_servidor"
                            className="input-busca-produto"
                            disabled={true}
                            validate={required}
                            required
                          />
                          {rfBuscado && !values.nome_servidor && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                        <div className="col-5">
                          <Field
                            component={InputText}
                            label="Cargo"
                            name="cargo_servidor"
                            className="input-busca-produto"
                            disabled={true}
                            validate={required}
                            required
                          />
                          {rfBuscado && !values.cargo_servidor && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-7">
                          <Field
                            component={InputText}
                            label="E-mail"
                            name="email_servidor"
                            className="input-busca-produto"
                            disabled={desabilitaEmail}
                            validate={SMEPrefeituraEmail}
                            required
                          />
                          {rfBuscado && !values.email_servidor && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                        <div className="col-5">
                          <Field
                            component={InputText}
                            label="CPF"
                            name="cpf_servidor"
                            className="input-busca-produto"
                            disabled={true}
                            validate={required}
                            required
                          />
                          {rfBuscado && !values.cpf_servidor && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <Field
                            component={SelectSelecione}
                            label="Visão"
                            name="visao_servidor"
                            placeholder="Selecione a visão"
                            className="input-busca-produto"
                            required
                            options={listaVisaoFiltrada}
                            validate={required}
                            defaultValue={
                              visaoUnica || listaVisaoFiltrada[0].uuid
                            }
                            disabled={
                              visaoUnica || listaVisaoFiltrada.length === 1
                            }
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            component={SelectSelecione}
                            label="Perfil de Acesso"
                            name="perfil_servidor"
                            placeholder="Selecione o perfil de acesso"
                            className="input-busca-produto"
                            dataTestId="select-perfil-acesso"
                            required
                            options={
                              visaoUnica
                                ? listaPerfis
                                : getPerfisPorVisao(
                                    values.visao_servidor,
                                    listaPerfis,
                                  )
                            }
                            validate={required}
                            disabled={!values.visao_servidor}
                          />
                        </div>
                      </div>
                      {values.visao_servidor === "CODAE" && (
                        <div className="row">
                          <div className="col-6">
                            <Field
                              component={SelectSelecione}
                              label="Subdivisão"
                              name="subdivisao_servidor"
                              placeholder="Selecione a subdivisão"
                              className="input-busca-produto"
                              required
                              options={subdivisoes}
                              disabled={subdivisoes.length === 1}
                              defaultValue={
                                subdivisoes.length === 1
                                  ? subdivisoes[0].uuid
                                  : undefined
                              }
                              validate={required}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {tipoUsuario === "NAO_SERVIDOR" && (
                    <>
                      <div className="row">
                        <div className="col-7">
                          <Field
                            component={InputText}
                            label="Nome do Usuário"
                            name="nome"
                            placeholder="Digite o nome completo do usuário"
                            className="input-busca-produto"
                            validate={required}
                            required
                            disabled={valoresEdicao && !empresa}
                          />
                        </div>
                        <div className="col-5">
                          <Field
                            component={MaskedInputText}
                            mask={cpfMask}
                            label="CPF"
                            name="cpf"
                            placeholder="Digite o CPF do usuário"
                            className="input-busca-produto"
                            validate={composeValidators(required, validaCPF)}
                            required
                            disabled={valoresEdicao && !empresa}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-7">
                          <Field
                            component={InputText}
                            label="E-mail"
                            name="email"
                            placeholder="Digite o e-mail do Usuário"
                            className="input-busca-produto"
                            validate={email}
                            required
                          />
                        </div>
                        <div className="col-5">
                          <Field
                            mask={cnpjMask}
                            component={MaskedInputText}
                            label="CNPJ da Empresa"
                            name="cnpj"
                            placeholder="Digite o CNPJ da Empresa"
                            className="input-busca-produto"
                            validate={composeValidators(required, tamanhoCnpj)}
                            required
                            disabled={valoresEdicao}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <Field
                            component={SelectSelecione}
                            label="Visão"
                            name="visao"
                            placeholder="Selecione a visão"
                            className="input-busca-produto"
                            required
                            options={listaVisao}
                            validate={required}
                            defaultValue="EMPRESA"
                            disabled={true}
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            component={SelectSelecione}
                            label="Perfil de Acesso"
                            name="perfil"
                            dataTestId="select-perfil-acesso2"
                            placeholder="Selecione o perfil de acesso"
                            className="input-busca-produto"
                            required
                            options={
                              listaPerfis.some((perfil) => perfil.visao)
                                ? getPerfisPorVisao("EMPRESA", listaPerfis)
                                : listaPerfis
                            }
                            validate={required}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {tipoUsuario === "UNIDADE_PARCEIRA" && (
                    <>
                      <div className="row">
                        <div className="col-6">
                          <Field
                            component={MaskedInputText}
                            mask={cpfMask}
                            id="inputCPF"
                            label="Pesquisar CPF"
                            name="cpf_pesquisado"
                            placeholder="Digite o CPF"
                            className="input-busca-produto"
                            validate={composeValidators(required, validaCPF)}
                          />
                        </div>
                        <div className="col-1 ps-0">
                          <Botao
                            texto=""
                            icon="fas fa-search"
                            type={BUTTON_TYPE.BUTTON}
                            onClick={() =>
                              buscaEOLFuncionarioUnidadeParceira(values, form)
                            }
                            style={BUTTON_STYLE.GREEN}
                            className="botao-rf"
                          />
                        </div>
                        <div className="col-5">
                          <Field
                            component={InputText}
                            label="UE"
                            name="nome_escola"
                            className="input-busca-produto"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-7">
                          <Field
                            component={InputText}
                            label="Nome do Usuário"
                            name="nome_parceira"
                            className="input-busca-produto"
                            disabled={true}
                            validate={required}
                            required
                          />
                          {rfBuscado && !values.nome_parceira && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                        <div className="col-5">
                          <Field
                            component={InputText}
                            label="Cargo"
                            name="cargo_parceira"
                            className="input-busca-produto"
                            disabled={true}
                            validate={required}
                            required
                          />
                          {rfBuscado && !values.cargo_parceira && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-7">
                          <Field
                            component={InputText}
                            label="E-mail"
                            name="email_parceira"
                            className="input-busca-produto"
                            validate={email}
                            required
                          />
                        </div>
                        <div className="col-5">
                          <Field
                            component={InputText}
                            label="CPF"
                            name="cpf_parceira"
                            className="input-busca-produto"
                            disabled={true}
                            validate={required}
                            required
                          />
                          {rfBuscado && !values.cpf_parceira && (
                            <InputErroMensagem meta={campoObrigatorio} />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <Field
                            component={SelectSelecione}
                            label="Visão"
                            name="visao_parceira"
                            placeholder="Selecione a visão"
                            className="input-busca-produto"
                            required
                            options={listaVisao}
                            validate={required}
                            defaultValue={"ESCOLA"}
                            disabled={true}
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            component={SelectSelecione}
                            label="Perfil de Acesso"
                            name="perfil_parceira"
                            placeholder="Selecione o perfil de acesso"
                            className="input-busca-produto"
                            required
                            options={
                              visaoUnica
                                ? listaPerfis
                                : getPerfisPorVisao(
                                    values.visao_parceira,
                                    listaPerfis,
                                  )
                            }
                            validate={required}
                            disabled={!values.visao_parceira}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </Modal.Body>
              <Modal.Footer>
                <div className="w-100">
                  {vinculo && (
                    <Botao
                      texto="Remover"
                      type={BUTTON_TYPE.BUTTON}
                      onClick={() => abreDeletar()}
                      style={BUTTON_STYLE.RED_OUTLINE}
                      icon="fas fa-trash"
                      className="float-start"
                    />
                  )}
                  {tipoUsuario === "SERVIDOR" && (
                    <div className="float-start texto-rodape">
                      Para adicionar o acesso do usuário, é necessário que todas
                      as informações acima estejam preenchidas. Caso faltem
                      informações, entre em contato com o administrador da sua
                      Unidade.
                    </div>
                  )}

                  <Botao
                    texto="Salvar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => {
                      onSubmit(values, tipoUsuario, valoresEdicao);
                      setRfBuscado(false);
                      setDesabilitaEmail(true);
                      setTipoUsuario("");
                    }}
                    disabled={Object.keys(errors).length > 0}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3 float-end"
                  />
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={handleClose}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3 float-end"
                  />
                </div>
              </Modal.Footer>
            </>
          )}
        />
      </Modal>
    </>
  );
};

export default ModalCadastroVinculo;

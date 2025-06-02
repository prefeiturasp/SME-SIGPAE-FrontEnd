import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { Radio, Spin, Tooltip } from "antd";
import "./style.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import MaskedInputText from "src/components/Shareable/Input/MaskedInputText";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  alphaNumericAndSingleSpaceBetweenCharacters,
  cep,
  email,
  noSpaceStartOrEnd,
  required,
  tamanhoCnpjMascara,
} from "src/helpers/fieldValidators";
import {
  cadastraLaboratorio,
  editaLaboratorio,
  getLaboratorio,
  getListaLaboratorios,
} from "src/services/laboratorio.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  composeValidators,
  exibeError,
  formatarCEP,
  formatarCPFouCNPJ,
  formatarTelefone,
  removeCaracteresEspeciais,
} from "src/helpers/utilities";
import createDecorator from "final-form-calculate";
import { getEnderecoPorCEP } from "src/services/cep.service";
import { cepMask, cnpjMask, telefoneMask } from "src/constants/shared";

export default ({ naoEditavel = false }) => {
  const [carregando, setCarregando] = useState(true);
  const [showModalEnviar, setShowModalEnviar] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);

  const [contatos, setContatos] = useState([{}]);
  const [credenciado, setCredenciado] = useState(null);
  const [laboratorios, setLaboratorios] = useState(null);
  const [desabilitaEndereco, setDesabilitaEndereco] = useState(true);
  const [edicao, setEdicao] = useState(false);
  const [valoresIniciais, setValoresIniciais] = useState(true);
  const [uuidLaboratorio, setUuidLaboratorio] = useState(null);
  const [laboratorio, setLaboratorio] = useState({});
  const [contatosValues, setContatosValues] = useState({});

  const navigate = useNavigate();

  const getDadosLaboratorio = async () => {
    try {
      const responseLaboratorio = await getLaboratorio(uuidLaboratorio);
      if (responseLaboratorio.status === HTTP_STATUS.OK) {
        const laboratorioValues = {};
        const lab = responseLaboratorio.data;
        laboratorioValues["nome_laboratorio"] = lengthOrUnderfined(lab.nome);
        laboratorioValues["data_cadastro"] = lab.criado_em.slice(0, 10);
        laboratorioValues["cnpj"] = formatarCPFouCNPJ(
          lengthOrUnderfined(lab.cnpj)
        );
        laboratorioValues["cep"] = formatarCEP(lengthOrUnderfined(lab.cep));
        laboratorioValues["logradouro"] = lengthOrUnderfined(lab.logradouro);
        laboratorioValues["numero"] = lengthOrUnderfined(lab.numero);
        laboratorioValues["complemento"] = lengthOrUnderfined(lab.complemento);
        laboratorioValues["bairro"] = lengthOrUnderfined(lab.bairro);
        laboratorioValues["cidade"] = lengthOrUnderfined(lab.cidade);
        laboratorioValues["estado"] = lengthOrUnderfined(lab.estado);

        laboratorioValues["credenciado"] = lab.credenciado ? true : false;
        laboratorioValues["credenciado_literal"] = lab.credenciado
          ? "Sim"
          : "Não";
        setCredenciado(lab.credenciado ? true : false);

        setContatos(responseLaboratorio.data.contatos);
        const contatosValues = {};
        responseLaboratorio.data.contatos.forEach((contato, i) => {
          contatosValues[`nome_${i}`] = lengthOrUnderfined(contato.nome);
          contatosValues[`telefone_${i}`] = formatarTelefone(
            lengthOrUnderfined(contato.telefone)
          );
          contatosValues[`email_${i}`] = lengthOrUnderfined(contato.email);
        });
        setContatosValues(contatosValues);
        setLaboratorio(laboratorioValues);
      }
    } catch (e) {
      toastError("Ocorreu um erro ao carregar dados do laboratório");
    }
    setCarregando(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (uuid && valoresIniciais) {
      setUuidLaboratorio(uuid);
      setCarregando(true);
      setEdicao(true);
    } else {
      setCarregando(false);
    }

    const buscaListaLabs = async () => {
      const response = await getListaLaboratorios();
      setLaboratorios(response.data.results);
    };

    buscaListaLabs();
  }, [valoresIniciais]);

  if (valoresIniciais && edicao) {
    getDadosLaboratorio();
    setValoresIniciais(false);
  }

  const onSubmit = () => {
    setShowModalEnviar(true);
  };

  const salvarLaboratorio = async (values) => {
    setCarregando(true);
    let payload = montaPayload(values);

    try {
      let response = edicao
        ? await editaLaboratorio(payload, uuidLaboratorio)
        : await cadastraLaboratorio(payload);
      if (response.status === 201) {
        toastSuccess("Laboratório Cadastrado com sucesso!");
        setShowModalEnviar(false);
      } else if (response.status === 200) {
        toastSuccess("Edição do cadastro realizado com sucesso!");
        setShowModalEnviar(false);
      } else {
        toastError("Ocorreu um erro ao salvar o Laboratório");
      }
      setCarregando(false);
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar o Laboratório");
    }
    setCarregando(false);
  };

  const handleOnChangeCredenciado = (event, values) => {
    values.credenciado = event.target.value;
    setCredenciado(event.target.value);
  };

  const cepCalculator = createDecorator({
    field: "cep",
    updates: {
      dummy: (minimumValue, allValues) => buscaCEP(minimumValue, allValues),
    },
  });

  const buscaCEP = async (cep, values) => {
    if (cep.length === 9) {
      const response = await getEnderecoPorCEP(cep);
      if (response.status === HTTP_STATUS.OK && !response.data.erro) {
        const { data } = response;
        values.bairro = data.bairro;
        values.cidade = data.localidade;
        values.logradouro = data.logradouro;
        values.estado = data.uf;
        setDesabilitaEndereco(true);
      } else {
        setDesabilitaEndereco(false);
      }
    }
  };

  const montaPayload = (values) => {
    let payload = {};

    payload.nome = values.nome_laboratorio;
    payload.cnpj = removeCaracteresEspeciais(values.cnpj);
    payload.cep = removeCaracteresEspeciais(values.cep);
    payload.logradouro = values.logradouro;
    payload.numero = values.numero;
    payload.complemento = values.complemento;
    payload.bairro = values.bairro;
    payload.cidade = values.cidade;
    payload.estado = values.estado;
    payload.credenciado = credenciado;

    payload.contatos = contatos.map((contatos, index) => ({
      nome: values[`nome_${index}`],
      telefone: removeCaracteresEspeciais(values[`telefone_${index}`]),
      email: values[`email_${index}`],
    }));

    return payload;
  };

  const validaNomeLab = (value) => {
    if (
      laboratorios &&
      laboratorios.includes(value.toUpperCase()) &&
      (!edicao || laboratorio.nome_laboratorio !== value.toUpperCase())
    )
      return "Laboratório já cadastrado";
    else return undefined;
  };

  const lengthOrUnderfined = (value) => {
    let valor = value ? value.toString() : undefined;
    return valor && valor.length > 0 ? valor : undefined;
  };

  const renderizarCredenciamentoNaoEditavel = () => {
    return (
      <>
        <div className="col mb-5 mt-3">
          <Field
            component={InputText}
            label="Esse Laboratório está Credenciado?"
            name="credenciado_literal"
            className="input-busca-produto col-2"
            required
            disabled={naoEditavel}
          />
        </div>
      </>
    );
  };

  const renderizarCredenciamentoEditavel = (formValues) => {
    return (
      <>
        <div className="row pergunta-credenciado">
          <div className="texto-pergunta">
            Esse Laboratório está Credenciado?
          </div>
          <Radio.Group
            onChange={(event) => handleOnChangeCredenciado(event, formValues)}
            value={credenciado}
          >
            <Radio className="" value={true}>
              SIM
            </Radio>
            <Radio className="" value={false}>
              NÃO
            </Radio>
          </Radio.Group>
        </div>

        {credenciado === false && (
          <div className="texto-nao-credenciado">
            Por não estar credenciado em um órgão oficial este laboratório não
            poderá ser utilizado no cadastro de Laudos.
          </div>
        )}
        <div className="mt-4 mb-4">
          <Botao
            texto="Salvar"
            type={BUTTON_TYPE.SUBMIT}
            style={BUTTON_STYLE.GREEN}
            className="float-end ms-3"
          />
          <Botao
            texto="Cancelar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-end ms-3"
            onClick={() => {
              setShowModalCancelar(true);
            }}
          />
        </div>
        <Modal
          show={showModalCancelar}
          onHide={() => {
            setShowModalCancelar(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {`Cancelar ${edicao ? "Edição" : "Cadastro"} do Laboratório`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Deseja cancelar ${
            edicao ? "a edição d" : ""
          }o Cadastro?`}</Modal.Body>
          <Modal.Footer>
            <Botao
              texto="Não"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                setShowModalCancelar(false);
              }}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
            <Botao
              texto="Sim"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                setShowModalCancelar(false);
                edicao
                  ? navigate(
                      "/configuracoes/cadastros/laboratorios-cadastrados"
                    )
                  : navigate("/");
              }}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
            />
          </Modal.Footer>
        </Modal>
        <Modal
          show={showModalEnviar}
          onHide={() => {
            setShowModalEnviar(false);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{`Salvar ${
              edicao ? "Edição" : "Cadastro"
            } do Laboratório`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{`Confirma ${
            edicao ? "a edição d" : ""
          }o cadastro do Laboratório?`}</Modal.Body>
          <Modal.Footer>
            <Botao
              texto="Não"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                setShowModalEnviar(false);
                setCarregando(false);
              }}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              className="ms-3"
            />
            <Botao
              texto="Sim"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => {
                salvarLaboratorio(formValues);
              }}
              style={BUTTON_STYLE.GREEN}
              className="ms-3"
            />
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-laboratorio">
        <div className="card-body cadastro-laboratorio">
          <Form
            onSubmit={onSubmit}
            decorators={[cepCalculator]}
            initialValues={{
              data_cadastro: new Date().toLocaleDateString(),
              ...laboratorio,
              ...contatosValues,
            }}
            validate={(values) => {
              const errors = {};
              if (
                values.credenciado === undefined ||
                values.credenciado === null
              ) {
                errors.credenciado = "Campo obrigatório";
              }
              return errors;
            }}
            render={({ handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="mt-4 card-title green">
                  Dados do Laboratório
                </div>
                <div className="row mt-3">
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Nome do Laboratório"
                      name="nome_laboratorio"
                      className="input-busca-produto"
                      placeholder="Digite o Nome do Laboratório"
                      validate={composeValidators(
                        required,
                        validaNomeLab,
                        alphaNumericAndSingleSpaceBetweenCharacters,
                        noSpaceStartOrEnd
                      )}
                      toUppercaseActive
                      required
                      disabled={naoEditavel}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Data de Cadastro"
                      name="data_cadastro"
                      className="input-busca-produto"
                      required
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-5">
                    <Field
                      component={MaskedInputText}
                      mask={cnpjMask}
                      label="CNPJ do Laboratório"
                      name="cnpj"
                      className="input-busca-produto"
                      placeholder="Digite o CNPJ do Laboratório"
                      validate={composeValidators(required, tamanhoCnpjMascara)}
                      required
                      disabled={naoEditavel}
                    />
                  </div>
                </div>

                <hr />

                <div className="card-title green">Endereço do Laboratório</div>
                <div className="row mt-3">
                  <div className="col-4">
                    <Field
                      component={MaskedInputText}
                      mask={cepMask}
                      label="CEP"
                      name="cep"
                      className="input-busca-produto"
                      placeholder="Digite o CEP"
                      validate={composeValidators(required, cep)}
                      required
                      disabled={naoEditavel}
                    />
                  </div>
                  <div className="col-8">
                    <Field
                      component={InputText}
                      label="Logradouro"
                      name="logradouro"
                      className="input-busca-produto"
                      placeholder="Nome do Logradouro"
                      validate={required}
                      required
                      disabled={desabilitaEndereco || naoEditavel}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Número"
                      name="numero"
                      className="input-busca-produto"
                      placeholder="Digite o número"
                      validate={required}
                      required
                      disabled={naoEditavel}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Complemento"
                      name="complemento"
                      className="input-busca-produto"
                      disabled={naoEditavel}
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Bairro"
                      name="bairro"
                      className="input-busca-produto"
                      placeholder="Nome do Bairro"
                      validate={required}
                      required
                      disabled={desabilitaEndereco || naoEditavel}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Cidade"
                      name="cidade"
                      className="input-busca-produto"
                      placeholder="Nome da Cidade"
                      validate={required}
                      required
                      disabled={desabilitaEndereco || naoEditavel}
                    />
                  </div>
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Estado"
                      name="estado"
                      className="input-busca-produto"
                      placeholder="Nome do Estado"
                      validate={required}
                      required
                      disabled={desabilitaEndereco || naoEditavel}
                    />
                  </div>
                </div>

                <hr />

                <div className="card-title green">Contatos</div>
                {contatos.map((contato, index) => (
                  <div key={index} className="row">
                    <div className="col">
                      <Field
                        component={InputText}
                        label="Nome"
                        name={`nome_${index}`}
                        className="input-busca-produto"
                        placeholder="Nome do Contato"
                        validate={required}
                        required
                        disabled={naoEditavel}
                      />
                    </div>
                    <div className="col-3">
                      <Field
                        component={MaskedInputText}
                        mask={telefoneMask}
                        label="Telefone"
                        name={`telefone_${index}`}
                        className="input-busca-produto"
                        placeholder="(00) 0000-00000"
                        validate={required}
                        required
                        disabled={naoEditavel}
                      />
                    </div>
                    <div className="col">
                      <Field
                        component={InputText}
                        label="E-mail"
                        name={`email_${index}`}
                        className="input-busca-produto"
                        placeholder="Digite o E-mail do Contato"
                        validate={composeValidators(required, email)}
                        required
                        disabled={naoEditavel}
                      />
                    </div>
                    {naoEditavel === false && (
                      <div className={`col-1 mt-auto mb-1`}>
                        {index === 0 ? (
                          <Tooltip title="Adicionar Contato">
                            <span>
                              <Botao
                                texto="+"
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                onClick={() => {
                                  let newContatos = [...contatos, {}];
                                  setContatos(newContatos);
                                }}
                              />
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Remover Contato">
                            <span>
                              <Botao
                                icon="fas fa-trash"
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                onClick={() => {
                                  let contatosNovo = [...contatos];
                                  values[`nome_${index}`] = null;
                                  values[`telefone_${index}`] = null;
                                  values[`email_${index}`] = null;
                                  contatosNovo.splice(index, 1);
                                  setContatos(contatosNovo);
                                }}
                              />
                            </span>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <hr />

                <div className="card-title green">
                  Laboratórios Credenciados
                </div>
                <div className="texto-laboratorios">
                  <p className="fw-bold">Lembrete!</p>
                  <p className="">
                    Verifique se o laboratório está credenciado em órgãos
                    oficiais (Ministério da Saúde, Ministério da Agricultura,
                    Pecuária e Abastecimento, INMETRO, ANVISA, Universidades
                    Federais e Estaduais). Consulte nos links abaixo:
                  </p>
                  <ul>
                    <li>
                      <a
                        href="http://www.inmetro.gov.br/laboratorios/rble/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        INMETRO
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://app.powerbi.com/view?r=eyJrIjoiYWZhYzg4YmUtZDBmZS00MDU3LWI1MGMtN2Y5ODNhOGNiODJiIiwidCI6ImI2N2FmMjNmLWMzZjMtNGQzNS04MGM3LWI3MDg1ZjVlZGQ4MSJ9&pageName=ReportSection255cb87f555de69e1841"
                        target="_blank"
                        rel="noreferrer"
                      >
                        REBLAS
                      </a>
                    </li>
                  </ul>
                </div>

                {naoEditavel
                  ? renderizarCredenciamentoNaoEditavel()
                  : renderizarCredenciamentoEditavel(values)}
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";

import { required } from "src/helpers/fieldValidators";
import { Spin, Tooltip } from "antd";
import { CATEGORIA_OPTIONS, PROGRAMA_OPTIONS } from "../../constants";
import InputText from "src/components/Shareable/Input/InputText";

import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import Botao from "../../../../../Shareable/Botao";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import FormPereciveisENaoPereciveis from "./components/FormPereciveisENaoPereciveis";
import TabelaNutricional from "src/components/Shareable/TabelaNutricional";
import Select from "src/components/Shareable/Select";
import ModalCadastrarItemIndividual from "src/components/Shareable/ModalCadastrarItemIndividual";
import { ModalAssinaturaUsuario } from "src/components/Shareable/ModalAssinaturaUsuario";

import {
  ArquivoForm,
  FichaTecnicaDetalhada,
  OptionsGenerico,
} from "src/interfaces/pre_recebimento.interface";
import { TerceirizadaComEnderecoInterface } from "src/interfaces/terceirizada.interface";
import { InformacaoNutricional } from "src/interfaces/produto.interface";

import InfoAcondicionamentoPereciveis from "./components/InfoAcondicionamentoPereciveis";
import InfoAcondicionamentoNaoPereciveis from "./components/InfoAcondicionamentoNaoPereciveis";

import { FichaTecnicaPayload } from "../../interfaces";
import {
  assinarEnviarFichaTecnica,
  carregaListaCompletaInformacoesNutricionais,
  carregarDadosCadastrar,
  carregarFabricantes,
  carregarMarcas,
  carregarProdutos,
  carregarUnidadesMedida,
  cepCalculator,
  formataPayloadCadastroFichaTecnica,
  gerenciaModalCadastroExterno,
  salvarRascunho,
  validaAssinarEnviar,
  validaProximo,
  validaRascunho,
} from "../../helpers";

import "./styles.scss";
import FormProponente from "./components/FormProponente";
import StepsSigpae from "src/components/Shareable/StepsSigpae";
import FormFabricante from "./components/FormFabricante";

const ITENS_STEPS = [
  {
    title: "Identificação do Produto",
  },
  {
    title: "Informações Nutricionais",
  },
  {
    title: "Informações de Acondicionamento",
  },
];

export default () => {
  const { meusDados } = useContext(MeusDadosContext);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [produtosOptions, setProdutosOptions] = useState<OptionsGenerico[]>([]);
  const [marcasOptions, setMarcasOptions] = useState<OptionsGenerico[]>([]);
  const [fabricantesOptions, setFabricantesOptions] = useState<
    OptionsGenerico[]
  >([]);
  const [fabricantesCount, setFabricantesCount] = useState(1);
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState<
    OptionsGenerico[]
  >([]);
  const [proponente, setProponente] =
    useState<TerceirizadaComEnderecoInterface>(
      {} as TerceirizadaComEnderecoInterface,
    );
  const [desabilitaEndereco, setDesabilitaEndereco] = useState<Array<boolean>>([
    true,
    true,
  ]);
  const [collapse, setCollapse] = useState<CollapseControl>({});
  const [ficha, setFicha] = useState<FichaTecnicaDetalhada>(
    {} as FichaTecnicaDetalhada,
  );
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [stepAtual, setStepAtual] = useState(0);
  const listaCompletaInformacoesNutricionais = useRef<InformacaoNutricional[]>(
    [],
  );
  const listaInformacoesNutricionaisFichaTecnica = useRef<
    InformacaoNutricional[]
  >([]);
  const [showModalCadastro, setShowModalCadastro] = useState(false);
  const [showModalAssinatura, setShowModalAssinatura] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState("");
  const [arquivo, setArquivo] = useState<ArquivoForm[]>([]);

  const navigate = useNavigate();

  const atualizarDadosCarregados = async () => {
    setCarregando(true);
    await carregarProdutos(setProdutosOptions);
    await carregarMarcas(setMarcasOptions);
    await carregarFabricantes(setFabricantesOptions);
    setCarregando(false);
  };

  useEffect(() => {
    (async () => {
      await carregarProdutos(setProdutosOptions);
      await carregarMarcas(setMarcasOptions);
      await carregarFabricantes(setFabricantesOptions);
      await carregarUnidadesMedida(setUnidadesMedidaOptions);
      await carregaListaCompletaInformacoesNutricionais(
        listaCompletaInformacoesNutricionais,
      );
      await carregarDadosCadastrar(
        listaInformacoesNutricionaisFichaTecnica,
        meusDados,
        setFicha,
        setInitialValues,
        setArquivo,
        setProponente,
        setFabricantesCount,
        setCarregando,
      );
    })();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-ficha-tecnica">
        <div className="card-body cadastro-ficha-tecnica">
          <Form
            onSubmit={() => {}}
            initialValues={initialValues}
            decorators={[cepCalculator(setDesabilitaEndereco)]}
            render={({ form, handleSubmit, values, errors }) => (
              <form onSubmit={handleSubmit}>
                <StepsSigpae current={stepAtual} items={ITENS_STEPS} />

                <hr />

                {stepAtual === 0 && (
                  <>
                    <div className="subtitulo">Identificação do Produto</div>

                    <div className="row mt-4">
                      <div className="col-6">
                        <Field
                          component={AutoCompleteSelectField}
                          dataTestId={"produto"}
                          options={getListaFiltradaAutoCompleteSelect(
                            produtosOptions.map((e) => e.nome),
                            values["produto"],
                            true,
                          )}
                          label="Produto"
                          name={`produto`}
                          placeholder="Selecione um Produto"
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                          tooltipText={
                            "Caso não localize o produto no seletor, faça o cadastro no botão Cadastrar Produto."
                          }
                          onChange={(value) => {
                            if (form.getState().dirty) {
                              form.restart({ produto: value });
                            }
                          }}
                        />
                      </div>
                      <div className="col-2 cadastro-externo">
                        <Botao
                          dataTestId="btnCadastrarProduto"
                          texto="Cadastrar Produto"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="botao-cadastro-externo"
                          onClick={() =>
                            gerenciaModalCadastroExterno(
                              "PRODUTO",
                              setTipoCadastro,
                              setShowModalCadastro,
                            )
                          }
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={Select}
                          dataTestId={"categoria"}
                          naoDesabilitarPrimeiraOpcao
                          options={[
                            { nome: "Selecione uma Categoria", uuid: "" },
                            ...CATEGORIA_OPTIONS,
                          ]}
                          label="Categoria"
                          name={`categoria`}
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                        />
                      </div>
                      <div className="col-6">
                        <Field
                          component={Select}
                          dataTestId={"marca"}
                          naoDesabilitarPrimeiraOpcao
                          options={[
                            { nome: "Selecione uma Marca", uuid: "" },
                            ...marcasOptions,
                          ]}
                          label="Marca"
                          name={`marca`}
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                          tooltipText={
                            "Caso não localize a marca no seletor, faça o cadastro no botão Cadastrar Marca."
                          }
                        />
                      </div>
                      <div className="col-2 cadastro-externo">
                        <Botao
                          texto="Cadastrar Marca"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="botao-cadastro-externo"
                          onClick={() =>
                            gerenciaModalCadastroExterno(
                              "MARCA",
                              setTipoCadastro,
                              setShowModalCadastro,
                            )
                          }
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={InputText}
                          dataTestId={"pregao_chamada_publica"}
                          label="Nº do Pregão/Chamada Pública"
                          name={`pregao_chamada_publica`}
                          placeholder="Nº do Pregão/Chamada Pública"
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                          tooltipText={
                            "Deve ser informado o número do Edital do Pregão Eletrônico ou Chamada Pública referente ao Produto."
                          }
                        />
                      </div>
                      <div className="col-4">
                        <Field
                          component={Select}
                          dataTestId={"programa"}
                          naoDesabilitarPrimeiraOpcao
                          options={[
                            { nome: "Selecione um Programa", uuid: "" },
                            ...PROGRAMA_OPTIONS,
                          ]}
                          label="Para qual Programa o produto é destinado"
                          name={`programa`}
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                        />
                      </div>
                    </div>
                    <hr />

                    <Collapse
                      collapse={collapse}
                      setCollapse={setCollapse}
                      titulos={[
                        <span key={0}>
                          Empresa ou Organização{" "}
                          <span className="verde-escuro">Proponente</span>
                        </span>,
                        <span className="fw-bold" key={1}>
                          Empresa ou Organização{" "}
                          <span className="verde-escuro">
                            Fabricante, Envasador e/ou Distribuidor
                          </span>
                        </span>,
                        <span className="fw-bold" key={1}>
                          Detalhes do{" "}
                          <span className="verde-escuro">Produto</span>
                        </span>,
                      ]}
                      id="collapseFichaTecnica"
                    >
                      <section id="formProponente">
                        <FormProponente proponente={proponente} />
                      </section>

                      <section id="formFabricante">
                        <FormFabricante
                          fabricantesCount={fabricantesCount}
                          setFabricantesCount={setFabricantesCount}
                          fabricantesOptions={fabricantesOptions}
                          values={values}
                          desabilitaEndereco={desabilitaEndereco}
                          gerenciaModalCadastroExterno={() => {
                            gerenciaModalCadastroExterno(
                              "FABRICANTE",
                              setTipoCadastro,
                              setShowModalCadastro,
                            );
                          }}
                        />
                        {fabricantesCount === 1 && (
                          <div className="row mt-3">
                            <div className="col-12 d-flex justify-content-center">
                              <Tooltip
                                className="float-end"
                                title={
                                  "Adicione somente se os dados do Envasador/Distribuidor forem diferentes do Fabricante."
                                }
                              >
                                <div>
                                  <Botao
                                    texto="+ Adicionar Envasador/Distribuidor"
                                    type={BUTTON_TYPE.BUTTON}
                                    style={BUTTON_STYLE.GREEN_OUTLINE}
                                    onClick={() => setFabricantesCount(2)}
                                  />
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        )}
                      </section>

                      <section id="formProduto">
                        <FormPereciveisENaoPereciveis values={values} />
                      </section>
                    </Collapse>
                  </>
                )}

                {stepAtual === 1 && (
                  <>
                    <div className="subtitulo">Informações Nutricionais</div>

                    <div className="row">
                      <div className="col-3">
                        <Field
                          component={InputText}
                          label="Porção"
                          name={`porcao`}
                          placeholder="Quantidade Numérica"
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                        />
                      </div>
                      <div className="col-3" style={{ marginTop: "30px" }}>
                        <Field
                          component={Select}
                          label=""
                          dataTestId={"unidade_medida_porcao"}
                          naoDesabilitarPrimeiraOpcao
                          options={[
                            { nome: "Unidade de Medida", uuid: "" },
                            ...unidadesMedidaOptions,
                          ]}
                          name={`unidade_medida_porcao`}
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                        />
                      </div>
                      <div className="col-3">
                        <Field
                          component={InputText}
                          label="Unidade Caseira"
                          name={`valor_unidade_caseira`}
                          placeholder="Quantidade Numérica"
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                        />
                      </div>
                      <div className="col-3  my-2">
                        <Field
                          component={InputText}
                          label=""
                          name={`unidade_medida_caseira`}
                          placeholder="Unidade de Medida"
                          className="input-ficha-tecnica"
                          required
                          validate={required}
                          tooltipText={
                            "A unidade de medida caseira é a utilizada com utensílios, exemplo: colher de sopa, colher de chá, xícara, etc."
                          }
                        />
                      </div>
                    </div>

                    <div className="aviso-tabela mt-4">
                      <span className="red">IMPORTANTE:</span>{" "}
                      {`Os campos abaixo são de preenchimento obrigatório, caso não haja valores nutricionais informar o valor "0" nos campos.`}
                    </div>

                    <TabelaNutricional
                      values={values}
                      listaCompletaInformacoesNutricionais={
                        listaCompletaInformacoesNutricionais.current
                      }
                      informacoesNutricionaisCarregadas={
                        listaInformacoesNutricionaisFichaTecnica.current
                      }
                    />
                  </>
                )}

                {stepAtual === 2 &&
                  (values["categoria"] === "PERECIVEIS" ? (
                    <InfoAcondicionamentoPereciveis
                      collapse={collapse}
                      setCollapse={setCollapse}
                      unidadesMedidaOptions={unidadesMedidaOptions}
                      arquivo={arquivo}
                      setArquivo={setArquivo}
                    />
                  ) : (
                    <InfoAcondicionamentoNaoPereciveis
                      collapse={collapse}
                      setCollapse={setCollapse}
                      unidadesMedidaOptions={unidadesMedidaOptions}
                      arquivo={arquivo}
                      setArquivo={setArquivo}
                      values={values}
                    />
                  ))}

                <hr />

                {stepAtual === ITENS_STEPS.length - 1 && (
                  <div className="mt-4 mb-4">
                    <Tooltip
                      className="float-end"
                      title={
                        validaAssinarEnviar(
                          values as FichaTecnicaPayload,
                          errors,
                          arquivo,
                        )
                          ? "Há campos de preenchimento obrigatório sem informação."
                          : undefined
                      }
                    >
                      <div>
                        <Botao
                          texto="Assinar e Enviar"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                          onClick={() => setShowModalAssinatura(true)}
                          disabled={validaAssinarEnviar(
                            values as FichaTecnicaPayload,
                            errors,
                            arquivo,
                          )}
                        />
                      </div>
                    </Tooltip>
                  </div>
                )}

                {stepAtual < ITENS_STEPS.length - 1 && (
                  <div className="mt-4 mb-4">
                    <Tooltip
                      className="float-end"
                      title={
                        validaProximo(
                          values as FichaTecnicaPayload,
                          errors,
                          stepAtual,
                        )
                          ? "Há campos de preenchimento obrigatório sem informação."
                          : undefined
                      }
                    >
                      <div>
                        <Botao
                          texto="Próximo"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                          onClick={() => {
                            setStepAtual((stepAtual) => stepAtual + 1);
                            setCollapse({ 0: true });
                          }}
                          disabled={validaProximo(
                            values as FichaTecnicaPayload,
                            errors,
                            stepAtual,
                          )}
                        />
                      </div>
                    </Tooltip>
                  </div>
                )}

                <div className="mt-4 mb-4">
                  <Tooltip
                    className="float-end"
                    title={
                      validaRascunho(values as FichaTecnicaPayload)
                        ? "Há campos de preenchimento obrigatório sem informação na seção de Identificação do Produto."
                        : undefined
                    }
                  >
                    <div>
                      <Botao
                        texto="Salvar Rascunho"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="float-end ms-3"
                        onClick={() => {
                          const payload = formataPayloadCadastroFichaTecnica(
                            values,
                            proponente,
                            produtosOptions,
                            fabricantesOptions,
                            arquivo,
                            fabricantesCount,
                          );

                          salvarRascunho(
                            payload,
                            ficha,
                            setFicha,
                            setCarregando,
                          );
                        }}
                        disabled={validaRascunho(values as FichaTecnicaPayload)}
                      />
                    </div>
                  </Tooltip>
                </div>

                {stepAtual > 0 && (
                  <div className="mt-4 mb-4">
                    <Botao
                      texto="Anterior"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={() => {
                        setStepAtual((stepAtual) => stepAtual - 1);
                        setCollapse({});
                      }}
                    />
                  </div>
                )}
                <ModalCadastrarItemIndividual
                  closeModal={() => setShowModalCadastro(false)}
                  showModal={showModalCadastro}
                  atualizarDadosCarregados={() => atualizarDadosCarregados()}
                  tipoCadastro={tipoCadastro}
                  tipoCadastroVisualizacao={
                    tipoCadastro[0] + tipoCadastro.slice(1).toLowerCase()
                  }
                />

                <ModalAssinaturaUsuario
                  show={showModalAssinatura}
                  handleClose={() => setShowModalAssinatura(false)}
                  handleSim={(password: string) => {
                    const payload = formataPayloadCadastroFichaTecnica(
                      values,
                      proponente,
                      produtosOptions,
                      fabricantesOptions,
                      arquivo,
                      fabricantesCount,
                      password,
                    );

                    assinarEnviarFichaTecnica(
                      payload,
                      ficha,
                      setCarregando,
                      navigate,
                    );
                  }}
                  loading={carregando}
                  titulo="Assinar Ficha Técnica"
                  texto="Você confirma o preenchimento correto de todas as
                  informações solicitadas na ficha técnica?"
                  textoBotao="Sim, Assinar Ficha"
                />
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};

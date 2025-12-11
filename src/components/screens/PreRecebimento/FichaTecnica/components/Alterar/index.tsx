import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import Label from "src/components/Shareable/Label";
import { Spin, Tooltip } from "antd";
import InputText from "src/components/Shareable/Input/InputText";
import InputFile from "src/components/Shareable/Input/InputFile";
import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  ArquivoForm,
  FichaTecnicaDetalhadaComAnalise,
  OptionsGenerico,
} from "src/interfaces/pre_recebimento.interface";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import Select from "src/components/Shareable/Select";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
  inteiroOuDecimalPositivoOuNegativo,
} from "src/helpers/fieldValidators";

import FormPereciveisENaoPereciveis from "../Cadastrar/components/FormPereciveisENaoPereciveis";
import { InformacaoNutricional } from "src/interfaces/produto.interface";
import { TerceirizadaComEnderecoInterface } from "src/interfaces/terceirizada.interface";
import FormProponente from "../Cadastrar/components/FormProponente";
import TabelaNutricional from "src/components/Shareable/TabelaNutricional";
import CheckboxComBorda from "src/components/Shareable/CheckboxComBorda";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import { ModalAssinaturaUsuario } from "src/components/Shareable/ModalAssinaturaUsuario";
import ModalVoltar from "src/components/Shareable/Page/ModalVoltar";
import { PRE_RECEBIMENTO, FICHA_TECNICA } from "src/configs/constants";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

import { StateConferidosAnalise } from "../../interfaces";
import {
  assinarCorrigirFichaTecnica,
  carregaListaCompletaInformacoesNutricionais,
  carregarDadosCorrgir,
  carregarFabricantes,
  carregarUnidadesMedida,
  cepCalculator,
  formataPayloadCorrecaoFichaTecnica,
} from "../../helpers";

import "./styles.scss";
import FormFabricante from "../Cadastrar/components/FormFabricante";
import {
  inserirArquivoFichaAssinadaRT,
  removerArquivoFichaAssinadaRT,
} from "src/components/screens/PreRecebimento/FichaTecnica/helpers";

const idCollapse = "collapseAnalisarFichaTecnica";

export default () => {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState<boolean>(true);
  const [showModalAssinatura, setShowModalAssinatura] = useState(false);
  const [showModalVoltar, setShowModalVoltar] = useState<boolean>(false);
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState<
    OptionsGenerico[]
  >([]);
  const [fabricantesOptions, setFabricantesOptions] = useState<
    OptionsGenerico[]
  >([]);
  const [fabricantesCount, setFabricantesCount] = useState(1);
  const [desabilitaEndereco, setDesabilitaEndereco] = useState<Array<boolean>>([
    true,
    true,
  ]);
  const [collapse, setCollapse] = useState<CollapseControl>({});
  const [ficha, setFicha] = useState<FichaTecnicaDetalhadaComAnalise>(
    {} as FichaTecnicaDetalhadaComAnalise,
  );
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [conferidos, setConferidos] = useState<StateConferidosAnalise>({});
  const listaCompletaInformacoesNutricionais = useRef<InformacaoNutricional[]>(
    [],
  );
  const listaInformacoesNutricionaisFichaTecnica = useRef<
    InformacaoNutricional[]
  >([]);
  const [proponente, setProponente] =
    useState<TerceirizadaComEnderecoInterface>(
      {} as TerceirizadaComEnderecoInterface,
    );
  const [arquivo, setArquivo] = useState<ArquivoForm[]>([]);

  useEffect(() => {
    (async () => {
      await carregarUnidadesMedida(setUnidadesMedidaOptions);
      await carregaListaCompletaInformacoesNutricionais(
        listaCompletaInformacoesNutricionais,
      );
      await carregarFabricantes(setFabricantesOptions);
      await carregarDadosCorrgir(
        listaInformacoesNutricionaisFichaTecnica,
        setFicha,
        setInitialValues,
        setConferidos,
        setArquivo,
        setProponente,
        setFabricantesCount,
        setCarregando,
      );
    })();
  }, []);

  const obterCollapseConfigs = (ehPerecivel: Boolean) => [
    {
      titulo: <span className="verde-escuro">Proponente</span>,
    },
    {
      titulo: (
        <span className="verde-escuro">
          Fabricante e ou Envasador/Distribuidor
        </span>
      ),
      tag: true,
    },
    {
      titulo: <span className="verde-escuro">Detalhes do Produto</span>,
      tag: true,
    },
    {
      titulo: <span className="verde-escuro">Informações Nutricionais</span>,
      tag: true,
    },
    {
      titulo: <span className="verde-escuro">Conservação</span>,
      tag: true,
    },
    ...(ehPerecivel
      ? [
          {
            titulo: (
              <span className="verde-escuro">Temperatura e Transporte</span>
            ),
            tag: true,
          },
        ]
      : []),
    {
      titulo: <span className="verde-escuro">Armazenamento</span>,
      tag: true,
    },
    {
      titulo: <span className="verde-escuro">Embalagem e Rotulagem</span>,
      tag: true,
    },
    {
      titulo: (
        <span className="verde-escuro">Responsável Técnico e Anexos</span>
      ),
      tag: true,
    },
    {
      titulo: <span className="verde-escuro">Modo de Preparo</span>,
      tag: true,
    },
    {
      titulo: <span className="verde-escuro">Outras Informações</span>,
      tag: true,
    },
  ];

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-alterar-ficha-tecnica">
        <div className="card-body alterar-ficha-tecnica">
          <Form
            onSubmit={() => {}}
            initialValues={initialValues}
            decorators={[cepCalculator(setDesabilitaEndereco)]}
            render={({ handleSubmit, values, errors }) => {
              const ehPerecivel = values["categoria"] === "Perecíveis";
              const ehNaoPerecivel = values["categoria"] === "Não Perecíveis";

              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex-header">
                    <div className="subtitulo">
                      Ficha Técnica {ficha.numero}
                    </div>
                    <div className="status correcao">
                      <i className="fas fa-exclamation-triangle" />
                      Solicitada Alteração em {ficha.log_mais_recente}
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-8">
                      <Field
                        component={InputText}
                        label="Produto"
                        name={`produto`}
                        className="input-ficha-tecnica"
                        disabled
                        suffix={
                          ficha.programa === "LEVE_LEITE" ? (
                            <TagLeveLeite />
                          ) : null
                        }
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Categoria"
                        name={`categoria`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                    <div className="col-8">
                      <Field
                        component={InputText}
                        naoDesabilitarPrimeiraOpcao
                        label="Marca"
                        name={`marca`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputText}
                        label="Nº do Pregão/Chamada Pública"
                        name={`pregao_chamada_publica`}
                        className="input-ficha-tecnica"
                        disabled
                      />
                    </div>
                  </div>

                  <hr />

                  <Collapse
                    collapse={collapse}
                    setCollapse={setCollapse}
                    collapseConfigs={obterCollapseConfigs(ehPerecivel)}
                    id={idCollapse}
                    state={conferidos}
                  >
                    <section id="proponente">
                      <div className="row">
                        <div className="subtitulo">Proponente</div>
                      </div>
                      <FormProponente proponente={proponente} />
                    </section>

                    <section id="fabricante_envasador">
                      {!conferidos.fabricante_envasador && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.fabricante_envasador_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}
                      <FormFabricante
                        fabricantesCount={fabricantesCount}
                        setFabricantesCount={setFabricantesCount}
                        fabricantesOptions={fabricantesOptions}
                        desabilitaEndereco={desabilitaEndereco}
                        values={values}
                        somenteLeitura={conferidos.fabricante_envasador}
                        ocultarBotaoCadastroFabricante={true}
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

                    <section id="detalhes_produto">
                      {!conferidos.detalhes_produto && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.detalhes_produto_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                      <FormPereciveisENaoPereciveis
                        values={values}
                        desabilitar={conferidos.detalhes_produto}
                      />
                    </section>

                    <section id="informacoes_nutricionais">
                      {!conferidos.informacoes_nutricionais && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise
                                  ?.informacoes_nutricionais_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                      <div className="row">
                        <div className="col-6">
                          <Label content="Porção" required />
                        </div>
                        <div className="col-6">
                          <Label content="Unidade Caseira" required />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-3">
                          <Field
                            component={InputText}
                            name={`porcao`}
                            placeholder="Quantidade Numérica"
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.informacoes_nutricionais}
                          />
                        </div>
                        <div className="col-3">
                          <Field
                            component={Select}
                            naoDesabilitarPrimeiraOpcao
                            options={[
                              { nome: "Unidade de Medida", uuid: "" },
                              ...unidadesMedidaOptions,
                            ]}
                            name={`unidade_medida_porcao`}
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.informacoes_nutricionais}
                          />
                        </div>
                        <div className="col-3">
                          <Field
                            component={InputText}
                            name={`valor_unidade_caseira`}
                            placeholder="Quantidade Numérica"
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.informacoes_nutricionais}
                          />
                        </div>
                        <div className="col-3">
                          <Field
                            component={InputText}
                            name={`unidade_medida_caseira`}
                            placeholder="Unidade de Medida"
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.informacoes_nutricionais}
                          />
                        </div>
                      </div>
                      <TabelaNutricional
                        values={values}
                        listaCompletaInformacoesNutricionais={
                          listaCompletaInformacoesNutricionais.current
                        }
                        informacoesNutricionaisCarregadas={
                          listaInformacoesNutricionaisFichaTecnica.current
                        }
                        desabilitar={conferidos.informacoes_nutricionais}
                      />
                    </section>

                    <section id="conservacao">
                      {!conferidos.conservacao && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.conservacao_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                      {ehPerecivel && (
                        <div className="row">
                          <div className="col">
                            <Field
                              component={InputText}
                              label="Prazo de Validade após o descongelamento e mantido sob refrigeração:"
                              name={`prazo_validade_descongelamento`}
                              placeholder="Digite o prazo de validade"
                              className="input-ficha-tecnica"
                              required
                              validate={required}
                              disabled={conferidos.conservacao}
                            />
                          </div>
                        </div>
                      )}
                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Condições de conservação e Prazo máximo para consumo após a abertura da embalagem primária:"
                            name={`condicoes_de_conservacao`}
                            placeholder="Descreva as condições de conservação e o prazo máximo de consumo"
                            className="textarea-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.conservacao}
                          />
                        </div>
                      </div>
                    </section>

                    {ehPerecivel && (
                      <section id="temperatura_e_transporte">
                        {!conferidos.temperatura_e_transporte && (
                          <div className="row campo-correcao mb-4">
                            <div className="col-12">
                              <TextArea
                                label="Indicações de Correções CODAE"
                                valorInicial={
                                  ficha?.analise
                                    ?.temperatura_e_transporte_correcoes
                                }
                                disabled={true}
                              />
                            </div>
                          </div>
                        )}

                        <div className="row">
                          <div className="col-5">
                            <Field
                              component={InputText}
                              label="Temperatura de Congelamento do Produto:"
                              name={`temperatura_congelamento`}
                              placeholder="Digite a temperatura de congelamento"
                              className="input-ficha-tecnica"
                              tooltipText="No processo de fabricação"
                              required
                              validate={composeValidators(
                                required,
                                inteiroOuDecimalPositivoOuNegativo,
                              )}
                              disabled={conferidos.temperatura_e_transporte}
                            />
                          </div>
                          <div className="col-1 label-unidade-medida label-unidade-medida-bottom">
                            <span>ºC</span>
                          </div>
                          <div className="col-5">
                            <Field
                              component={InputText}
                              label="Temperatura Interna do Veículo para Transporte:"
                              name={`temperatura_veiculo`}
                              placeholder="Digite a temperatura de transporte"
                              className="input-ficha-tecnica"
                              required
                              validate={composeValidators(
                                required,
                                inteiroOuDecimalPositivoOuNegativo,
                              )}
                              disabled={conferidos.temperatura_e_transporte}
                            />
                          </div>
                          <div className="col-1 label-unidade-medida label-unidade-medida-bottom">
                            <span>ºC</span>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col">
                            <Field
                              component={TextArea}
                              label="Condições de Transporte:"
                              name={`condicoes_de_transporte`}
                              className="textarea-ficha-tecnica"
                              required
                              validate={required}
                              disabled={conferidos.temperatura_e_transporte}
                            />
                          </div>
                        </div>
                      </section>
                    )}

                    <section id="armazenamento">
                      {!conferidos.armazenamento && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.armazenamento_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                      <div className="row">
                        <div className="col">
                          Informações que constarão da rotulagem das embalagens
                          primária e secundária, fechadas.
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Embalagem Primária:"
                            name={`embalagem_primaria`}
                            className="textarea-ficha-tecnica"
                            placeholder="Digite as informações de armazenamento para embalagem primária"
                            required
                            validate={required}
                            disabled={conferidos.armazenamento}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Embalagem Secundária:"
                            name={`embalagem_secundaria`}
                            className="textarea-ficha-tecnica"
                            placeholder="Digite as informações de armazenamento para embalagem secundária"
                            required
                            validate={required}
                            disabled={conferidos.armazenamento}
                          />
                        </div>
                      </div>
                    </section>

                    <section id="embalagem_e_rotulagem">
                      {!conferidos.embalagem_e_rotulagem && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.embalagem_e_rotulagem_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}

                      <div className="row">
                        <div className="subtitulo">Embalagem</div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            name={`embalagens_de_acordo_com_anexo`}
                            component={CheckboxComBorda}
                            label="Declaro que as embalagens primária e secundária em que
                            serão entregues o produto estarão de acordo com as
                            especificações do Anexo I do Edital."
                            disabled
                          />
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Descreva o material de embalagem primária:"
                            name={`material_embalagem_primaria`}
                            className="textarea-ficha-tecnica"
                            placeholder="Digite as informações da embalagem primária"
                            required
                            validate={required}
                            disabled={conferidos.embalagem_e_rotulagem}
                          />
                        </div>
                      </div>

                      {ehNaoPerecivel && (
                        <div className="row mt-3">
                          <div className="col-6 px-0">
                            <div className="row">
                              <Label content="O produto é líquido?" disabled />
                            </div>

                            <div className="row">
                              <div className="col-2">
                                <label className="container-radio">
                                  Não
                                  <Field
                                    component="input"
                                    type="radio"
                                    value="0"
                                    name={`produto_eh_liquido`}
                                    validate={required}
                                    disabled={conferidos.embalagem_e_rotulagem}
                                  />
                                  <span className="checkmark" />
                                </label>
                              </div>
                              <div className="col-2">
                                <label className="container-radio">
                                  Sim
                                  <Field
                                    component="input"
                                    type="radio"
                                    value="1"
                                    name={`produto_eh_liquido`}
                                    validate={required}
                                    disabled={conferidos.embalagem_e_rotulagem}
                                  />
                                  <span className="checkmark" />
                                </label>
                              </div>
                            </div>
                          </div>

                          {values.produto_eh_liquido === "1" && (
                            <div className="col-6 px-0">
                              <div className="row">
                                <Label content="Volume do Produto na Embalagem Primária:" />
                              </div>
                              <div className="row">
                                <div className="col">
                                  <Field
                                    component={InputText}
                                    name={`volume_embalagem_primaria`}
                                    placeholder="Digite o Volume"
                                    className="input-ficha-tecnica"
                                    required
                                    validate={composeValidators(
                                      required,
                                      inteiroOuDecimalComVirgula,
                                    )}
                                    disabled={conferidos.embalagem_e_rotulagem}
                                  />
                                </div>

                                <div className="col">
                                  <Field
                                    component={Select}
                                    naoDesabilitarPrimeiraOpcao
                                    options={[
                                      { nome: "Unidade de Medida", uuid: "" },
                                      ...unidadesMedidaOptions,
                                    ]}
                                    name={`unidade_medida_volume_primaria`}
                                    className="input-ficha-tecnica"
                                    required
                                    validate={required}
                                    disabled={conferidos.embalagem_e_rotulagem}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="row mt-3">
                        <div className="row">
                          <div className="col-6">
                            <Label content="Peso Líquido do Produto na Embalagem Primária:" />
                          </div>

                          <div className="col-6">
                            <Label content="Peso Líquido do Produto na Embalagem Secundária:" />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-3">
                            <Field
                              component={InputText}
                              name={`peso_liquido_embalagem_primaria`}
                              placeholder="Digite o Peso"
                              className="input-ficha-tecnica"
                              required
                              validate={composeValidators(
                                required,
                                inteiroOuDecimalComVirgula,
                              )}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>

                          <div className="col-3">
                            <Field
                              component={Select}
                              naoDesabilitarPrimeiraOpcao
                              options={[
                                { nome: "Unidade de Medida", uuid: "" },
                                ...unidadesMedidaOptions,
                              ]}
                              name={`unidade_medida_primaria`}
                              className="input-ficha-tecnica"
                              required
                              validate={required}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>

                          <div className="col-3">
                            <Field
                              component={InputText}
                              name={`peso_liquido_embalagem_secundaria`}
                              placeholder="Digite o Peso"
                              className="input-ficha-tecnica"
                              required
                              validate={composeValidators(
                                required,
                                inteiroOuDecimalComVirgula,
                              )}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>

                          <div className="col-3">
                            <Field
                              component={Select}
                              naoDesabilitarPrimeiraOpcao
                              options={[
                                { nome: "Unidade de Medida", uuid: "" },
                                ...unidadesMedidaOptions,
                              ]}
                              name={`unidade_medida_secundaria`}
                              className="input-ficha-tecnica"
                              required
                              validate={required}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row mt-3">
                        <div className="row">
                          <div className="col-6">
                            <Label content="Peso da Embalagem Primária Vazia:" />
                          </div>

                          <div className="col-6">
                            <Label content="Peso da Embalagem Secundária Vazia:" />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-3">
                            <Field
                              component={InputText}
                              name={`peso_embalagem_primaria_vazia`}
                              placeholder="Digite o Peso"
                              className="input-ficha-tecnica"
                              required
                              validate={composeValidators(
                                required,
                                inteiroOuDecimalComVirgula,
                              )}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>

                          <div className="col-3">
                            <Field
                              component={Select}
                              naoDesabilitarPrimeiraOpcao
                              options={[
                                { nome: "Unidade de Medida", uuid: "" },
                                ...unidadesMedidaOptions,
                              ]}
                              name={`unidade_medida_primaria_vazia`}
                              className="input-ficha-tecnica"
                              required
                              validate={required}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>

                          <div className="col-3">
                            <Field
                              component={InputText}
                              name={`peso_embalagem_secundaria_vazia`}
                              placeholder="Digite o Peso"
                              className="input-ficha-tecnica"
                              required
                              validate={composeValidators(
                                required,
                                inteiroOuDecimalComVirgula,
                              )}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>

                          <div className="col-3">
                            <Field
                              component={Select}
                              naoDesabilitarPrimeiraOpcao
                              options={[
                                { nome: "Unidade de Medida", uuid: "" },
                                ...unidadesMedidaOptions,
                              ]}
                              name={`unidade_medida_secundaria_vazia`}
                              className="input-ficha-tecnica"
                              required
                              validate={required}
                              disabled={conferidos.embalagem_e_rotulagem}
                            />
                          </div>
                        </div>
                      </div>

                      {ehPerecivel && (
                        <div className="row mt-3">
                          <div className="row">
                            <div className="col-6">
                              <Label
                                content="Variação Porcentual do Peso do Produto ao Descongelar:"
                                disabled
                              />
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-2">
                              <Field
                                component={InputText}
                                name={`variacao_percentual`}
                                placeholder="Digite % do Peso"
                                className="input-ficha-tecnica"
                                required
                                validate={composeValidators(
                                  required,
                                  inteiroOuDecimalComVirgula,
                                )}
                                disabled={conferidos.embalagem_e_rotulagem}
                              />
                            </div>

                            <div className="col-1 label-unidade-medida label-unidade-medida-top">
                              <span>%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Descrever o Material e o Sistema de Vedação da Embalagem Secundária:"
                            name={`sistema_vedacao_embalagem_secundaria`}
                            className="textarea-ficha-tecnica"
                            placeholder="Digite as informações da embalagem secundária"
                            required
                            validate={required}
                            disabled={conferidos.embalagem_e_rotulagem}
                          />
                        </div>
                      </div>

                      <hr />

                      <div className="row">
                        <div className="subtitulo">Rotulagem</div>
                      </div>

                      <div className="row mt-3">
                        <div className="col">
                          <Field
                            name={`rotulo_legivel`}
                            component={CheckboxComBorda}
                            label="Declaro que no rótulo da embalagem primária e, se for o
                            caso, da secundária, constarão, de forma legível e indelével,
                            todas as informações solicitadas do Anexo I do Edital."
                            disabled
                          />
                        </div>
                      </div>
                    </section>

                    <section id="responsavel_tecnico">
                      {!conferidos.responsavel_tecnico && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.responsavel_tecnico_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col">
                          <Field
                            component={InputText}
                            label="Nome completo do Responsável Técnico:"
                            name={`nome_responsavel_tecnico`}
                            placeholder="Digite o nome completo"
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.responsavel_tecnico}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        <div className="col-6">
                          <Field
                            component={InputText}
                            label="Habilitação:"
                            name={`habilitacao`}
                            placeholder="Digite a habilitação"
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.responsavel_tecnico}
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            component={InputText}
                            label="Nº do Registro em Órgão Competente:"
                            name={`numero_registro_orgao`}
                            placeholder="Digite o número do registro"
                            className="input-ficha-tecnica"
                            required
                            validate={required}
                            disabled={conferidos.responsavel_tecnico}
                          />
                        </div>
                      </div>
                      <div className="row mt-3">
                        {conferidos.responsavel_tecnico ? (
                          <div className="col-4">
                            <BotaoAnexo urlAnexo={ficha.arquivo} />
                          </div>
                        ) : (
                          <div className="col-4">
                            <div className="row mt-3">
                              <Field
                                component={InputFile}
                                arquivosPreCarregados={arquivo}
                                className="inputfile"
                                dataTestId="arquivo"
                                texto="Anexar Ficha Assinada pelo RT"
                                name={"arquivo"}
                                accept="PDF"
                                setFiles={(files: ArquivoForm[]) =>
                                  inserirArquivoFichaAssinadaRT(
                                    files,
                                    setArquivo,
                                  )
                                }
                                removeFile={() =>
                                  removerArquivoFichaAssinadaRT(setArquivo)
                                }
                                toastSuccess={"Arquivo incluído com sucesso!"}
                                alignLeft
                              />
                              <label className="col-12 label-input">
                                <span className="red">
                                  * Campo Obrigatório: &nbsp;
                                </span>
                                Envie um arquivo no formato: PDF, com até 10MB
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    <section id="modo_preparo">
                      {!conferidos.modo_preparo && (
                        <div className="row campo-correcao mb-4">
                          <div className="col-12">
                            <TextArea
                              label="Indicações de Correções CODAE"
                              valorInicial={
                                ficha?.analise?.modo_preparo_correcoes
                              }
                              disabled={true}
                            />
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Descreva o modo de preparo do produto:"
                            name={`modo_de_preparo`}
                            className="textarea-ficha-tecnica"
                            disabled={conferidos.modo_preparo}
                          />
                        </div>
                      </div>
                    </section>

                    <section id="outras_informacoes">
                      <div className="row">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Informações Adicionais:"
                            name={`informacoes_adicionais`}
                            className="textarea-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                    </section>
                  </Collapse>

                  <div className="my-5">
                    <Botao
                      texto="Salvar e Enviar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      onClick={() => setShowModalAssinatura(true)}
                      disabled={Object.keys(errors).length !== 0}
                    />
                    <Botao
                      texto="Voltar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={() => {
                        setShowModalVoltar(true);
                      }}
                    />
                  </div>

                  <ModalAssinaturaUsuario
                    show={showModalAssinatura}
                    handleClose={() => setShowModalAssinatura(false)}
                    handleSim={(password: string) => {
                      const payload = formataPayloadCorrecaoFichaTecnica(
                        values,
                        conferidos,
                        proponente,
                        fabricantesOptions,
                        fabricantesCount,
                        arquivo,
                        ficha.categoria === "PERECIVEIS",
                        password,
                      );

                      assinarCorrigirFichaTecnica(
                        payload,
                        ficha,
                        setCarregando,
                        navigate,
                      );
                    }}
                    loading={carregando}
                    titulo="Salvar e Enviar as Alterações na Ficha Técnica"
                    texto={`Deseja Salvar e Enviar as alterações da Ficha Técnica ${ficha.numero}?`}
                    textoBotao="Sim"
                  />

                  <ModalVoltar
                    modalVoltar={showModalVoltar}
                    voltarPara={`/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`}
                    setModalVoltar={setShowModalVoltar}
                  />
                </form>
              );
            }}
          />
        </div>
      </div>
    </Spin>
  );
};

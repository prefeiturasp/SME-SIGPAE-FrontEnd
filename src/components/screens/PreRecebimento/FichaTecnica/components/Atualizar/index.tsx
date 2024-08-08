import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import Label from "components/Shareable/Label";
import { Spin } from "antd";
import InputText from "components/Shareable/Input/InputText";
import Collapse, { CollapseControl } from "components/Shareable/Collapse";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import {
  ArquivoForm,
  FichaTecnicaDetalhadaComAnalise,
  OptionsGenerico,
} from "interfaces/pre_recebimento.interface";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import Botao from "components/Shareable/Botao";
import Select from "components/Shareable/Select";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
  inteiroOuDecimalPositivoOuNegativo,
} from "helpers/fieldValidators";
import FormPereciveisENaoPereciveis from "../Cadastrar/components/FormPereciveisENaoPereciveis";
import { InformacaoNutricional } from "interfaces/produto.interface";
import { TerceirizadaComEnderecoInterface } from "interfaces/terceirizada.interface";
import FormProponente from "../Cadastrar/components/FormProponente";
import TabelaNutricional from "components/Shareable/TabelaNutricional";
import CheckboxComBorda from "components/Shareable/CheckboxComBorda";
import InputFile from "components/Shareable/Input/InputFile";
import { ModalAssinaturaUsuario } from "components/Shareable/ModalAssinaturaUsuario";
import ModalVoltar from "components/Shareable/Page/ModalVoltar";
import { PRE_RECEBIMENTO, FICHA_TECNICA } from "configs/constants";
import {
  carregarDadosAtualizar,
  formataPayloadAtualizacaoFichaTecnica,
  inserirArquivoFichaAssinadaRT,
  removerArquivoFichaAssinadaRT,
  atualizarAssinarFichaTecnica,
} from "components/screens/PreRecebimento/FichaTecnica/helpers";
import {
  carregaListaCompletaInformacoesNutricionais,
  carregarUnidadesMedida,
} from "../../helpers";

import "./styles.scss";

const idCollapse = "collapseAnalisarFichaTecnica";

export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [showModalAssinatura, setShowModalAssinatura] = useState(false);
  const [showModalVoltar, setShowModalVoltar] = useState<boolean>(false);
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState<
    OptionsGenerico[]
  >([]);
  const [collapse, setCollapse] = useState<CollapseControl>({});
  const [ficha, setFicha] = useState<FichaTecnicaDetalhadaComAnalise>(
    {} as FichaTecnicaDetalhadaComAnalise
  );
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const listaCompletaInformacoesNutricionais = useRef<InformacaoNutricional[]>(
    []
  );
  const listaInformacoesNutricionaisFichaTecnica = useRef<
    InformacaoNutricional[]
  >([]);
  const [proponente, setProponente] =
    useState<TerceirizadaComEnderecoInterface>(
      {} as TerceirizadaComEnderecoInterface
    );
  const [arquivo, setArquivo] = useState<ArquivoForm[]>([]);

  useEffect(() => {
    (async () => {
      await carregarUnidadesMedida(setUnidadesMedidaOptions);
      await carregaListaCompletaInformacoesNutricionais(
        listaCompletaInformacoesNutricionais
      );
      await carregarDadosAtualizar(
        listaInformacoesNutricionaisFichaTecnica,
        setFicha,
        setInitialValues,
        setArquivo,
        setProponente,
        setCarregando
      );
    })();
  }, []);

  const obterCollapseConfigs = (ehPerecivel: Boolean) => [
    {
      titulo: <span className="verde-escuro">Proponente e Fabricante</span>,
    },
    {
      titulo: <span className="verde-escuro">Detalhes do Produto</span>,
    },
    {
      titulo: <span className="verde-escuro">Informações Nutricionais</span>,
    },
    {
      titulo: <span className="verde-escuro">Conservação</span>,
    },
    ...(ehPerecivel
      ? [
          {
            titulo: (
              <span className="verde-escuro">Temperatura e Transporte</span>
            ),
          },
        ]
      : []),
    {
      titulo: <span className="verde-escuro">Armazenamento</span>,
    },
    {
      titulo: <span className="verde-escuro">Embalagem e Rotulagem</span>,
    },
    {
      titulo: (
        <span className="verde-escuro">Responsável Técnico e Anexos</span>
      ),
    },
    {
      titulo: <span className="verde-escuro">Modo de Preparo</span>,
    },
    {
      titulo: <span className="verde-escuro">Outras Informações</span>,
    },
  ];

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-atualizar-ficha-tecnica">
        <div className="card-body atualizar-ficha-tecnica">
          <Form
            onSubmit={() => {}}
            initialValues={initialValues}
            render={({ handleSubmit, values, errors }) => {
              const ehPerecivel = values["categoria"] === "Perecíveis";
              const ehNaoPerecivel = values["categoria"] === "Não Perecíveis";

              return (
                <form onSubmit={handleSubmit}>
                  <div className="flex-header">
                    <div className="subtitulo">
                      Ficha Técnica {ficha.numero}
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
                  >
                    <section id="proponenteFabricante">
                      <div className="row">
                        <div className="subtitulo">Proponente</div>
                      </div>
                      <FormProponente proponente={proponente} />

                      <hr />

                      <div className="row">
                        <div className="subtitulo">Fabricante</div>
                      </div>
                      <div className="row">
                        <div className="col-8">
                          <Field
                            component={InputText}
                            label="Nome da Empresa/Organização"
                            name={`fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <Field
                            component={InputText}
                            label="CNPJ"
                            name={`cnpj_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="CEP"
                            name={`cep_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                        <div className="col-8">
                          <Field
                            component={InputText}
                            label="Endereço"
                            name={`endereco_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="Número"
                            name={`numero_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="Complemento"
                            name={`complemento_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="Bairro"
                            name={`bairro_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8">
                          <Field
                            component={InputText}
                            label="Cidade"
                            name={`cidade_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="Estado"
                            name={`estado_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-8">
                          <Field
                            component={InputText}
                            label="E-mail"
                            name={`email_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                        <div className="col-4">
                          <Field
                            component={InputText}
                            label="Telefone"
                            name={`telefone_fabricante`}
                            className="input-ficha-tecnica"
                            disabled
                          />
                        </div>
                      </div>
                    </section>

                    <section id="detalhes_produto">
                      <FormPereciveisENaoPereciveis
                        values={values}
                        desabilitar={true}
                        atualizacao={true}
                      />
                    </section>

                    <section id="informacoes_nutricionais">
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
                            placeholder="Apenas Números"
                            className="input-ficha-tecnica"
                            required
                            proibeLetras
                            validate={composeValidators(
                              required,
                              inteiroOuDecimalComVirgula
                            )}
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
                          />
                        </div>
                        <div className="col-3">
                          <Field
                            component={InputText}
                            name={`valor_unidade_caseira`}
                            placeholder="Apenas Números"
                            className="input-ficha-tecnica"
                            required
                            proibeLetras
                            validate={composeValidators(
                              required,
                              inteiroOuDecimalComVirgula
                            )}
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
                      />
                    </section>

                    <section id="conservacao">
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
                              disabled={true}
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
                          />
                        </div>
                      </div>
                    </section>

                    {ehPerecivel && (
                      <section id="temperatura_e_transporte">
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
                                inteiroOuDecimalPositivoOuNegativo
                              )}
                              disabled={true}
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
                                inteiroOuDecimalPositivoOuNegativo
                              )}
                              disabled={true}
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
                              disabled={true}
                            />
                          </div>
                        </div>
                      </section>
                    )}

                    <section id="armazenamento">
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
                          />
                        </div>
                      </div>
                    </section>

                    <section id="embalagem_e_rotulagem">
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
                            disabled={true}
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
                                    disabled={true}
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
                                    disabled={true}
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
                                      inteiroOuDecimalComVirgula
                                    )}
                                    disabled={true}
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
                                    disabled={true}
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
                                inteiroOuDecimalComVirgula
                              )}
                              disabled={true}
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
                              disabled={true}
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
                                inteiroOuDecimalComVirgula
                              )}
                              disabled={true}
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
                              disabled={true}
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
                                inteiroOuDecimalComVirgula
                              )}
                              disabled={true}
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
                              disabled={true}
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
                                inteiroOuDecimalComVirgula
                              )}
                              disabled={true}
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
                              disabled={true}
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
                                  inteiroOuDecimalComVirgula
                                )}
                                disabled={true}
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
                            label="Descrever o Sistema de Vedação da Embalagem Secundária:"
                            name={`sistema_vedacao_embalagem_secundaria`}
                            className="textarea-ficha-tecnica"
                            placeholder="Digite as informações da embalagem secundária"
                            required
                            validate={required}
                            disabled={true}
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
                          />
                        </div>
                      </div>
                      {/* TODO: fazer o arquivo carregar */}
                      <div className="row mt-3">
                        <Field
                          component={InputFile}
                          arquivosPreCarregados={arquivo}
                          className="inputfile"
                          texto="Anexar Ficha Assinada pelo RT"
                          name={"arquivo"}
                          accept="PDF"
                          setFiles={(files: ArquivoForm[]) =>
                            inserirArquivoFichaAssinadaRT(files, setArquivo)
                          }
                          removeFile={() =>
                            removerArquivoFichaAssinadaRT(setArquivo)
                          }
                          toastSuccess={"Arquivo incluído com sucesso!"}
                          alignLeft
                        />
                      </div>
                    </section>

                    <section id="modo_preparo">
                      <div className="row">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Descreva o modo de preparo do produto:"
                            name={`modo_de_preparo`}
                            className="textarea-ficha-tecnica"
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
                      const payload = formataPayloadAtualizacaoFichaTecnica(
                        values,
                        initialValues,
                        arquivo[0],
                        password
                      );

                      atualizarAssinarFichaTecnica(
                        payload,
                        ficha,
                        setCarregando,
                        navigate
                      );
                    }}
                    loading={carregando}
                    titulo="Assinar Ficha Técnica"
                    texto={`Você confirma o preenchimento correto de todas as informações solicitadas na ficha técnica?`}
                    textoBotao="Sim, Assinar Ficha"
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

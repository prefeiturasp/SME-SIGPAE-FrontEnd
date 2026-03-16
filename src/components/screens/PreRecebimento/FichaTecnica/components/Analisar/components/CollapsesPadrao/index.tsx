import React from "react";
import { Field } from "react-final-form";
import Label from "src/components/Shareable/Label";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import TabelaNutricional from "src/components/Shareable/TabelaNutricional";
import CheckboxComBorda from "src/components/Shareable/CheckboxComBorda";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import FormAprovacao from "../FormAprovacao";
import BotaoCiente from "../BotaoCiente";
import FormProponente from "../../../Cadastrar/components/FormProponente";
import FormFabricante from "../../../Cadastrar/components/FormFabricante";
import FormPereciveisENaoPereciveis from "../../../Cadastrar/components/FormPereciveisENaoPereciveis";
import { FichaTecnicaDetalhadaComAnalise } from "src/interfaces/pre_recebimento.interface";
import { StateConferidosAnalise } from "../../../../interfaces";
import { TerceirizadaComEnderecoInterface } from "src/interfaces/terceirizada.interface";

interface CollapsesPadraoProps {
  idCollapse: string;
  collapse: CollapseControl;
  setCollapse: any;
  collapseConfigs: { [key: string]: {} }[];
  conferidos: StateConferidosAnalise;
  ficha: FichaTecnicaDetalhadaComAnalise;
  values: any;
  somenteLeitura: boolean;
  ehPerecivel: boolean;
  ehNaoPerecivel: boolean;
  proponente: TerceirizadaComEnderecoInterface;
  aprovaCollapse: () => void;
  reprovaCollapse: () => void;
  listaCompletaInformacoesNutricionais: any;
  listaInformacoesNutricionaisFichaTecnica: any;
}

export default ({
  idCollapse,
  collapse,
  setCollapse,
  collapseConfigs,
  conferidos,
  ficha,
  values,
  somenteLeitura,
  ehPerecivel,
  ehNaoPerecivel,
  proponente,
  aprovaCollapse,
  reprovaCollapse,
  listaCompletaInformacoesNutricionais,
  listaInformacoesNutricionaisFichaTecnica,
}: CollapsesPadraoProps) => {
  return (
    <Collapse
      collapse={collapse}
      setCollapse={setCollapse}
      collapseConfigs={collapseConfigs}
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
                valorInicial={ficha?.analise?.fabricante_envasador_correcoes}
                disabled={true}
              />
            </div>
          </div>
        )}
        <FormFabricante
          fabricantesCount={
            [values[`fabricante_0`], values[`fabricante_1`]].filter(
              (fabricante) => fabricante,
            ).length
          }
          values={values}
          somenteLeitura={true}
        />
        {!somenteLeitura && (
          <FormAprovacao
            name={"fabricante_envasador"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="detalhes_produto">
        {!conferidos.detalhes_produto && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.detalhes_produto_correcoes}
                disabled={true}
              />
            </div>
          </div>
        )}
        <FormPereciveisENaoPereciveis values={values} desabilitar={true} />
        {!somenteLeitura && (
          <FormAprovacao
            name={"detalhes_produto"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="informacoes_nutricionais">
        {!conferidos.informacoes_nutricionais && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={
                  ficha?.analise?.informacoes_nutricionais_correcoes
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
              className="input-ficha-tecnica"
              disabled
            />
          </div>
          <div className="col-3">
            <Field
              component={InputText}
              name={`unidade_medida_porcao`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
          <div className="col-3">
            <Field
              component={InputText}
              name={`valor_unidade_caseira`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
          <div className="col-3">
            <Field
              component={InputText}
              name={`unidade_medida_caseira`}
              className="input-ficha-tecnica"
              disabled
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
          desabilitar={true}
        />
        {!somenteLeitura && (
          <FormAprovacao
            name={"informacoes_nutricionais"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="conservacao">
        {!conferidos.conservacao && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.conservacao_correcoes}
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
                className="input-ficha-tecnica"
                disabled
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
              className="textarea-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        {!somenteLeitura && (
          <FormAprovacao
            name={"conservacao"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      {ehPerecivel && (
        <section id="temperatura_e_transporte">
          {!conferidos.temperatura_e_transporte && (
            <div className="row campo-correcao mb-4">
              <div className="col-12">
                <TextArea
                  label="Indicações de Correções CODAE"
                  valorInicial={
                    ficha?.analise?.temperatura_e_transporte_correcoes
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
                className="input-ficha-tecnica"
                disabled
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
                className="input-ficha-tecnica"
                disabled
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
                disabled
              />
            </div>
          </div>
          {!somenteLeitura && (
            <FormAprovacao
              name={"temperatura_e_transporte"}
              aprovaCollapse={aprovaCollapse}
              values={values}
              reprovaCollapse={reprovaCollapse}
            />
          )}
        </section>
      )}

      <section id="armazenamento">
        {!conferidos.armazenamento && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.armazenamento_correcoes}
                disabled={true}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col">
            Informações que constarão da rotulagem das embalagens primária e
            secundária, fechadas.
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Field
              component={TextArea}
              label="Informações de Armazenamento que deverão constar na embalagem Primária:"
              name={`embalagem_primaria`}
              className="textarea-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <Field
              component={TextArea}
              label="Informações de Armazenamento que deverão constar na embalagem Secundária:"
              name={`embalagem_secundaria`}
              className="textarea-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        {!somenteLeitura && (
          <FormAprovacao
            name={"armazenamento"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="embalagem_e_rotulagem">
        {!conferidos.embalagem_e_rotulagem && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.embalagem_e_rotulagem_correcoes}
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
              disabled
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
                      disabled
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
                      disabled
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
                      className="input-ficha-tecnica"
                      disabled
                    />
                  </div>

                  <div className="col">
                    <Field
                      component={InputText}
                      naoDesabilitarPrimeiraOpcao
                      name={`unidade_medida_volume_primaria`}
                      className="input-ficha-tecnica"
                      disabled
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
                className="input-ficha-tecnica"
                disabled
              />
            </div>

            <div className="col-3">
              <Field
                component={InputText}
                name={`unidade_medida_primaria`}
                className="input-ficha-tecnica"
                disabled
              />
            </div>

            <div className="col-3">
              <Field
                component={InputText}
                name={`peso_liquido_embalagem_secundaria`}
                className="input-ficha-tecnica"
                disabled
              />
            </div>

            <div className="col-3">
              <Field
                component={InputText}
                name={`unidade_medida_secundaria`}
                className="input-ficha-tecnica"
                disabled
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
                className="input-ficha-tecnica"
                disabled
              />
            </div>

            <div className="col-3">
              <Field
                component={InputText}
                name={`unidade_medida_primaria_vazia`}
                className="input-ficha-tecnica"
                disabled
              />
            </div>

            <div className="col-3">
              <Field
                component={InputText}
                name={`peso_embalagem_secundaria_vazia`}
                className="input-ficha-tecnica"
                disabled
              />
            </div>

            <div className="col-3">
              <Field
                component={InputText}
                name={`unidade_medida_secundaria_vazia`}
                className="input-ficha-tecnica"
                disabled
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
                  className="input-ficha-tecnica"
                  disabled
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
              disabled
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
        {!somenteLeitura && (
          <FormAprovacao
            name={"embalagem_e_rotulagem"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="responsavel_tecnico">
        {!conferidos.responsavel_tecnico && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.responsavel_tecnico_correcoes}
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
              className="input-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <Field
              component={InputText}
              label="Habilitação:"
              name={`habilitacao`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
          <div className="col-6">
            <Field
              component={InputText}
              label="Nº do Registro em Órgão Competente:"
              name={`numero_registro_orgao`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4">
            <BotaoAnexo urlAnexo={ficha.arquivo} />
          </div>
        </div>
        {!somenteLeitura && (
          <FormAprovacao
            name={"responsavel_tecnico"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="modo_preparo">
        {!conferidos.modo_preparo && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.modo_preparo_correcoes}
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
              disabled
            />
          </div>
        </div>
        {!somenteLeitura && (
          <FormAprovacao
            name={"modo_preparo"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
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
        {!somenteLeitura && (
          <BotaoCiente
            name={"outras_informacoes"}
            aprovaCollapse={aprovaCollapse}
            desabilitar={conferidos.outras_informacoes}
          />
        )}
      </section>
    </Collapse>
  );
};

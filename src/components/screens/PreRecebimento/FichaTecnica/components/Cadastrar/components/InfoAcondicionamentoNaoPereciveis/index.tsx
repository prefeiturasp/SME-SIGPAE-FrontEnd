import React, { Dispatch } from "react";
import { Field } from "react-final-form";

import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import InputText from "src/components/Shareable/Input/InputText";
import Label from "src/components/Shareable/Label";
import InputFile from "src/components/Shareable/Input/InputFile";
import Select from "src/components/Shareable/Select";
import CheckboxComBorda from "src/components/Shareable/CheckboxComBorda";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  required,
  composeValidators,
  inteiroOuDecimalComVirgula,
} from "src/helpers/fieldValidators";
import { CollapseConfig } from "src/components/Shareable/Collapse/interfaces";
import {
  ArquivoForm,
  OptionsGenerico,
} from "src/interfaces/pre_recebimento.interface";
import {
  inserirArquivoFichaAssinadaRT,
  removerArquivoFichaAssinadaRT,
} from "src/components/screens/PreRecebimento/FichaTecnica/helpers";

const COLLAPSE_CONFIG_INFO_ACONDICIONAMENTO: CollapseConfig[] = [
  {
    titulo: <span className="verde-escuro">Conservação</span>,
    camposObrigatorios: true,
  },
  {
    titulo: <span className="verde-escuro">Armazenamento</span>,
    camposObrigatorios: true,
  },
  {
    titulo: <span className="verde-escuro">Embalagem e Rotulagem</span>,
    camposObrigatorios: true,
  },
  {
    titulo: <span className="verde-escuro">Responsável Técnico e Anexos</span>,
    camposObrigatorios: true,
  },
  {
    titulo: <span className="verde-escuro">Modo de Preparo</span>,
    camposObrigatorios: false,
  },
  {
    titulo: <span className="verde-escuro">Outras Informações</span>,
    camposObrigatorios: false,
  },
];

interface InfoAcondicionamentoNaoPereciveisProps {
  collapse: CollapseControl;
  setCollapse: Dispatch<React.SetStateAction<CollapseControl>>;
  unidadesMedidaOptions: OptionsGenerico[];
  arquivo: ArquivoForm[];
  setArquivo: Dispatch<React.SetStateAction<ArquivoForm[]>>;
  values: Record<string, any>;
}

export default ({
  collapse,
  setCollapse,
  unidadesMedidaOptions,
  arquivo,
  setArquivo,
  values,
}: InfoAcondicionamentoNaoPereciveisProps) => {
  return (
    <Collapse
      collapse={collapse}
      setCollapse={setCollapse}
      id="collapseFichaTecnica"
      collapseConfigs={COLLAPSE_CONFIG_INFO_ACONDICIONAMENTO}
    >
      <section id="formConservacao">
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

      <section id="formArmazenamento">
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
              label="Informações de Armazenamento que deverão constar na embalagem Secundária:"
              name={`embalagem_secundaria`}
              className="textarea-ficha-tecnica"
              placeholder="Digite as informações de armazenamento para embalagem secundária"
              required
              validate={required}
            />
          </div>
        </div>
      </section>

      <section id="formEmbalagemRotulagem">
        <div className="row">
          <div className="subtitulo">Embalagem</div>
        </div>

        <div className="row mt-3">
          <div className="col">
            <Field
              name={`embalagens_de_acordo_com_anexo`}
              dataTestId="embalagens_de_acordo_com_anexo"
              component={CheckboxComBorda}
              label="Declaro que as embalagens primária e secundária em que
              serão entregues o produto estarão de acordo com as
              especificações do Anexo I do Edital."
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
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-6 px-0">
            <div className="row">
              <Label content="O produto é líquido?" required />
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
                  />
                  <span className="checkmark" />
                </label>
              </div>
            </div>
          </div>

          {values.produto_eh_liquido === "1" && (
            <div className="col-6 px-0">
              <div className="row">
                <Label
                  content="Volume do Produto na Embalagem Primária:"
                  required
                />
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
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="row mt-3">
          <div className="row">
            <div className="col-6">
              <Label
                content="Peso Líquido do Produto na Embalagem Primária:"
                required
              />
            </div>

            <div className="col-6">
              <Label
                content="Peso Líquido do Produto na Embalagem Secundária:"
                required
              />
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
              />
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="row">
            <div className="col-6">
              <Label content="Peso da Embalagem Primária Vazia:" required />
            </div>

            <div className="col-6">
              <Label content="Peso da Embalagem Secundária Vazia:" required />
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
              />
            </div>
          </div>
        </div>

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
              dataTestId="rotulo_legivel"
              component={CheckboxComBorda}
              label="Declaro que no rótulo da embalagem primária e, se for o
              caso, da secundária, constarão, de forma legível e indelével,
              todas as informações solicitadas do Anexo I do Edital."
            />
          </div>
        </div>
      </section>

      <section id="formResponsavelTecnico">
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
              inserirArquivoFichaAssinadaRT(files, setArquivo)
            }
            removeFile={() => removerArquivoFichaAssinadaRT(setArquivo)}
            toastSuccess={"Arquivo incluído com sucesso!"}
            alignLeft
          />
          <label className="col-12 label-input">
            <span className="red">* Campo Obrigatório: &nbsp;</span>
            Envie um arquivo no formato: PDF, com até 10MB
          </label>
        </div>
      </section>

      <section id="formModoPreparo">
        <div className="row">
          <div className="col">
            <Field
              component={TextArea}
              label="Descreva o modo de preparo do produto:"
              name={`modo_de_preparo`}
              className="textarea-ficha-tecnica"
              placeholder="Insira aqui as informações de modo de preparo"
            />
          </div>
        </div>
      </section>

      <section id="formOutrasInfos">
        <div className="row">
          <div className="col">
            <Field
              component={TextArea}
              label="Informações Adicionais:"
              name={`informacoes_adicionais`}
              className="textarea-ficha-tecnica"
              placeholder="Insira aqui as informações adicionais sobre o produto"
            />
          </div>
        </div>
      </section>
    </Collapse>
  );
};

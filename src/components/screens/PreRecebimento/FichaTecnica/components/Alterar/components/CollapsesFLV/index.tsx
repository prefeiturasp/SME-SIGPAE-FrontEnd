import React, { Dispatch, SetStateAction } from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import InputFile from "src/components/Shareable/Input/InputFile";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import FormProponente from "../../../Cadastrar/components/FormProponente";
import FormFabricante from "../../../Cadastrar/components/FormFabricante";
import FormPereciveisENaoPereciveis from "../../../Cadastrar/components/FormPereciveisENaoPereciveis";
import {
  ArquivoForm,
  FichaTecnicaDetalhadaComAnalise,
  OptionsGenerico,
} from "src/interfaces/pre_recebimento.interface";
import { StateConferidosAnalise } from "../../../../interfaces";
import { TerceirizadaComEnderecoInterface } from "src/interfaces/terceirizada.interface";
import {
  inserirArquivoFichaAssinadaRT,
  removerArquivoFichaAssinadaRT,
} from "src/components/screens/PreRecebimento/FichaTecnica/helpers";

interface CollapsesFLVProps {
  idCollapse: string;
  collapse: CollapseControl;
  setCollapse: any;
  collapseConfigs: { [key: string]: {} }[];
  conferidos: StateConferidosAnalise;
  ficha: FichaTecnicaDetalhadaComAnalise;
  values: any;
  proponente: TerceirizadaComEnderecoInterface;
  fabricantesOptions: OptionsGenerico[];
  fabricantesCount: number;
  setFabricantesCount: Dispatch<SetStateAction<number>>;
  desabilitaEndereco: boolean[];
  arquivo: ArquivoForm[];
  setArquivo: Dispatch<SetStateAction<ArquivoForm[]>>;
}

export default ({
  idCollapse,
  collapse,
  setCollapse,
  collapseConfigs,
  conferidos,
  ficha,
  values,
  proponente,
  fabricantesOptions,
  fabricantesCount,
  setFabricantesCount,
  desabilitaEndereco,
  arquivo,
  setArquivo,
}: CollapsesFLVProps) => {
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
          fabricantesCount={fabricantesCount}
          setFabricantesCount={setFabricantesCount}
          fabricantesOptions={fabricantesOptions}
          desabilitaEndereco={desabilitaEndereco}
          values={values}
          somenteLeitura={conferidos.fabricante_envasador}
          ocultarBotaoCadastroFabricante={true}
        />
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
        <FormPereciveisENaoPereciveis
          values={values}
          desabilitar={conferidos.detalhes_produto}
        />
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
              className="input-ficha-tecnica"
              disabled={conferidos.responsavel_tecnico}
            />
          </div>
          <div className="col-6">
            <Field
              component={InputText}
              label="Nº do Registro em Órgão Competente:"
              name={`numero_registro_orgao`}
              className="input-ficha-tecnica"
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
                  component={InputFile as any}
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
            </div>
          )}
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
              disabled={true}
            />
          </div>
        </div>
      </section>
    </Collapse>
  );
};

import React, { Dispatch } from "react";
import { Field } from "react-final-form";

import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import InputText from "src/components/Shareable/Input/InputText";
import InputFile from "src/components/Shareable/Input/InputFile";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { required } from "src/helpers/fieldValidators";
import { CollapseConfig } from "src/components/Shareable/Collapse/interfaces";
import { ArquivoForm } from "src/interfaces/pre_recebimento.interface";
import {
  inserirArquivoFichaAssinadaRT,
  removerArquivoFichaAssinadaRT,
} from "src/components/screens/PreRecebimento/FichaTecnica/helpers";

const COLLAPSE_CONFIG_INFO_ACONDICIONAMENTO: CollapseConfig[] = [
  {
    titulo: <span className="verde-escuro">Responsável Técnico e Anexos</span>,
    camposObrigatorios: true,
  },
  {
    titulo: <span className="verde-escuro">Outras Informações</span>,
    camposObrigatorios: false,
  },
];

interface InfoAcondicionamentoFLVProps {
  collapse: CollapseControl;
  setCollapse: Dispatch<React.SetStateAction<CollapseControl>>;
  arquivo: ArquivoForm[];
  setArquivo: Dispatch<React.SetStateAction<ArquivoForm[]>>;
}

export default ({
  collapse,
  setCollapse,
  arquivo,
  setArquivo,
}: InfoAcondicionamentoFLVProps) => {
  return (
    <Collapse
      collapse={collapse}
      setCollapse={setCollapse}
      id="collapseFichaTecnica"
      collapseConfigs={COLLAPSE_CONFIG_INFO_ACONDICIONAMENTO}
    >
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

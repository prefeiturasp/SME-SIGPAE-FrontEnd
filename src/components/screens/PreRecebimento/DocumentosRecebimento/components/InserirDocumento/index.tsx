import React from "react";
import { Field } from "react-final-form";
import InputFile from "src/components/Shareable/Input/InputFile";
import { DEZ_MB } from "../../../../../../constants/shared";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { textAreaRequired } from "src/helpers/fieldValidators";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
import { ArquivoForm } from "src/interfaces/pre_recebimento.interface";

interface Props {
  setFiles(_files: Array<ArquivoForm>): void;
  removeFile: (_index: number) => void;
  tipoDocumento?: string;
  arquivosIniciais?: ArquivoForm[];
  formatosAceitos?: string;
  multiplosArquivos?: boolean;
  concatenarNovosArquivos?: boolean;
}

const InserirDocumento: React.FC<Props> = ({
  setFiles,
  removeFile,
  tipoDocumento = "",
  arquivosIniciais = [],
  formatosAceitos = "PDF, PNG, JPG ou JPEG",
  multiplosArquivos = true,
  concatenarNovosArquivos = true,
}) => {
  const titulo = OUTROS_DOCUMENTOS_OPTIONS.find(
    (obj) => obj.value === tipoDocumento
  )?.label;

  return (
    <>
      {titulo && (
        <div className="row mt-3">
          <div className="col">
            <div className="subtitulo mb-0">
              <span className="asterisco">* </span>
              {titulo}
            </div>
          </div>
        </div>
      )}

      {tipoDocumento === "OUTROS" && (
        <div className="mt-1">
          <Field
            component={TextArea}
            label="Descrição dos Documentos"
            name={`descricao_documento`}
            placeholder="Descreva o tipo de documento"
            required
            validate={textAreaRequired}
          />
        </div>
      )}

      <div className="row">
        <Field
          component={InputFile}
          arquivosPreCarregados={arquivosIniciais}
          className="inputfile"
          texto={titulo ? "Anexar Documentos" : "Anexar Laudo"}
          name={"files"}
          accept={formatosAceitos}
          setFiles={setFiles}
          removeFile={removeFile}
          toastSuccess={"Documento incluído com sucesso!"}
          alignLeft
          multiple={multiplosArquivos}
          limiteTamanho={DEZ_MB}
          concatenarNovosArquivos={concatenarNovosArquivos}
        />

        <label className="col-12 label-imagem">
          <span className="red">* Campo Obrigatório: &nbsp;</span>
          {titulo
            ? "Envie um arquivo nos formatos: " +
              formatosAceitos +
              ", com até 10MB"
            : "Envie um arquivo no formato: " +
              formatosAceitos +
              " com até 10MB"}
        </label>
      </div>
    </>
  );
};

export default InserirDocumento;

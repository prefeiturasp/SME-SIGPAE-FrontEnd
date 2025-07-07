import React, { ReactElement } from "react";
import { Field } from "react-final-form";

import InputFile from "src/components/Shareable/Input/InputFile";
import { DEZ_MB } from "src/constants/shared";
import { ArquivoForm } from "src/interfaces/pre_recebimento.interface";

import "./styles.scss";

interface Props {
  name: string;
  textoBotao: string;
  toastSuccess: string;
  setFiles(_files: Array<ArquivoForm>): void;
  removeFile: (_index: number) => void;
  required?: boolean;
  helpText?: string | ReactElement;
  labelClassName?: string;
  arquivosIniciais?: ArquivoForm[];
  formatosAceitos?: string;
  limiteTamanho?: number;
  multiplosArquivos?: boolean;
  concatenarNovosArquivos?: boolean;
}

const InputFileField: React.FC<Props> = ({
  name,
  textoBotao,
  toastSuccess,
  setFiles,
  removeFile,
  required,
  helpText,
  labelClassName,
  arquivosIniciais = [],
  formatosAceitos = "PDF, PNG, JPG ou JPEG",
  limiteTamanho = DEZ_MB,
  multiplosArquivos = true,
  concatenarNovosArquivos = true,
}) => {
  return (
    <>
      <Field
        component={InputFile}
        arquivosPreCarregados={arquivosIniciais}
        className="inputfile"
        texto={textoBotao}
        name={name}
        accept={formatosAceitos}
        setFiles={setFiles}
        removeFile={removeFile}
        toastSuccess={toastSuccess}
        alignLeft
        multiple={multiplosArquivos}
        limiteTamanho={limiteTamanho}
        concatenarNovosArquivos={concatenarNovosArquivos}
      />

      {(required || helpText) && (
        <label className={`col-12 input-file-field-label ${labelClassName}`}>
          {required && <span className="red">* Campo Obrigatório</span>}
          {required && helpText && ": "}
          {helpText}
        </label>
      )}
    </>
  );
};

export default InputFileField;

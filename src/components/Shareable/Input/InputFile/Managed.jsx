import PropTypes from "prop-types";
import React, { Component } from "react";
import "./style.scss";
import Botao from "../../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Botao/constants";
import { readerFile } from "./helper";
import { toastSuccess, toastError } from "../../Toast/dialogs";
import { truncarString } from "../../../../helpers/utilities";
import { DEZ_MB } from "../../../../constants/shared";

export class InputFileManaged extends Component {
  openFile(file) {
    if (file.arquivo && file.arquivo.startsWith("http")) {
      window.open(file.arquivo);
    } else if (file.nome.includes(".doc")) {
      const link = document.createElement("a");
      link.href = file.base64;
      link.download = file.nome;
      link.click();
    } else {
      let pdfWindow = window.open("");
      pdfWindow.document.write(
        "<iframe width='100%' height='100%' src='" +
          file.base64 +
          "'></iframe>",
      );
    }
  }

  deleteFile(index) {
    const { value, onChange } = this.props;
    onChange(value.length === 1 ? "" : value.filter((_, i) => i !== index));
  }

  async onInputChange(event) {
    const {
      value,
      onChange,
      concatenarNovosArquivos,
      nomeNovoArquivo,
      toastSuccessMessage,
    } = this.props;
    const files = event.target.files;
    let valido = true;
    const QUANTIDADE_ARQUIVOS = files.length;
    Array.from(files).forEach((file) => {
      const extensao = file.name.split(".")[file.name.split(".").length - 1];
      if (
        !["doc", "docx", "png", "pdf", "jpg", "jpeg"].includes(
          extensao.toLowerCase(),
        )
      ) {
        toastError(`Extensão do arquivo não suportada: ${extensao}`);
        valido = false;
      } else if (file.size > DEZ_MB) {
        toastError(`Arquivo superior a 10 MB não é possível fazer o upload`);
        valido = false;
      }
    });
    if (valido) {
      let filesBase64 = [];
      Array.from(files).forEach((file) => {
        readerFile(file)
          .then((anexo) => {
            filesBase64.push({
              nome: nomeNovoArquivo || file.name,
              base64: anexo.arquivo,
            });
          })
          .then(() => {
            if (filesBase64.length === QUANTIDADE_ARQUIVOS) {
              toastSuccess(
                toastSuccessMessage || "Protocolo incluso com sucesso",
              );
              onChange(
                !concatenarNovosArquivos || value === ""
                  ? filesBase64
                  : value.concat(filesBase64),
              );
            }
          });
      });
    }
    this.inputRef.value = null;
  }

  render() {
    const {
      accept,
      disabled,
      icone,
      multiple,
      title,
      texto,
      value,
      dataTestId,
    } = this.props;
    const files = value === "" ? [] : value;
    return (
      <div className={`input input-file`}>
        <input
          accept={accept}
          ref={(i) => (this.inputRef = i)}
          className={`form-control inputfile`}
          disabled={disabled}
          onChange={(event) => this.onInputChange(event)}
          type="file"
          multiple={multiple}
          title={title}
          data-testid={dataTestId}
        />
        <Botao
          onClick={() => this.inputRef.click()}
          texto={texto}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          disabled={disabled}
          icon={icone}
          type={BUTTON_TYPE.BUTTON}
        />
        {files.map((file, key) => {
          return (
            <div className="file-div row" key={key}>
              <div
                className="file-name col-8"
                onClick={() => this.openFile(file)}
              >
                {truncarString(file.nome, 20)}
              </div>
              <div className="col-4 exclude-icon">
                <i
                  onClick={() => this.deleteFile(key)}
                  className="fas fa-times"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

InputFileManaged.propTypes = {
  accept: PropTypes.string,
  concatenarNovosArquivos: PropTypes.bool,
  disabled: PropTypes.bool,
  icone: PropTypes.string,
  multiple: PropTypes.bool,
  title: PropTypes.string,
  texto: PropTypes.string,
  nomeNovoArquivo: PropTypes.string,
};

InputFileManaged.defaultProps = {
  accept: [],
  concatenarNovosArquivos: false,
  disabled: false,
  multiple: false,
};

export default InputFileManaged;

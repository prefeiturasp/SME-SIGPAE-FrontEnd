import PropTypes from "prop-types";
import React, { Component } from "react";
import "./style.scss";
import Botao from "../../Botao";
import { BUTTON_STYLE, BUTTON_TYPE } from "../../Botao/constants";
import { readerFile } from "./helper";
import { toastSuccess, toastError } from "../../Toast/dialogs";
import { DEZ_MB } from "../../../../constants/shared";

export class AnexosProdutoField extends Component {
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
        "<iframe width='100%' height='100%' src='" + file.base64 + "'></iframe>"
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
          extensao.toLowerCase()
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
                toastSuccessMessage || "Protocolo incluso com sucesso"
              );
              onChange(
                !concatenarNovosArquivos || value === ""
                  ? filesBase64
                  : value.concat(filesBase64)
              );
            }
          });
      });
    }
    this.inputRef.value = null;
  }

  render() {
    const { accept, disabled, multiple, title, texto, value } = this.props;
    const files = value === "" ? [] : value;
    return (
      <div className={`input input-file align-left`}>
        <div>
          <input
            accept={accept}
            ref={(i) => (this.inputRef = i)}
            className={`form-control inputfile`}
            disabled={disabled}
            onChange={(event) => this.onInputChange(event)}
            type="file"
            multiple={multiple}
            title={title}
          />
        </div>
        <div>
          <Botao
            onClick={() => this.inputRef.click()}
            texto={texto}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            disabled={disabled}
            icon="fas fa-paperclip"
            type={BUTTON_TYPE.BUTTON}
          />
        </div>
        <div className="card-warning mt-2">
          <strong>IMPORTANTE:</strong> Envie um arquivo formato .doc, .docx,
          .pdf, .png, .jpg ou .jpeg, com até 10Mb. <br />
        </div>
        <div className="anexos">
          {files.map((file, key) => {
            return (
              <div key={key} className="px-1 arquivos-anexados mt-1">
                <span onClick={() => this.openFile(file)}>
                  <i className="fas fa-paperclip" />
                </span>
                <a
                  href="#!"
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={() => this.openFile(file)}
                  className="link ms-1 me-5"
                >
                  {file.nome}
                </a>
                {!disabled && (
                  <span
                    className="float-end"
                    onClick={() => this.deleteFile(key)}
                  >
                    <i className="fas fa-trash-alt" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

AnexosProdutoField.propTypes = {
  accept: PropTypes.string,
  concatenarNovosArquivos: PropTypes.bool,
  disabled: PropTypes.bool,
  icone: PropTypes.string,
  multiple: PropTypes.bool,
  title: PropTypes.string,
  texto: PropTypes.string,
  nomeNovoArquivo: PropTypes.string,
};

AnexosProdutoField.defaultProps = {
  accept: [],
  concatenarNovosArquivos: false,
  disabled: false,
  multiple: false,
};

export default AnexosProdutoField;

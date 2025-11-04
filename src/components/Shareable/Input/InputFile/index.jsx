import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";
import { InputErroMensagem } from "../InputErroMensagem";
import { HelpText } from "../../../Shareable/HelpText";
import "./style.scss";
import Botao from "../../Botao";
import { BUTTON_STYLE, BUTTON_ICON, BUTTON_TYPE } from "../../Botao/constants";
import { readerFile } from "./helper";
import { toastSuccess, toastError } from "../../Toast/dialogs";
import { truncarString } from "../../../../helpers/utilities";
import { DEZ_MB, VINTE_CINCO_MB } from "../../../../constants/shared";

const InputFile = forwardRef((props, ref) => {
  const [files, setFiles] = useState(props.arquivosPreCarregados || []);

  useEffect(() => {
    if (props.arquivosPreCarregados && props.arquivosPreCarregados.length > 0) {
      setFiles(props.arquivosPreCarregados);
    }
  }, [props.arquivosPreCarregados]);

  useImperativeHandle(ref, () => ({
    setFiles: (newFiles) => {
      setFiles(newFiles);
    },
    ...(ref?.current || {}),
  }));

  const inputRef = useRef(null);

  const openFile = (file) => {
    if (file.nome.includes(".doc")) {
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
  };

  useEffect(() => {
    if (props.submitted) {
      setFiles([]);
    }
  }, [props.submitted]);

  const deleteFile = (index) => {
    let newFiles = [...files];
    newFiles.splice(index, 1);
    props.removeFile(index);
    setFiles(newFiles);
    inputRef.current.value = "";
  };

  const onInputChange = async (event) => {
    let valido = true;
    let lista_extensoes = [
      "doc",
      "docx",
      "png",
      "pdf",
      "jpg",
      "jpeg",
      "xlsx",
      "xls",
      "xlsm",
    ];
    const { accept } = props;
    const QUANTIDADE_ARQUIVOS = event.target.files.length;
    if (accept) {
      let nova_lista_extensoes = [];
      lista_extensoes.forEach((ext) => {
        if (accept.toLowerCase().includes(ext)) {
          nova_lista_extensoes.push(ext);
        }
      });
      lista_extensoes = nova_lista_extensoes;
    }

    const hasPDF = files.some((file) => file.nome.includes("pdf"));
    const hasXLS = files.some(
      (file) =>
        file.base64.includes("spreadsheetml") ||
        file.base64.includes("application/vnd.ms-excel.sheet.macroEnabled.12"),
    );

    Array.from(event.target.files).forEach((file) => {
      const nameParts = file.name.split(".");
      const extensao = nameParts[nameParts.length - 1].toLowerCase();

      if (props.ehPlanilhaMedicaoInicial) {
        if (extensao === "pdf" && hasPDF) {
          toastError("Já existe um arquivo PDF anexado.");
          valido = false;
        } else if (["xls", "xlsx", "xlsm"].includes(extensao) && hasXLS) {
          toastError("Já existe uma planilha anexada.");
          valido = false;
        }
        if (!["xls", "xlsx", "xlsm", "pdf"].includes(extensao)) {
          toastError(`Extensão do arquivo não suportada: ${extensao}`);
          valido = false;
        } else if (extensao === "pdf" && file.size > DEZ_MB) {
          toastError(`Tamanho máximo: 10MB`);
          valido = false;
        } else if (
          ["xls", "xlsx", "xlsm"].includes(extensao) &&
          file.size > VINTE_CINCO_MB
        ) {
          toastError(`Tamanho máximo: 25MB`);
          valido = false;
        }
      } else {
        if (!lista_extensoes.includes(extensao)) {
          toastError(
            `Extensão do arquivo não suportada: ${extensao.toUpperCase()}`,
          );
          valido = false;
        } else if (props.limiteTamanho && file.size > props.limiteTamanho) {
          toastError(
            `Arquivo superior a ${Math.floor(
              props.limiteTamanho / 10 ** 6,
            )}MB, não é possível fazer o upload`,
          );
          valido = false;
        } else if (extensao === "pdf" && file.size > DEZ_MB) {
          toastError(
            `Arquivo PDF superior a 10MB, não é possível fazer o upload`,
          );
          valido = false;
        } else if (
          ["xls", "xlsx", "xlsm"].includes(extensao) &&
          file.size > VINTE_CINCO_MB
        ) {
          toastError(
            `Arquivo de planilha superior a 25MB, não é possível fazer o upload`,
          );
          valido = false;
        }
      }
    });
    if (valido) {
      let localFiles = [];
      Array.from(event.target.files).forEach((file) => {
        readerFile(file)
          .then((anexo) => {
            localFiles.push({
              nome: props.nomeNovoArquivo || file.name,
              arquivo: anexo.arquivo,
              base64: anexo.arquivo,
            });
          })
          .then(() => {
            if (localFiles.length === QUANTIDADE_ARQUIVOS) {
              toastSuccess(
                props.toastSuccess || "Laudo(s) incluso(s) com sucesso",
              );
              if (props.concatenarNovosArquivos) {
                const allFiles = [...files, ...localFiles];
                props.setFiles(allFiles);
                setFiles(allFiles);
              } else {
                props.setFiles(localFiles);
                setFiles(localFiles);
              }
            }
          });
      });
    }
  };

  const {
    accept,
    alignLeft,
    className,
    customHelpTextClassName,
    disabled,
    helpText,
    icone,
    input,
    meta,
    name,
    required,
    title,
    texto,
    ehPlanilhaMedicaoInicial,
    validationFile,
    dataTestId,
  } = props;

  return (
    <>
      <div
        className={`${
          ehPlanilhaMedicaoInicial ? "mt-3 ms-3 col-4" : "col-12"
        } input input-file ${alignLeft && "align-left"} ${icone && "icon"}`}
      >
        <Botao
          className="upload-button"
          onClick={() => inputRef.current && inputRef.current.click()}
          htmlFor={name}
          texto={texto}
          style={
            ehPlanilhaMedicaoInicial
              ? BUTTON_STYLE.GREEN
              : BUTTON_STYLE.GREEN_OUTLINE
          }
          icon={
            ehPlanilhaMedicaoInicial
              ? BUTTON_ICON.PAPER_CLIP
              : BUTTON_ICON.ATTACH
          }
          type={BUTTON_TYPE.BUTTON}
          disabled={disabled}
        />
        <InputErroMensagem meta={meta} />
        {ehPlanilhaMedicaoInicial &&
          validationFile.touched &&
          !validationFile.xls && (
            <div className="error-or-warning-message">
              <div className="error-message">
                Falta anexar o arquivo em Excel
              </div>
            </div>
          )}
        {ehPlanilhaMedicaoInicial &&
          validationFile.touched &&
          !validationFile.pdf && (
            <div className="error-or-warning-message">
              <div className="error-message">Falta anexar o arquivo em PDF</div>
            </div>
          )}
      </div>
      <div
        className={`${
          ehPlanilhaMedicaoInicial ? "mt-3 col-7" : "col-12"
        } input input-file ${alignLeft && "align-left"} ${icone && "icon"}`}
      >
        <HelpText
          helpText={helpText}
          customHelpTextClassName={customHelpTextClassName}
        />
      </div>
      <div
        className={`col-12 input input-file ${alignLeft && "align-left"} ${
          icone && "icon"
        }`}
      >
        {files.map((file, key) => {
          return (
            <div className="file-div" key={key}>
              <div className="file-name-container">
                <i className="fas fa-paperclip" />
                <span onClick={() => openFile(file)} className="file-name">
                  {truncarString(file.nome, 40)}
                </span>
                <i
                  onClick={() => deleteFile(key)}
                  className={`fas ${
                    ehPlanilhaMedicaoInicial ? "fa-times" : "fa-trash-alt"
                  } exclude-icon`}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div
        className={`col-12 input input-file ${alignLeft && "align-left"} ${
          icone && "icon"
        }`}
      >
        <input
          {...input}
          accept={accept}
          ref={inputRef}
          className={`form-control ${className} ${
            meta &&
            meta.touched &&
            (meta.error || meta.warning) &&
            "invalid-field"
          }`}
          data-testid={dataTestId}
          disabled={disabled}
          name={name}
          onChange={(event) => onInputChange(event)}
          data-cy={input.name}
          required={required}
          type="file"
          multiple={ehPlanilhaMedicaoInicial ? true : input.multiple}
          title={title}
        />
      </div>
    </>
  );
});

InputFile.propTypes = {
  accept: PropTypes.string,
  alignLeft: PropTypes.bool,
  className: PropTypes.string,
  customHelpTextClassName: PropTypes.string,
  concatenarNovosArquivos: PropTypes.bool,
  disabled: PropTypes.bool,
  esconderAsterisco: PropTypes.bool,
  helpText: PropTypes.string,
  input: PropTypes.object,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  nomeNovoArquivo: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  validationFile: PropTypes.object,
};

InputFile.defaultProps = {
  accept: "",
  className: "",
  customHelpTextClassName: "",
  concatenarNovosArquivos: false,
  disabled: false,
  esconderAsterisco: false,
  helpText: "",
  input: {},
  label: "",
  labelClassName: "",
  meta: {},
  name: "",
  placeholder: "",
  required: false,
  type: "text",
  validationFile: { touched: false },
};

export default InputFile;

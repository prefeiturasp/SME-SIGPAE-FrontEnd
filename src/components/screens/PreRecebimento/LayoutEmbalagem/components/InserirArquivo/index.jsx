import React from "react";
import { Field } from "react-final-form";
import InputFile from "components/Shareable/Input/InputFile";
import { DEZ_MB } from "../../../../../../constants/shared";
import TooltipIcone from "../../../../../Shareable/TooltipIcone";

const TITULOS_SECOES_TIPOS_EMBALAGENS = {
  PRIMARIA: "Embalagem Primária",
  SECUNDARIA: "Embalagem Secundária",
  TERCIARIA: "Embalagem Terciária",
};

const TOOLTIPS_TIPOS_EMBALAGENS = {
  PRIMARIA:
    "É a embalagem de acondicionamento mais próxima do produto. Ex.: Saco plástico do Macarrão.",
  SECUNDARIA:
    "É a embalagem que envolve a embalagem primária e pode agrupar os produtos. Ex.: Caixa contendo os pacotes de Macarrão.",
  TERCIARIA:
    "É a embalagem de acondicionamento mais distante do produto. Ex.: Caixas que envolvem as embalagens secundárias e primárias.",
};

const FORMATOS_IMAGEM = "PDF, PNG, JPG ou JPEG";

export default ({ setFiles, removeFile, arquivosIniciais, tipoEmbalagem }) => {
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="subtitulo">
            {tipoEmbalagem === "PRIMARIA" && (
              <span className="asterisco">* </span>
            )}
            {"Layout " + TITULOS_SECOES_TIPOS_EMBALAGENS[tipoEmbalagem]}
            <TooltipIcone
              tooltipText={TOOLTIPS_TIPOS_EMBALAGENS[tipoEmbalagem]}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <Field
          component={InputFile}
          arquivosPreCarregados={arquivosIniciais}
          className="inputfile"
          texto="Inserir Layout"
          name={"files"}
          accept={FORMATOS_IMAGEM}
          setFiles={setFiles}
          removeFile={removeFile}
          toastSuccess={"Imagem incluída com sucesso!"}
          alignLeft
          multiple={true}
          limiteTamanho={DEZ_MB}
          concatenarNovosArquivos
        />
        <label className="col-12 label-imagem">
          <span className="red">
            {tipoEmbalagem !== "PRIMARIA"
              ? "IMPORTANTE:"
              : "Campo Obrigatório:"}
            &nbsp;
          </span>
          {"Envie um arquivo nos formatos: " +
            FORMATOS_IMAGEM +
            ", com até 10MB"}
        </label>
      </div>
    </>
  );
};

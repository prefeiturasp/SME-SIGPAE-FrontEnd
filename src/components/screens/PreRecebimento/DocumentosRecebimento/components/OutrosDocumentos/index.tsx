import React from "react";
import {
  DocumentosRecebimentoDetalhado,
  TiposDocumentoChoices,
} from "interfaces/pre_recebimento.interface";
import InputText from "src/components/Shareable/Input/InputText";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
import { OUTROS_DOCUMENTOS_OPTIONS } from "../../constants";
import "./styles.scss";

export interface Props {
  documento: DocumentosRecebimentoDetalhado;
}

const OutrosDocumentos: React.FC<Props> = ({ documento }) => {
  const retornaTextoTipoDocumento = (
    tipoDocumento: TiposDocumentoChoices
  ): string => {
    return OUTROS_DOCUMENTOS_OPTIONS.find((x) => x.value === tipoDocumento)
      .label;
  };

  return (
    <>
      <div className="subtitulo">Outros Documentos</div>

      <ul className="secao-tipo-documento">
        {documento.tipos_de_documentos?.map((tipo, index) => (
          <li key={index}>
            <div className="subtitulo-documento">
              {retornaTextoTipoDocumento(tipo.tipo_documento)}
            </div>
            {tipo.tipo_documento === "OUTROS" && (
              <InputText
                label="Descrição do documento"
                valorInicial={tipo.descricao_documento}
                required
                disabled={true}
              />
            )}
            <ArquivosTipoRecebimento lista={tipo} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default OutrosDocumentos;

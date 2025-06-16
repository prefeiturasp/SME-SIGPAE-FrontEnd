import React from "react";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import { TiposDocumentos } from "interfaces/pre_recebimento.interface";

export interface Props {
  lista: TiposDocumentos;
  textoBotoes?: string;
}

const ArquivosTipoRecebimento: React.FC<Props> = ({ lista, textoBotoes }) => {
  return (
    <>
      {lista?.arquivos?.map((arquivo, index) => {
        return (
          <div className="row mt-2" key={index}>
            <div className="col-4">
              <BotaoAnexo urlAnexo={arquivo.arquivo} textoBotao={textoBotoes} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ArquivosTipoRecebimento;

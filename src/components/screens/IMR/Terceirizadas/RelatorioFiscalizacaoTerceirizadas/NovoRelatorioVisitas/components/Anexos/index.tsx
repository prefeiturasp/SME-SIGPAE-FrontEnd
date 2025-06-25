import React, { useEffect, useState } from "react";
import InputFileField from "src/components/Shareable/InputFileField";
import { downloadAndConvertToBase64 } from "src/components/Shareable/Input/InputFile/helper";
import {
  ArquivoInterface,
  ArquivoFormInterface,
} from "src/interfaces/imr.interface";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";

const FORMATOS_ARQUIVOS = "PDF, XLS, XLSX, XLSXM, PNG, JPG ou JPEG";

type AnexosType = {
  setAnexos: React.Dispatch<React.SetStateAction<ArquivoInterface[]>>;
  anexos: Array<ArquivoInterface>;
  anexosIniciais: Array<any>;
  somenteLeitura?: Boolean;
};

export const Anexos = ({ ...props }: AnexosType) => {
  const { setAnexos, anexos, anexosIniciais, somenteLeitura } = props;
  const [arquivosIniciais, setArquivosIniciais] = useState<any>();

  useEffect(() => {
    if (anexosIniciais && anexosIniciais.length > 0) {
      formatAnexosIniciais();
    }
  }, [anexosIniciais]);

  const formatAnexosIniciais = async () => {
    const anexosIniciaisFormatados = await Promise.all(
      anexosIniciais.map(async (anexo) => {
        return {
          nome: anexo.nome,
          base64: await downloadAndConvertToBase64(anexo.anexo_url),
        };
      })
    );
    setArquivosIniciais(anexosIniciaisFormatados);
    setFiles(anexosIniciaisFormatados);
  };

  const setFiles = (files: Array<ArquivoFormInterface>): void => {
    const arquivosAtualizados = files.map((arquivo: ArquivoFormInterface) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });

    setAnexos(arquivosAtualizados);
  };

  const removeFiles = (index: number): void => {
    let newFiles = [...anexos];
    newFiles.splice(index, 1);
    setAnexos(newFiles);
  };

  return (
    <>
      <div className="anexos">
        <div className="row">
          <div className="col-12 pb-2">
            <span className="titulo-anexo">ANEXOS</span>
          </div>
        </div>

        {!somenteLeitura && (
          <div className="row mt-3">
            <InputFileField
              name="anexos"
              arquivosIniciais={arquivosIniciais}
              setFiles={setFiles}
              removeFile={removeFiles}
              formatosAceitos={FORMATOS_ARQUIVOS}
              toastSuccess="Anexo incluído com sucesso!"
              textoBotao="Anexar Arquivos"
              helpText="Envie o(s) arquivo(s) no formato PDF, PNG, JPG, JPEG e Excel (Todos os formatos), com até 10MB."
            />
          </div>
        )}
        {somenteLeitura && (
          <>
            {anexosIniciais?.map((arquivo, index) => {
              return (
                <div className="row mt-2" key={index}>
                  <div className="col-2">
                    <BotaoAnexo urlAnexo={arquivo.anexo_url} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

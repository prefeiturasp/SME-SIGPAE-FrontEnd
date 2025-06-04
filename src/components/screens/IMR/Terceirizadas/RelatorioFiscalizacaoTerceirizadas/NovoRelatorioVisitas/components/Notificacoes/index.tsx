import React, { useEffect, useState } from "react";
import Botao from "src/components/Shareable/Botao";
import { downloadAndConvertToBase64 } from "src/components/Shareable/Input/InputFile/helper";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import {
  ArquivoFormInterface,
  ArquivoInterface,
} from "interfaces/imr.interface";
import InputFileField from "src/components/Shareable/InputFileField";

type NotificacoesType = {
  onClickBaixarNotificacoes: React.Dispatch<React.SetStateAction<boolean>>;
  setNotificacoesAssinadas: React.Dispatch<
    React.SetStateAction<ArquivoInterface[]>
  >;
  notificacoesAssinadas: Array<ArquivoInterface>;
  notificacoesIniciais: Array<any>;
  somenteLeitura?: boolean;
  disabledBaixarNotificacoes: boolean;
};

export const Notificacoes = ({ ...props }: NotificacoesType) => {
  const {
    onClickBaixarNotificacoes,
    setNotificacoesAssinadas,
    notificacoesAssinadas,
    notificacoesIniciais,
    somenteLeitura,
    disabledBaixarNotificacoes,
  } = props;
  const [arquivosIniciais, setArquivosIniciais] = useState<any>();

  useEffect(() => {
    if (notificacoesIniciais && notificacoesIniciais.length > 0) {
      formatNotificacoesIniciais();
    }
  }, [notificacoesIniciais]);

  const formatNotificacoesIniciais = async () => {
    const notificacoesIniciaisFormatadas = await Promise.all(
      notificacoesIniciais.map(async (notificacao_assinada) => {
        return {
          nome: notificacao_assinada.nome,
          base64: await downloadAndConvertToBase64(
            notificacao_assinada.anexo_url
          ),
        };
      })
    );
    setArquivosIniciais(notificacoesIniciaisFormatadas);
    setFiles(notificacoesIniciaisFormatadas);
  };

  const setFiles = (files: Array<ArquivoFormInterface>): void => {
    const arquivosAtualizados = files.map((arquivo: ArquivoFormInterface) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });

    setNotificacoesAssinadas(arquivosAtualizados);
  };

  const removeFiles = (index: number): void => {
    let newFiles = [...notificacoesAssinadas];
    newFiles.splice(index, 1);
    setNotificacoesAssinadas(newFiles);
  };

  return (
    <>
      {!somenteLeitura && (
        <div className="anexos">
          <div className="row">
            <div className="col-12 pb-2">
              <span className="titulo-anexo">NOTIFICAÇÕES</span>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-2">
              <Botao
                texto="Baixar Notificações"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                icon={BUTTON_ICON.DOWNLOAD}
                iconPosition="left"
                onClick={onClickBaixarNotificacoes}
                disabled={disabledBaixarNotificacoes}
              />
            </div>
            <div className="col-10">
              <InputFileField
                name="notificacoes_assinadas"
                arquivosIniciais={arquivosIniciais}
                setFiles={setFiles}
                removeFile={removeFiles}
                formatosAceitos="PDF"
                toastSuccess="Notificação incluída com sucesso!"
                textoBotao="Anexar Notificações Assinadas"
                helpText="Envie o(s) arquivo(s) no formato PDF com até 10MB."
                required
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

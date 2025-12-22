import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "src/components/Shareable/Page/BotaoVoltar";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import { detalharDocumentoRecebimento } from "src/services/documentosRecebimento.service";
import InputText from "src/components/Shareable/Input/InputText";
import {
  DocumentosRecebimentoDetalhado,
  TiposDocumentos,
} from "src/interfaces/pre_recebimento.interface";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
import OutrosDocumentos from "../OutrosDocumentos";
import { usuarioEhEmpresaFornecedor } from "src/helpers/utilities";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { STATUS_DOCUMENTOS_DE_RECEBIMENTO } from "src/constants/shared";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

export default () => {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState<DocumentosRecebimentoDetalhado>(
    {} as DocumentosRecebimentoDetalhado,
  );
  const [laudo, setLaudo] = useState<TiposDocumentos>();

  const voltarPagina = () => {
    const link = usuarioEhEmpresaFornecedor()
      ? `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`
      : `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`;

    navigate(link);
  };

  const showBotaoAtualizarDocumento = () => {
    return (
      usuarioEhEmpresaFornecedor() &&
      objeto.status === STATUS_DOCUMENTOS_DE_RECEBIMENTO.APROVADO
    );
  };

  const goToAtualizarFornecedorDocumentosRecebimentoPage = () => {
    navigate(
      `/${PRE_RECEBIMENTO}/${ATUALIZAR_FORNECEDOR_DOCUMENTO_RECEBIMENTO}?uuid=${objeto.uuid}`,
    );
  };

  const carregarDados = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoRecebimento(uuid);

    const objeto = response.data;

    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO",
    );

    if (laudoIndex !== -1) {
      const laudo = objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];
      setLaudo(laudo);
    }

    setObjeto(objeto);
  };

  useEffect(() => {
    (async () => {
      setCarregando(true);
      await carregarDados();
      setCarregando(false);
    })();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-detalhar-documentos-recebimento">
        <div className="card-body">
          {objeto.logs && (
            <div className="row my-4">
              <FluxoDeStatusPreRecebimento listaDeStatus={objeto.logs} />
            </div>
          )}

          <div className="row">
            <div className="col-6">
              Data da Criação:
              <span className="green-bold"> {objeto.criado_em}</span>
            </div>

            <div className="col-6">
              Status:
              <span className="green-bold"> {objeto.status}</span>
            </div>
          </div>

          <hr />

          <div className="subtitulo">Dados do Laudo</div>
          <div className="row">
            <div className="col-6">
              <InputText
                label="Nº do Cronograma"
                valorInicial={objeto.numero_cronograma}
                required
                disabled={true}
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Pregão/Chamada Pública"
                valorInicial={objeto.pregao_chamada_publica}
                required
                disabled={true}
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nome do Produto"
                valorInicial={objeto.nome_produto}
                required
                disabled={true}
                suffix={
                  objeto.programa_leve_leite && (
                    <div className="me-2">
                      <TagLeveLeite />
                    </div>
                  )
                }
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Laudo"
                valorInicial={objeto.numero_laudo}
                required
                disabled={true}
              />
            </div>
          </div>
          <ArquivosTipoRecebimento lista={laudo} />

          <hr />

          <OutrosDocumentos documento={objeto} />

          <hr />

          <div className="my-5">
            {showBotaoAtualizarDocumento() ? (
              <Botao
                texto="Atualizar Documentos"
                type={BUTTON_TYPE.BUTTON}
                style={BUTTON_STYLE.GREEN}
                className="float-end ms-3"
                onClick={goToAtualizarFornecedorDocumentosRecebimentoPage}
              />
            ) : null}
            <BotaoVoltar onClick={voltarPagina} />
          </div>
        </div>
      </div>
    </Spin>
  );
};

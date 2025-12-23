import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "src/components/Shareable/Page/BotaoVoltar";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import {
  detalharDocumentoParaAnalise,
  downloadArquivoLaudoAssinado,
} from "src/services/documentosRecebimento.service";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { DocumentosRecebimentoParaAnalise } from "src/interfaces/pre_recebimento.interface";
import OutrosDocumentos from "../OutrosDocumentos";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import { formataMilharDecimal } from "src/helpers/utilities";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";

export default () => {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState<DocumentosRecebimentoParaAnalise>(
    {} as DocumentosRecebimentoParaAnalise,
  );
  const [aprovado, setAprovado] = useState(true);

  const voltarPaginaPainel = () =>
    navigate(`/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`);

  const carregarDados = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoParaAnalise(uuid);

    const objeto = response.data;

    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO",
    );
    objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];

    setObjeto(objeto);
    setAprovado(objeto.status === "Aprovado");
  };

  useEffect(() => {
    (async () => {
      setCarregando(true);
      await carregarDados();
      setCarregando(false);
    })();
  }, []);

  const baixarArquivoLaudo = async (
    objeto: DocumentosRecebimentoParaAnalise,
  ) => {
    setCarregando(true);
    try {
      await downloadArquivoLaudoAssinado(objeto.uuid, objeto.numero_cronograma);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-detalhar-documentos-recebimento-codae">
        <div className="card-body">
          {objeto.logs && (
            <div className="row my-4">
              <FluxoDeStatusPreRecebimento listaDeStatus={objeto.logs} />
            </div>
          )}

          <div className="flex-header">
            <div className="subtitulo">Dados Gerais</div>
            {aprovado ? (
              <div className="status aprovado">
                <i className="fas fa-check-circle" />
                Documentos aprovados em {objeto?.logs?.slice(-1)[0].criado_em}
              </div>
            ) : (
              <div className="status correcao">
                <i className="fas fa-exclamation-triangle" />
                Solicitada Correção em {objeto?.logs?.slice(-1)[0].criado_em}
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-12">
              <InputText
                label="Fornecedor"
                valorInicial={objeto.fornecedor}
                disabled={true}
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Cronograma"
                valorInicial={objeto.numero_cronograma}
                disabled={true}
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Pregão/Chamada Pública"
                valorInicial={objeto.pregao_chamada_publica}
                disabled={true}
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nome do Produto"
                valorInicial={objeto.nome_produto}
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
                label="Nº do Processo SEI"
                valorInicial={objeto.numero_sei}
                disabled={true}
              />
            </div>
            <div className="col-6">
              <InputText
                label="Nº do Laudo"
                valorInicial={objeto.numero_laudo}
                disabled={true}
              />
            </div>
          </div>
          <div className="subtitulo-documento">
            Laudo enviado pelo Fornecedor:
          </div>
          <div className="row mt-2">
            <div className="col-4">
              <BotaoAnexo
                textoBotao="Laudo Analisado"
                onClick={() => baixarArquivoLaudo(objeto)}
              />
            </div>
          </div>

          <hr />

          {aprovado === false && (
            <>
              <div className="subtitulo laranja">Solicitação de Correção</div>
              <div className="row">
                <div className="col-6">
                  Data da Solicitação:
                  <strong>
                    {" "}
                    {objeto?.logs?.slice(-1)[0].criado_em.split(" ")[0]}
                  </strong>
                </div>

                <div className="col-6">
                  Solicitado por:
                  <strong> {objeto?.logs?.slice(-1)[0].usuario.nome}</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <TextArea
                    label="Correções Necessárias"
                    valorInicial={objeto.correcao_solicitada}
                    disabled={true}
                  />
                </div>
              </div>
              <hr />
            </>
          )}

          <div className="subtitulo">Dados do Laudo</div>

          <div className="row">
            <div className="col-6">
              <InputText
                label="Nome do Laboratório"
                valorInicial={objeto.laboratorio?.nome}
                disabled={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <InputText
                label="Quantidade do Laudo"
                valorInicial={
                  objeto.quantidade_laudo !== null &&
                  objeto.quantidade_laudo !== undefined
                    ? formataMilharDecimal(objeto.quantidade_laudo.toString())
                    : ""
                }
                disabled={true}
              />
            </div>
            <div className="col-4">
              <InputText
                label="Unidade de Medida"
                valorInicial={objeto.unidade_medida?.nome}
                disabled={true}
              />
            </div>
            <div className="col-4">
              <InputText
                label="Saldo do Laudo"
                valorInicial={
                  objeto.saldo_laudo !== null &&
                  objeto.saldo_laudo !== undefined
                    ? formataMilharDecimal(objeto.saldo_laudo.toString())
                    : ""
                }
                disabled={true}
              />
            </div>

            <div className="col-4">
              <InputText
                label="Data Final do Laudo"
                valorInicial={objeto.data_final_lote}
                disabled={true}
              />
            </div>

            <div className="col-8">
              <InputText
                label="Nº do(s) Lote(s) do(s) Laudo(s)"
                valorInicial={objeto.numero_lote_laudo}
                disabled={true}
              />
            </div>

            {objeto.datas_fabricacao_e_prazos?.map((prazo, index) => (
              <div className="row" key={index}>
                <div className="col">
                  <InputText
                    label="Data de Fabricação"
                    valorInicial={prazo.data_fabricacao}
                    disabled={true}
                  />
                </div>
                <div className="col">
                  <InputText
                    label="Data de Validade"
                    valorInicial={prazo.data_validade}
                    disabled={true}
                  />
                </div>
                <div className="col">
                  <InputText
                    label="Prazo Máximo de Recebimento"
                    valorInicial={prazo.prazo_maximo_recebimento}
                    disabled={true}
                  />
                </div>

                {prazo.prazo_maximo_recebimento !== "OUTRO" && (
                  <div className="col">
                    <InputText
                      label="Data Máxima de Recebimento"
                      valorInicial={prazo.data_maxima_recebimento}
                      disabled={true}
                    />
                  </div>
                )}

                {prazo.prazo_maximo_recebimento === "OUTRO" && (
                  <div className="col-12">
                    <InputText
                      label="Justifique Outro prazo máximo para Recebimento"
                      valorInicial={prazo.justificativa}
                      disabled={true}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <hr />

          <OutrosDocumentos documento={objeto} />

          <hr />

          <BotaoVoltar onClick={voltarPaginaPainel} />
        </div>
      </div>
    </Spin>
  );
};

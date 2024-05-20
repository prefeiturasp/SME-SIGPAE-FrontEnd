import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import "./styles.scss";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "configs/constants";
import { useNavigate } from "react-router-dom";
import BotaoVoltar from "components/Shareable/Page/BotaoVoltar";
import { FluxoDeStatusPreRecebimento } from "components/Shareable/FluxoDeStatusPreRecebimento";
import { detalharDocumentoParaAnalise } from "services/documentosRecebimento.service";
import InputText from "components/Shareable/Input/InputText";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import {
  DocumentosRecebimentoParaAnalise,
  TiposDocumentos,
} from "interfaces/pre_recebimento.interface";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
import OutrosDocumentos from "../OutrosDocumentos";

export default () => {
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState<DocumentosRecebimentoParaAnalise>(
    {} as DocumentosRecebimentoParaAnalise
  );
  const [aprovado, setAprovado] = useState(true);
  const [laudo, setLaudo] = useState<TiposDocumentos>();

  const voltarPaginaPainel = () =>
    navigate(`/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`);

  const carregarDados = async (): Promise<void> => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoParaAnalise(uuid);

    const objeto = response.data;

    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO"
    );
    const laudo = objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];

    setLaudo(laudo);
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
          <ArquivosTipoRecebimento
            lista={laudo}
            textoBotoes="Laudo Analisado"
          />

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
                valorInicial={objeto.quantidade_laudo}
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
                valorInicial={objeto.saldo_laudo}
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

            {objeto.datas_fabricacao_e_prazos?.map((prazo) => (
              <>
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
              </>
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

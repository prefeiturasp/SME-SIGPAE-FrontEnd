import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Select } from "src/components/Shareable/Select";
import { formataMesNome } from "src/helpers/utilities";
import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import {
  EDITAR_OCORRENCIA,
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_NOVA_OCORRENCIA,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import {
  NavigateFunction,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { OcorrenciaDiretorInterface } from "src/interfaces/imr.interface";
import { buscarOcorrenciasDiretor } from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import TabelaOcorrencias from "./components/TabelaOcorrencias";
import "./style.scss";

const MENSAGENS_ERRO_OCORRENCIAS: Record<number, string> = {
  [HTTP_STATUS.BAD_REQUEST]:
    "Os dados para consultar as ocorrências são inválidos ou estão incompletos. Volte à medição e tente novamente.",
  [HTTP_STATUS.FORBIDDEN]:
    "Você não tem permissão para consultar as ocorrências desta medição.",
  [HTTP_STATUS.NOT_FOUND]:
    "A medição ou a página de ocorrências solicitada não foi encontrada.",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]:
    "Ocorreu uma falha na consulta das ocorrências. Tente novamente mais tarde.",
};

export const ListaOcorrencias = () => {
  const [searchParams] = useSearchParams();
  const navigate: NavigateFunction = useNavigate();
  const solicitacaoMedicaoInicialUuid = searchParams.get(
    "solicitacaoMedicaoInicialUuid",
  );
  const mes = searchParams.get("mes");
  const ano = searchParams.get("ano");
  const periodo = `${mes}/${ano}`;
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaDiretorInterface[]>(
    [],
  );
  const [pagina, setPagina] = useState(1);
  const [totalResultados, setTotalResultados] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [consultaComSucesso, setConsultaComSucesso] = useState(false);

  useEffect(() => {
    setPagina(1);
  }, [solicitacaoMedicaoInicialUuid]);

  useEffect(() => {
    let consultaAtiva = true;

    const carregarOcorrencias = async () => {
      setCarregando(true);
      setConsultaComSucesso(false);
      setOcorrencias([]);
      setTotalResultados(0);

      try {
        const resposta = await buscarOcorrenciasDiretor({
          solicitacao_medicao_inicial: solicitacaoMedicaoInicialUuid,
          page: pagina,
          page_size: 10,
        });
        if (!consultaAtiva) return;

        if (resposta?.status === HTTP_STATUS.OK) {
          setOcorrencias(resposta.data.results);
          setTotalResultados(resposta.data.count);
          setConsultaComSucesso(true);
        } else {
          toastError(MENSAGENS_ERRO_OCORRENCIAS[resposta?.status]);
        }
      } catch {
        if (consultaAtiva) {
          toastError("Não foi possível carregar as ocorrências.");
        }
      } finally {
        if (consultaAtiva) setCarregando(false);
      }
    };

    carregarOcorrencias();

    return () => {
      consultaAtiva = false;
    };
  }, [solicitacaoMedicaoInicialUuid, pagina]);

  const onSubmit = () => {};

  const editarOcorrencia = (ocorrencia: OcorrenciaDiretorInterface) => {
    const parametros = {
      ano,
      mes,
      editalUuid: searchParams.get("editalUuid"),
      solicitacaoMedicaoInicialUuid,
      ocorrenciaUuid: ocorrencia.uuid,
      tipoOcorrenciaUuid: ocorrencia.tipo_ocorrencia,
      grupo: ocorrencia.grupo !== null ? String(ocorrencia.grupo) : null,
    };
    const queryString = new URLSearchParams(
      Object.entries(parametros).filter(([, valor]) => valor) as [
        string,
        string,
      ][],
    ).toString();

    navigate(
      `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${EDITAR_OCORRENCIA}?${queryString}`,
    );
  };

  return (
    <div className="card lista-ocorrencias mt-3">
      <div className="card-body">
        <Form onSubmit={onSubmit} initialValues={{ mes_ano: periodo }}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-6 col-lg-4">
                  <Field
                    component={Select}
                    name="mes_ano"
                    label="Período de Lançamento da Medição"
                    options={[
                      {
                        nome: `${formataMesNome(mes)} / ${ano}`,
                        uuid: periodo,
                      },
                    ]}
                    disabled
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-8 text-md-end">
                  <Botao
                    texto="Registrar Nova Ocorrência"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    disabled={!solicitacaoMedicaoInicialUuid}
                    onClick={() =>
                      navigate(
                        `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${REGISTRAR_NOVA_OCORRENCIA}`,
                        {
                          state: {
                            editalUuid: searchParams.get("editalUuid"),
                            solicitacaoMedicaoInicialUuid,
                            mes,
                            ano,
                          },
                        },
                      )
                    }
                  />
                </div>
              </div>
            </form>
          )}
        </Form>
        <section className="mt-4" aria-label="Ocorrências Registradas">
          <h2 className="titulo-verde mb-3">Ocorrências Registradas</h2>
          <Spin spinning={carregando} tip="Carregando...">
            <div
              className="lista-ocorrencias__resultados"
              aria-busy={carregando}
            >
              {consultaComSucesso &&
                !carregando &&
                (ocorrencias.length === 0 ? (
                  <p className="text-center">
                    Nenhuma ocorrência registrada para este período.
                  </p>
                ) : (
                  <>
                    <TabelaOcorrencias
                      ocorrencias={ocorrencias}
                      onEditar={editarOcorrencia}
                    />
                    <Paginacao
                      current={pagina}
                      total={totalResultados}
                      pageSize={10}
                      onChange={setPagina}
                    />
                  </>
                ))}
            </div>
          </Spin>
        </section>
        {ocorrencias.length !== 0 ? (
          <div className="d-flex justify-content-end mt-4">
            <Botao
              texto="Exportar Excel"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              icon={BUTTON_ICON.FILE_EXCEL}
              disabled
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

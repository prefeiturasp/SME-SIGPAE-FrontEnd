import React, { useEffect, useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  recebeGuiaComOcorrencia,
  editaGuiaComOcorrencia,
} from "src/services/logistica.service";
import { mapeiaStatusAlimento } from "../../helper";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import {
  CONFERENCIA_GUIA_COM_OCORRENCIA,
  LOGISTICA,
  CONFERIR_ENTREGA,
  REPOSICAO_GUIA,
} from "src/configs/constants";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import ConfirmacaoEdicao from "./components/confirmacaoEdicao";
import "./styles.scss";

export default ({ reposicao }) => {
  const [guia, setGuia] = useState({});
  const [valoresForm, setValoresForm] = useState([]);
  const [conferenciaInvalida, setConferenciaInvalida] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reposicaoInvalida, setReposicaoInvalida] = useState(false);
  const [edicao, setEdicao] = useState(false);
  const navigate = useNavigate();

  const chaveValores = reposicao ? "valoresReposicao" : "valoresConferencia";
  const chaveGuia = reposicao ? "guiaReposicao" : "guiaConferencia";

  const onSubmit = async () => {
    setLoading(true);
    let flagOcorrencia = false;
    let payload = {};
    let ultimoItem = valoresForm[valoresForm.length - 1];

    payload.guia = guia.uuid;
    if (reposicao) payload.eh_reposicao = true;
    payload.nome_motorista = ultimoItem.nome_motorista;
    payload.placa_veiculo = ultimoItem.placa_veiculo;
    payload.data_recebimento = ultimoItem.data_entrega_real;
    payload.hora_recebimento = ultimoItem.hora_recebimento;
    payload.conferencia_dos_alimentos = [];
    valoresForm.forEach((item, index) => {
      let conferencia = {};

      if (item.status !== "Recebido") flagOcorrencia = true;

      conferencia.nome_alimento = guia.alimentos[index].nome_alimento;
      conferencia.status_alimento = mapeiaStatusAlimento(item.status);
      if (item.ocorrencias) conferencia.ocorrencia = item.ocorrencias;
      if (item.observacoes) conferencia.observacao = item.observacoes;
      if (item.arquivo) {
        if (reposicao) {
          conferencia.arquivo = item.arquivo.arquivo;
        } else {
          conferencia.arquivo = item.arquivo[0].arquivo;
        }
      }

      if (item.recebidos_fechada !== undefined) {
        conferencia.tipo_embalagem = "FECHADA";
        conferencia.qtd_recebido = item.recebidos_fechada;
        payload.conferencia_dos_alimentos.push({ ...conferencia });
      }

      if (item.recebidos_fracionada !== undefined) {
        conferencia.tipo_embalagem = "FRACIONADA";
        conferencia.qtd_recebido = item.recebidos_fracionada;
        payload.conferencia_dos_alimentos.push({ ...conferencia });
      }
    });

    if (edicao === true) {
      payload.uuid_conferencia = valoresForm[0].uuid_conferencia;
      editaGuiaComOcorrencia(payload)
        .then(() => {
          let toastMsg = reposicao
            ? "Reposição editada com sucesso."
            : "Conferência editada com sucesso. O respectivo registro de reposição foi apagado.";
          toastSuccess(toastMsg);
          setLoading(false);
          goToConferir();
        })
        .catch((e) => {
          toastError(e.response.data.detail);
          setLoading(false);
        });
    } else {
      recebeGuiaComOcorrencia(payload)
        .then(() => {
          let toastMsg = reposicao
            ? "Reposição de alimentos faltantes registrada com sucesso"
            : flagOcorrencia
            ? "Guia de Remessa registrada com ocorrência"
            : "Guia de Remessa recebida com sucesso";
          toastSuccess(toastMsg);
          setLoading(false);
          goToConferir();
        })
        .catch((e) => {
          toastError(e.response.data.detail);
          setLoading(false);
        });
    }
  };

  const goToConferir = () => {
    navigate(`/${LOGISTICA}/${CONFERIR_ENTREGA}`);
  };

  const filtraEmbalagemPorTipo = (embalagens, tipo) => {
    const embalagensFiltradas = embalagens.filter((value) => {
      return value.tipo_embalagem.toUpperCase() === tipo;
    });
    if (embalagensFiltradas.length) return embalagensFiltradas[0];
    else return false;
  };

  const getClassStatus = (item) => {
    switch (item.status) {
      case "Recebido":
        return "green";
      case "Parcial":
        return "red";
      case "Não Recebido":
        return "red";
      default:
        return "";
    }
  };

  const cancelarConferencia = () => {
    let uuid = guia.uuid;
    navigate(
      `/${LOGISTICA}/${
        reposicao ? REPOSICAO_GUIA : CONFERENCIA_GUIA_COM_OCORRENCIA
      }/?uuid=${uuid}&autofill=true`
    );
  };

  const validaReposicao = (valores) => {
    const alimentosValidos = valores.filter((alim) => {
      return alim.status !== "Não Recebido";
    });
    if (alimentosValidos.length) {
      setReposicaoInvalida(false);
    } else {
      setReposicaoInvalida(true);
    }
  };

  useEffect(() => {
    let valoresConf = JSON.parse(localStorage.getItem(chaveValores));
    let guiaConf = JSON.parse(localStorage.getItem(chaveGuia));
    if (!valoresConf) {
      setConferenciaInvalida(true);
    }
    const urlParams = new URLSearchParams(window.location.search);
    let edicao = urlParams.get("editar");
    if (edicao === "true") {
      setEdicao(true);
    }
    setGuia(guiaConf);
    setValoresForm(valoresConf);

    if (reposicao) validaReposicao(valoresConf);
  }, []);

  const subtitulo = reposicao
    ? "Resumo da reposição de alimentos faltantes"
    : "Resumo da conferência";
  const pergunta = reposicao
    ? "Deseja realizar o registro da reposição dos itens abaixo?"
    : "Deseja realizar o registro de conferência dos itens abaixo?";
  const dataConferencia = reposicao
    ? "Data de registro da reposição:"
    : "Data de conferência:";

  return (
    <Spin tip="Carregando..." spinning={loading}>
      <div className="card mt-3 card-conferencia-guia-resumo-final">
        {!conferenciaInvalida && (
          <div className="card-body conferencia-guia-resumo-final">
            <span className="subtitulo">{subtitulo}</span>
            <span className="numero-guia float-end">
              Guia número: <strong>{parseInt(guia.numero_guia)}</strong>
            </span>
            <hr />

            <div className="mb-2">{pergunta}</div>

            <div className="mb-3">
              <strong>
                <i>
                  {dataConferencia} {moment(new Date()).format("DD/MM/YYYY")}
                </i>
              </strong>
            </div>

            <table className={`table table-bordered table-resumo-final`}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    rowSpan="3"
                    colSpan="2"
                    className="text-center"
                  >
                    Nome do Alimento
                  </th>
                  <th
                    scope="col"
                    colSpan={reposicao ? "4" : "3"}
                    className="text-center"
                  >
                    Embalagem Fechada
                  </th>
                  <th
                    scope="col"
                    colSpan={reposicao ? "4" : "3"}
                    className="text-center"
                  >
                    Embalagem Fracionada
                  </th>
                  <th scope="col" colSpan="2" className="text-center">
                    Recebimento do Alimento
                  </th>
                </tr>
                <tr>
                  <th scope="col" colSpan="2" className="text-center">
                    Previsto
                  </th>
                  {reposicao && <th scope="col">A receber</th>}
                  <th scope="col">Recebido</th>
                  <th scope="col" colSpan="2" className="text-center">
                    Previsto
                  </th>
                  {reposicao && <th scope="col">A receber</th>}
                  <th scope="col">Recebido</th>
                  <th scope="col" rowSpan="2" className="text-center">
                    Status
                  </th>
                  <th scope="col" rowSpan="2" className="text-center">
                    Data
                  </th>
                </tr>
                <tr>
                  <th scope="col">Quant.</th>
                  <th scope="col">Capac.</th>
                  <th scope="col">Quant.</th>
                  {reposicao && <th scope="col">Quant.</th>}
                  <th scope="col">Quant.</th>
                  <th scope="col">Capac.</th>
                  <th scope="col">Quant.</th>
                  {reposicao && <th scope="col">Quant.</th>}
                </tr>
              </thead>
              <tbody>
                {guia.alimentos &&
                  guia.alimentos.map((item, index) => {
                    const embalagens = item.total_embalagens
                      ? item.total_embalagens
                      : item.embalagens;
                    const fracionada = filtraEmbalagemPorTipo(
                      embalagens,
                      "FRACIONADA"
                    );
                    const arquivoExiste = valoresForm[index].arquivo
                      ? valoresForm[index].arquivo.length > 0
                      : false;
                    const fechada = filtraEmbalagemPorTipo(
                      embalagens,
                      "FECHADA"
                    );
                    return (
                      <>
                        <tr>
                          <td className="icone-arquivo">
                            {arquivoExiste > 0 && (
                              <div className="icon-arquivo">
                                <i className="fas fa-paperclip green" />
                              </div>
                            )}
                          </td>

                          <td className="nome-alimento">
                            {item.nome_alimento}
                          </td>
                          <td className="embalagem">
                            {fechada ? fechada.qtd_volume : "--"}
                          </td>
                          <td className="embalagem">
                            {fechada ? (
                              <>{fechada.capacidade_completa}</>
                            ) : (
                              "--"
                            )}
                          </td>
                          {reposicao && (
                            <td className="embalagem">
                              {fechada ? fechada.qtd_a_receber : "--"}
                            </td>
                          )}
                          <td className="embalagem">
                            <strong>
                              {fechada
                                ? valoresForm[index].recebidos_fechada
                                : "--"}
                            </strong>
                          </td>
                          <td className="embalagem">
                            {fracionada ? fracionada.qtd_volume : "--"}
                          </td>
                          <td className="embalagem">
                            {fracionada ? (
                              <>{fracionada.capacidade_completa}</>
                            ) : (
                              "--"
                            )}
                          </td>
                          {reposicao && (
                            <td className="embalagem">
                              {fracionada ? fracionada.qtd_a_receber : "--"}
                            </td>
                          )}
                          <td className="embalagem">
                            <strong>
                              {fracionada
                                ? valoresForm[index].recebidos_fracionada
                                : "--"}
                            </strong>
                          </td>
                          <td
                            className={`recebimento ${getClassStatus(
                              valoresForm[index]
                            )}`}
                          >
                            <strong>{valoresForm[index].status}</strong>
                          </td>
                          <td className="recebimento">
                            {
                              valoresForm[valoresForm.length - 1]
                                .data_entrega_real
                            }
                          </td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
            {reposicao && reposicaoInvalida && (
              <div className="mb-3 mt-3">
                Caro usuário, considerando que nenhum alimento faltante foi
                reposto, favor cancelar este registro de reposição de alimentos.
              </div>
            )}
            <div>
              <span className="float-end">
                <Botao
                  texto="Cancelar"
                  className="me-3"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  onClick={() => {
                    cancelarConferencia();
                  }}
                />
                {edicao ? (
                  <ConfirmacaoEdicao
                    disabled={reposicaoInvalida}
                    texto={"Registrar Edição"}
                    guia={guia}
                    onSubmit={onSubmit}
                    reposicao={reposicao}
                  />
                ) : (
                  <Botao
                    texto={
                      "Registrar " + (reposicao ? "Reposição" : "Conferência")
                    }
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN}
                    disabled={reposicaoInvalida}
                    onClick={onSubmit}
                  />
                )}
              </span>
            </div>
          </div>
        )}
        {conferenciaInvalida && (
          <div className="card-body">
            Não há processo de conferência em andamento, clique em voltar para
            iniciar uma conferência.
          </div>
        )}
      </div>
    </Spin>
  );
};

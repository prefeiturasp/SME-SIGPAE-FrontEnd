import { Botao } from "src/components/Shareable/Botao";
import { PERIODO_STATUS_DE_PROGRESSO } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos/constants";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  PERIODO_LANCAMENTO,
} from "src/configs/constants";
import { deepCopy } from "src/helpers/utilities";
import React from "react";
import { Form } from "react-final-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  desabilitarBotaoEditar,
  justificativaPeriodo,
  nomePeriodoGrupo,
  statusPeriodo,
  styleBotaoCardLancamento,
  textoBotaoCardLancamento,
  formataPeriodosNormais,
} from "../helpers";
import "./styles.scss";

export const CardLancamento = ({
  textoCabecalho = null,
  grupo,
  cor,
  tipos_alimentacao,
  periodoSelecionado,
  solicitacaoMedicaoInicial,
  ehGrupoSolicitacoesDeAlimentacao = false,
  ehGrupoETEC = false,
  ehPeriodoEspecifico = false,
  quantidadeAlimentacoesLancadas,
  periodosInclusaoContinua = null,
  periodoEspecifico = null,
  frequenciasDietasEscolaSemAlunoRegular,
  errosAoSalvar,
  periodosPermissoesLancamentosEspeciais,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  let alimentacoesFormatadas = [];

  const meusErros =
    errosAoSalvar &&
    typeof errosAoSalvar === "object" &&
    errosAoSalvar.length > 0 &&
    errosAoSalvar.filter((obj) =>
      [textoCabecalho, grupo].includes(obj.periodo_escolar),
    );

  const qtdAlimentacaoPeriodoFiltrada = () => {
    return quantidadeAlimentacoesLancadas.filter(
      (qtdAlimentacaoPeriodo) =>
        qtdAlimentacaoPeriodo.nome_periodo_grupo ===
        nomePeriodoGrupo(grupo, textoCabecalho),
    );
  };

  const quantidadeAlimentacao = (nomeAlimentacao) => {
    const alimentacao = nomeAlimentacao
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replaceAll(/ /g, "_");
    let quantidade = 0;
    if (qtdAlimentacaoPeriodoFiltrada().length > 0) {
      const qtdAlimentacaoFiltrada =
        qtdAlimentacaoPeriodoFiltrada()[0].valores.filter(
          (v) => v.nome_campo === alimentacao,
        );
      if (qtdAlimentacaoFiltrada.length > 0) {
        quantidade = qtdAlimentacaoFiltrada[0].valor;
      }
    }
    return quantidade;
  };

  if (ehGrupoSolicitacoesDeAlimentacao || ehGrupoETEC) {
    if (ehGrupoETEC) {
      tipos_alimentacao = tipos_alimentacao.filter(
        (alimentacao) => alimentacao !== "Lanche Emergencial",
      );
    }
    alimentacoesFormatadas = tipos_alimentacao.map((alimentacao, key) => (
      <div key={key} className="mb-2">
        <span style={{ color: cor }}>
          <b>{quantidadeAlimentacao(alimentacao)}</b>
        </span>
        <span className="ms-1">- {alimentacao}</span>
        <br />
      </div>
    ));
  } else {
    let copy_tipos_alimentacao = deepCopy(tipos_alimentacao);
    if (
      periodosPermissoesLancamentosEspeciais
        ?.find(
          (periodoPermissao) => periodoPermissao.periodo === textoCabecalho,
        )
        ?.alimentacoes.includes("Lanche Extra")
    ) {
      copy_tipos_alimentacao.push({
        nome: "Lanche Extra",
      });
    }
    alimentacoesFormatadas = copy_tipos_alimentacao
      .filter((alimentacao) => alimentacao.nome !== "Lanche Emergencial")
      .map((alimentacao, key) => (
        <div key={key} className="mb-2">
          <span style={{ color: cor }}>
            <b>{quantidadeAlimentacao(alimentacao.nome)}</b>
          </span>
          <span className="ms-1">- {alimentacao.nome}</span>
          <br />
        </div>
      ));
  }

  const getStatusPeriodo = () => {
    return statusPeriodo(
      quantidadeAlimentacoesLancadas,
      solicitacaoMedicaoInicial,
      grupo,
      textoCabecalho,
    );
  };

  const handleClickEditar = () => {
    navigate(
      {
        pathname: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${PERIODO_LANCAMENTO}`,
        search: `uuid=${solicitacaoMedicaoInicial.uuid}&ehGrupoSolicitacoesDeAlimentacao=${ehGrupoSolicitacoesDeAlimentacao}&ehGrupoETEC=${ehGrupoETEC}&ehPeriodoEspecifico=${ehPeriodoEspecifico}`,
      },
      {
        state: {
          periodo: textoCabecalho,
          grupo,
          mesAnoSelecionado: periodoSelecionado,
          ehPeriodoEspecifico,
          tipos_alimentacao: tipos_alimentacao,
          status_periodo: getStatusPeriodo(),
          status_solicitacao: solicitacaoMedicaoInicial.status,
          justificativa_periodo: justificativaPeriodo(
            quantidadeAlimentacoesLancadas,
            grupo,
            textoCabecalho,
          ),
          periodosInclusaoContinua: periodosInclusaoContinua,
          solicitacaoMedicaoInicial: solicitacaoMedicaoInicial,
          frequenciasDietasEscolaSemAlunoRegular:
            frequenciasDietasEscolaSemAlunoRegular,
          periodoEspecifico: periodoEspecifico,
          recreioNasFerias:
            solicitacaoMedicaoInicial.recreio_nas_ferias !== null,
          ...location.state,
        },
      },
    );
  };

  return (
    <Form
      onSubmit={() => {}}
      render={() => (
        <div
          className={`lancamento-por-periodo-card mt-3 ${
            meusErros && meusErros.length ? "border-danger" : ""
          }`}
          style={{ color: cor }}
        >
          <div className="wraper-periodo-status mb-2">
            <div className="periodo-cabecalho">
              {grupo && grupo}
              {textoCabecalho
                ? formataPeriodosNormais(textoCabecalho)
                : textoCabecalho}
            </div>
            <div>
              <div
                className={`float-end status-card-periodo-grupo ${
                  [
                    "MEDICAO_CORRECAO_SOLICITADA",
                    "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                  ].includes(getStatusPeriodo())
                    ? "red"
                    : [
                          "MEDICAO_CORRIGIDA_PELA_UE",
                          "MEDICAO_CORRIGIDA_PARA_CODAE",
                        ].includes(getStatusPeriodo())
                      ? "blue"
                      : ""
                }`}
              >
                {PERIODO_STATUS_DE_PROGRESSO[getStatusPeriodo()]
                  ? PERIODO_STATUS_DE_PROGRESSO[getStatusPeriodo()].nome
                  : "Não Preenchido"}
              </div>
            </div>
          </div>
          <div className="wraper-contadores-alimentacao">
            <div
              className="total-alimentacoes p-2"
              style={{ backgroundColor: cor }}
            >
              <span>
                {qtdAlimentacaoPeriodoFiltrada().length > 0
                  ? qtdAlimentacaoPeriodoFiltrada()[0].valor_total
                  : 0}
              </span>
              <span>ALIMENTAÇÕES</span>
            </div>
            <div className="alimentacoes-por-tipo">
              <div className="row">
                <div className="col-4">
                  {alimentacoesFormatadas.slice(0, 3)}
                </div>
                <div className="col-4">
                  {alimentacoesFormatadas.slice(3, 6)}
                </div>
                <div className="col-4">
                  {alimentacoesFormatadas.slice(6, 9)}
                </div>
              </div>
            </div>
            <div>
              <div className="row" style={{ height: "100%" }}>
                <div className="col-8 d-flex flex-column">
                  {meusErros &&
                    meusErros.map((obj, idxErros) => {
                      return (
                        <span className="mt-auto mensagem-erro" key={idxErros}>
                          {obj.erro}
                        </span>
                      );
                    })}
                </div>
                <div className="col-4 pe-0 d-flex flex-column">
                  <Botao
                    texto={textoBotaoCardLancamento(
                      quantidadeAlimentacoesLancadas,
                      solicitacaoMedicaoInicial,
                      grupo,
                      textoCabecalho,
                    )}
                    style={styleBotaoCardLancamento(
                      quantidadeAlimentacoesLancadas,
                      solicitacaoMedicaoInicial,
                      grupo,
                      textoCabecalho,
                    )}
                    className="mt-auto"
                    onClick={() => handleClickEditar()}
                    disabled={desabilitarBotaoEditar(
                      quantidadeAlimentacoesLancadas,
                      solicitacaoMedicaoInicial,
                      grupo,
                      textoCabecalho,
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};

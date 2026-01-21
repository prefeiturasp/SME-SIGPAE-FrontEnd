import { Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { PERIODO_STATUS_DE_PROGRESSO } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos/constants";
import { Botao } from "src/components/Shareable/Botao";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  PERIODO_LANCAMENTO_CEI,
} from "src/configs/constants";
import { deepCopy, ehEscolaTipoCEMEI } from "src/helpers/utilities";
import {
  desabilitarBotaoEditar,
  justificativaPeriodo,
  statusPeriodo,
  styleBotaoCardLancamento,
  textoBotaoCardLancamento,
} from "../../LancamentoPorPeriodo/helpers";
import {
  ehEmeiDaCemei,
  numeroRefeicoesDiarias,
  textoCabecalhoFormatado,
} from "../helpers";
import "./styles.scss";

export const CardLancamentoCEI = ({
  textoCabecalho = null,
  cor,
  grupo,
  solicitacaoMedicaoInicial,
  escolaInstituicao,
  quantidadeAlimentacoesLancadas,
  periodoSelecionado,
  periodosEscolaCemeiComAlunosEmei,
  tiposAlimentacao,
  uuidPeriodoEscolar,
  errosAoSalvar,
  periodosInclusaoContinua,
  periodosPermissoesLancamentosEspeciais,
}) => {
  const navigate = useNavigate();

  const periodoPermissoes = periodosPermissoesLancamentosEspeciais?.find((p) =>
    textoCabecalho.includes(p.periodo),
  );

  const ALIMENTACOES_TOTAL = [
    "Refeição",
    "Sobremesa",
    "Lanche",
    "Lanche 4h",
    "Lanche Extra",
  ];

  let alimentacoesFormatadas = [];

  const meusErros =
    errosAoSalvar &&
    typeof errosAoSalvar === "object" &&
    errosAoSalvar.length > 0 &&
    errosAoSalvar.filter((obj) =>
      [textoCabecalho].includes(obj.periodo_escolar),
    );

  const qtdAlimentacaoPeriodoFiltrada = () => {
    return quantidadeAlimentacoesLancadas.filter(
      (qtdAlimentacaoPeriodo) =>
        qtdAlimentacaoPeriodo.nome_periodo_grupo === textoCabecalho,
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

  if (
    (ehEscolaTipoCEMEI(escolaInstituicao) &&
      periodosEscolaCemeiComAlunosEmei.includes(textoCabecalho)) ||
    [
      "Programas e Projetos",
      "Solicitações de Alimentação",
      "Colaboradores",
      "Recreio nas Férias - 4 a 14 anos",
    ].includes(textoCabecalho)
  ) {
    let copyTiposAlimentacao = deepCopy(tiposAlimentacao);
    if (periodoPermissoes) {
      copyTiposAlimentacao = copyTiposAlimentacao.concat(
        periodoPermissoes.alimentacoes.map((alimentacao) => ({
          nome: alimentacao,
        })),
      );
    }
    if (textoCabecalho !== "Solicitações de Alimentação") {
      copyTiposAlimentacao = copyTiposAlimentacao.filter((alimentacao) =>
        ALIMENTACOES_TOTAL.includes(alimentacao.nome),
      );
    }
    alimentacoesFormatadas = copyTiposAlimentacao
      .sort((a, b) => a.nome > b.nome)
      .map((tipoAlimentacao, key) => (
        <div key={key} className="mb-2">
          <span style={{ color: cor }}>
            <b>{quantidadeAlimentacao(tipoAlimentacao.nome)}</b>
          </span>
          <span className="ms-1">- {tipoAlimentacao.nome}</span>
          <br />
        </div>
      ));
  }

  const getStatusPeriodo = () => {
    return statusPeriodo(
      quantidadeAlimentacoesLancadas,
      solicitacaoMedicaoInicial,
      null,
      textoCabecalho,
    );
  };

  const handleClickEditar = () => {
    navigate(
      {
        pathname: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${PERIODO_LANCAMENTO_CEI}`,
        search: `uuid=${solicitacaoMedicaoInicial.uuid}`,
      },
      {
        state: {
          periodo: textoCabecalho,
          mesAnoSelecionado: periodoSelecionado,
          status_periodo: getStatusPeriodo(),
          status_solicitacao: solicitacaoMedicaoInicial.status,
          escola: solicitacaoMedicaoInicial.escola,
          justificativa_periodo: justificativaPeriodo(
            quantidadeAlimentacoesLancadas,
            null,
            textoCabecalho,
          ),
          ehEmeiDaCemei: ehEmeiDaCemei(
            escolaInstituicao,
            periodosEscolaCemeiComAlunosEmei,
            textoCabecalho,
          ),
          uuidPeriodoEscolar: uuidPeriodoEscolar,
          tiposAlimentacao: tiposAlimentacao,
          periodosInclusaoContinua: periodosInclusaoContinua,
          grupo,
          solicitacaoMedicaoInicial: solicitacaoMedicaoInicial,
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
          className={`lancamento-por-periodo-card mt-3  ${
            meusErros && meusErros.length ? "border-danger" : ""
          }`}
          style={{ color: cor }}
        >
          <div className="wraper-periodo-status mb-2">
            <div className="periodo-cabecalho">
              {textoCabecalhoFormatado(textoCabecalho)}
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
              {ehEmeiDaCemei(
                escolaInstituicao,
                periodosEscolaCemeiComAlunosEmei,
                textoCabecalho,
              ) ||
              [
                "Programas e Projetos",
                "Solicitações de Alimentação",
                "Colaboradores",
                "Recreio nas Férias - 4 a 14 anos",
              ].includes(textoCabecalho) ? (
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
              ) : (
                <div className="row">
                  <div className="col-8">
                    <div className="mt-4 mb-2">
                      <span style={{ color: cor }}>
                        <b>
                          {qtdAlimentacaoPeriodoFiltrada().length > 0
                            ? qtdAlimentacaoPeriodoFiltrada()[0]
                                .quantidade_alunos
                            : 0}
                        </b>
                      </span>
                      <span className="ms-1">
                        - alunos atendidos com{" "}
                        {textoCabecalho.includes("Recreio")
                          ? "alimentações de Recreio nas Férias"
                          : `${numeroRefeicoesDiarias(textoCabecalho)} refeições diárias`}
                      </span>
                      <br />
                    </div>
                  </div>
                </div>
              )}
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
                      null,
                      textoCabecalho,
                    )}
                    style={styleBotaoCardLancamento(
                      quantidadeAlimentacoesLancadas,
                      solicitacaoMedicaoInicial,
                      null,
                      textoCabecalho,
                    )}
                    className="mt-auto"
                    onClick={() => handleClickEditar()}
                    disabled={desabilitarBotaoEditar(
                      quantidadeAlimentacoesLancadas,
                      solicitacaoMedicaoInicial,
                      null,
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

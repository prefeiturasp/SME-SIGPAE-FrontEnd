import { OK } from "http-status-codes";
import { get, set } from "lodash";
import moment from "moment";
import React, { useState } from "react";
import { Field } from "react-final-form";

import { InputComData } from "src/components/Shareable/DatePicker";
import { toastError } from "src/components/Shareable/Toast/dialogs";

import { getLancamentosPorMes } from "src/services/lancamentoInicial.service";

import CabecalhoDietaConvencional from "../TabelaLancamento/CabecalhoDietaConvencional";
import CabecalhoDietaConvencionalFrequencia from "../TabelaLancamento/CabecalhoDietaConvencionalFrequencia";

const Lancamentos = ({ lancamentos, panorama, totaisAbsolutos }) => {
  return (
    <div className="row">
      <div className="tabela-lancamento tabela-dieta-convencional col-4">
        <CabecalhoDietaConvencional />
        {lancamentos.map((lancamento, indice) => (
          <div
            key={indice}
            className={`linha-tabela${
              lancamento.eh_feriado_ou_fds ? " linha-tabela-fds-feriado" : ""
            }`}
          >
            <div>{lancamento.dia}</div>
            <div>{get(lancamento.lancamento, "troca")}</div>
            <div>{get(lancamento.lancamento, "merenda_seca")}</div>
            <div>{get(lancamento.lancamento, "kits_lanches")}</div>
            <div>
              {get(lancamento.lancamento, "eh_dia_de_sobremesa_doce") && (
                <input style={{ width: "35%" }} type="checkbox" checked />
              )}
            </div>
          </div>
        ))}
        <div className="linha-tabela mt-4">
          <div>Totais</div>
          <div />
          <div>{totaisAbsolutos && totaisAbsolutos.merenda_seca}</div>
          <div>{totaisAbsolutos && totaisAbsolutos.kits_lanches}</div>
          <div />
        </div>
      </div>
      <div className="tabela-lancamento tabela-dieta-convencional-frequencia col-8">
        <CabecalhoDietaConvencionalFrequencia
          panorama={panorama}
          mostrarMatriculados
        />
        {lancamentos.map(
          ({ eh_feriado_ou_fds, lancamento, quantidade_alunos }, indice) => {
            return (
              <div
                key={indice}
                className={`linha-tabela${
                  eh_feriado_ou_fds ? " linha-tabela-fds-feriado" : ""
                }`}
              >
                <div>{quantidade_alunos}</div>
                <div>{lancamento && lancamento.frequencia}</div>
                {panorama.horas_atendimento !== 5 && (
                  <div>{lancamento && lancamento.lanche_4h}</div>
                )}
                {panorama.horas_atendimento !== 4 && (
                  <div>{lancamento && lancamento.lanche}</div>
                )}
                <div>{get(lancamento, "refeicoes.0.ref_oferta")}</div>
                <div>{get(lancamento, "refeicoes.0.ref_repet")}</div>
                <div>{get(lancamento, "refeicoes.0.sob_oferta")}</div>
                <div>{get(lancamento, "refeicoes.0.sob_repet")}</div>
                {panorama.periodo === "INTEGRAL" && (
                  <>
                    <div>{get(lancamento, "refeicoes.1.ref_oferta")}</div>
                    <div>{get(lancamento, "refeicoes.1.ref_repet")}</div>
                    <div>{get(lancamento, "refeicoes.1.sob_oferta")}</div>
                    <div>{get(lancamento, "refeicoes.1.sob_repet")}</div>
                  </>
                )}
                <div style={{ wordBreak: "break-all" }}>
                  {lancamento && lancamento.observacoes}
                </div>
              </div>
            );
          }
        )}
        <div className="linha-tabela mt-4">
          <div />
          <div>{totaisAbsolutos && totaisAbsolutos.frequencia}</div>
          {panorama.horas_atendimento !== 5 && (
            <div>{totaisAbsolutos && totaisAbsolutos.lanche_4h}</div>
          )}
          {panorama.horas_atendimento !== 4 && (
            <div>{totaisAbsolutos && totaisAbsolutos.lanche}</div>
          )}
          <div>{get(totaisAbsolutos, "refeicoes.0.ref_oferta")}</div>
          <div>{get(totaisAbsolutos, "refeicoes.0.ref_repet")}</div>
          <div>{get(totaisAbsolutos, "refeicoes.0.sob_oferta")}</div>
          <div>{get(totaisAbsolutos, "refeicoes.0.sob_repet")}</div>
          {panorama.periodo === "INTEGRAL" && (
            <>
              <div>{get(totaisAbsolutos, "refeicoes.1.ref_oferta")}</div>
              <div>{get(totaisAbsolutos, "refeicoes.1.ref_repet")}</div>
              <div>{get(totaisAbsolutos, "refeicoes.1.sob_oferta")}</div>
              <div>{get(totaisAbsolutos, "refeicoes.1.sob_repet")}</div>
            </>
          )}
          <div />
        </div>
      </div>
    </div>
  );
};

const TotaisPagamento = ({ totaisPagamento }) => {
  return (
    <div className="row mt-4">
      <div className="tabela-lancamento tabela-totais-pagamento col-8 offset-4">
        <div className="linha-tabela">
          <div>Qtd. refeições para pagamento</div>
          <div>{totaisPagamento.totalRefeicoes}</div>
        </div>
        <div className="linha-tabela">
          <div>Qtd. sobremesas para pagamento</div>
          <div>{totaisPagamento.totalSobremesas}</div>
        </div>
      </div>
    </div>
  );
};

const camposPossiveis = [
  "frequencia",
  "merenda_seca",
  "kits_lanches",
  "lanche_4h",
  "lanche",
  "refeicoes.0.ref_oferta",
  "refeicoes.0.ref_repet",
  "refeicoes.0.sob_oferta",
  "refeicoes.0.sob_repet",
  "refeicoes.1.ref_oferta",
  "refeicoes.1.ref_repet",
  "refeicoes.1.sob_oferta",
  "refeicoes.1.sob_repet",
];

const calculaTotaisAbsolutos = (lancamentos) => {
  const totaisAbsolutos = {};
  for (let dadosLancamento of lancamentos) {
    const lancamento = dadosLancamento.lancamento;
    if (lancamento === null) continue;
    for (let campo of camposPossiveis) {
      const valor = get(lancamento, campo);
      if (valor) {
        set(totaisAbsolutos, campo, valor + get(totaisAbsolutos, campo, 0));
      }
    }
  }
  return totaisAbsolutos;
};

const calculaTotaisPagamento = (lancamentos, panorama) => {
  let totalRefeicoes = 0;
  let totalSobremesas = 0;
  for (let dadosLancamento of lancamentos) {
    const lancamento = dadosLancamento.lancamento;
    if (lancamento === null) continue;
    for (let refeicao of lancamento.refeicoes) {
      const somaRefeicao = refeicao.ref_oferta + refeicao.ref_repet;
      totalRefeicoes +=
        somaRefeicao > panorama.qtde_alunos
          ? panorama.qtde_alunos
          : somaRefeicao;
      const somaSobremesa = refeicao.sob_oferta + refeicao.sob_repet;
      totalSobremesas +=
        somaSobremesa > panorama.qtde_alunos
          ? panorama.qtde_alunos
          : somaSobremesa;
    }
  }
  return {
    totalRefeicoes,
    totalSobremesas,
  };
};

export default ({
  panorama,
  listagemAberta,
  setListagemAberta,
  setLoading,
}) => {
  const [lancamentos, setLancamentos] = useState([]);
  const [totaisAbsolutos, setTotaisAbsolutos] = useState({});
  const [totaisPagamento, setTotaisPagamento] = useState({});
  const onMesLancamentoChange = (value) => {
    setLoading(true);
    getLancamentosPorMes({
      escola_periodo_escolar: panorama.uuid_escola_periodo_escolar,
      mes: value,
    }).then((response) => {
      if (response.status === OK) {
        setLancamentos(response.data);
        setTotaisAbsolutos(calculaTotaisAbsolutos(response.data));
        setTotaisPagamento(calculaTotaisPagamento(response.data, panorama));
      } else {
        toastError(
          "Erro ao obter os lançamentos do mês: " + response.errorMessage
        );
      }
      setLoading(false);
    });
  };

  const toggleListagemAberta = () => {
    if (listagemAberta) {
      setLancamentos([]);
      setTotaisAbsolutos({});
      setTotaisPagamento({});
    }
    setListagemAberta(!listagemAberta);
  };
  return (
    <>
      <div className="row cabecalho-lancamentos-por-mes mt-3">
        <div>Lançamentos por mês</div>
        <div onClick={toggleListagemAberta}>
          {listagemAberta ? "Fechar" : "Abrir"}
        </div>
      </div>
      {listagemAberta && (
        <>
          <div className="row">
            <div className="col-3 data-lancamento-container">
              <Field
                component={InputComData}
                name="mes_lancamento"
                label="Mês do lançamento"
                required
                dateFormat="MM/YYYY"
                showMonthYearPicker
                showFullMonthYearPicker
                minDate={null}
                maxDate={moment()._d}
                inputOnChange={(value) => onMesLancamentoChange(value)}
              />
            </div>
          </div>
          {lancamentos.length > 0 && (
            <>
              <Lancamentos
                lancamentos={lancamentos}
                panorama={panorama}
                totaisAbsolutos={totaisAbsolutos}
              />
              <TotaisPagamento totaisPagamento={totaisPagamento} />
            </>
          )}
        </>
      )}
    </>
  );
};

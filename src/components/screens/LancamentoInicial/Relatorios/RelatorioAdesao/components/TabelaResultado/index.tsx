import ExportarResultado from "./components/ExportarResultado";
import TabelaResultadoPeriodo from "./components/TabelaResultadoPeriodo";
import { TotalAlimentacao } from "./components/TabelaResultadoPeriodo/types";

import { Props } from "./types";

export default (props: Props) => {
  const { params, filtros, resultado, exibirTitulo } = props;
  const temFiltros = filtros && Object.keys(filtros).length > 0;
  const resultadoVazio = resultado && Object.keys(resultado).length === 0;

  const renderPeriodoLancamento = (de: string, ate: string) => {
    if (!de) return null;
    if (de === ate) return <b className="text-dark">{de}</b>;
    return (
      <b className="text-dark">
        De {de} até {ate}
      </b>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-start texto-simples-verde">
        {temFiltros && exibirTitulo && (
          <>
            <b>Adesão das Alimentações Servidas</b>
            <b className="mx-2">-</b>
            {filtros.mes && <b className="text-dark">{filtros.mes} | </b>}
            {filtros.dre && <b className="text-dark">{filtros.dre} | </b>}
            {filtros.lotes && (
              <b className="text-dark">{filtros.lotes.join(", ")} | </b>
            )}
            {filtros.unidade_educacional && (
              <b className="text-dark">{filtros.unidade_educacional}</b>
            )}
            {renderPeriodoLancamento(
              filtros.periodo_lancamento_de,
              filtros.periodo_lancamento_ate
            )}
          </>
        )}
      </h2>
      {resultado && (
        <>
          <div>
            {Object.entries(resultado).map(([periodo, dados]) => (
              <TabelaResultadoPeriodo
                className="mt-4"
                key={periodo}
                periodo={periodo}
                dados={Object.entries(dados).map(
                  ([tipoAlimentacao, d]): TotalAlimentacao => ({
                    tipo_alimentacao: tipoAlimentacao,
                    total_servido: d.total_servido,
                    total_frequencia: d.total_frequencia,
                    total_adesao: d.total_adesao,
                  })
                )}
              />
            ))}
          </div>
          <ExportarResultado
            className="d-flex justify-content-end mt-5"
            params={params}
          />
        </>
      )}
      {resultadoVazio && (
        <div>
          <p>Nenhum resultado foi encontrado para esta busca.</p>
        </div>
      )}
    </div>
  );
};

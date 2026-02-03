import "src/components/Shareable/style.scss";
import { TIPO_SOLICITACAO } from "src/constants/shared";

export const Rascunhos = ({
  rascunhosInclusaoDeAlimentacao,
  removerRascunho,
  form,
  carregarRascunho,
  values,
}) => {
  return (
    <div>
      {rascunhosInclusaoDeAlimentacao.map((inclusaoDeAlimentacao, key) => {
        const { id_externo, uuid } = inclusaoDeAlimentacao;
        let backgroundColor = "#DADADA";
        return (
          <div key={key} className="draft bg-white border rounded mt-1 p-2">
            <div className="mt-2">
              <label className="bold ms-3">
                {`Inclusão de Alimentação # ${id_externo}`}
              </label>
              <span
                className="ms-3 p-1 border rounded"
                style={{ background: backgroundColor }}
              >
                {inclusaoDeAlimentacao.status}
              </span>
            </div>
            <div className="icon-draft-card float-end">
              Criado em: {inclusaoDeAlimentacao.criado_em}
              <span
                data-testid="botao-remover-rascunho"
                role="button"
                tabIndex={0}
                onClick={() =>
                  removerRascunho(
                    id_externo,
                    uuid,
                    inclusaoDeAlimentacao.quantidades_periodo
                      ? TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
                      : null,
                    form,
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removerRascunho(
                      id_externo,
                      uuid,
                      inclusaoDeAlimentacao.quantidades_periodo
                        ? TIPO_SOLICITACAO.SOLICITACAO_CONTINUA
                        : null,
                      form,
                    );
                  }
                }}
              >
                <i className="fas fa-trash" aria-hidden="true" />
              </span>
              <span
                data-testid="botao-carregar-rascunho"
                role="button"
                tabIndex={0}
                onClick={() =>
                  carregarRascunho(form, values, inclusaoDeAlimentacao)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    carregarRascunho(form, values, inclusaoDeAlimentacao);
                  }
                }}
              >
                <i className="fas fa-edit" aria-hidden="true" />
              </span>
            </div>
            <div className="ms-3">
              <p>
                {inclusaoDeAlimentacao.data_inicial
                  ? `${inclusaoDeAlimentacao.motivo.nome} -
                    (${inclusaoDeAlimentacao.data_inicial} - ${inclusaoDeAlimentacao.data_final})`
                  : `${
                      inclusaoDeAlimentacao.dias_motivos_da_inclusao_cemei
                        ? inclusaoDeAlimentacao.dias_motivos_da_inclusao_cemei
                            .length
                        : 0
                    } dia(s)`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

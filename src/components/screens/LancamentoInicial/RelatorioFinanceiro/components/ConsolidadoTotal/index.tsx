import "./style.scss";
import extenso from "extenso";
import { formataMilharDecimal, formataMilhar } from "src/helpers/utilities";
import { capitalize } from "src/helpers/utilities";
import {
  calcularFaturamentoFinal,
  tituloFaturamentoFinal,
} from "../../helpers";
import { ResumoDescontos } from "../../types";

type Props = {
  titulo: string;
  tituloQuantidade?: string;
  quantidade: number;
  tituloValor?: string;
  valor: number;
  descontos?: ResumoDescontos;
};

const valorPorExtenso = (valor: number) =>
  `(${capitalize(
    extenso(valor, {
      mode: "currency",
      locale: "br",
    }),
  )}.)`;

export function ConsolidadoTotal({
  titulo,
  tituloQuantidade = "QUANTIDADE SERVIDA (A + B + C):",
  quantidade,
  tituloValor = "VALOR DO FATURAMENTO TOTAL (A + B + C):",
  valor,
  descontos,
}: Props) {
  const exibeDescontos = Boolean(descontos?.linhas.length);
  const faturamentoFinal = exibeDescontos
    ? calcularFaturamentoFinal(valor, descontos.total)
    : 0;

  return (
    <div className="consolidado-total">
      <h2 className="consolidado-titulo">{titulo}</h2>
      <div
        className={`consolidado-conteudo${
          exibeDescontos ? " com-descontos" : ""
        }`}
      >
        <div className="bloco">
          <span className="bloco-titulo">{tituloQuantidade}</span>
          <div className="caixa quantidade">
            <span className="valor">{formataMilhar(quantidade)}</span>
            <span className="unidade">ALIMENTAÇÕES</span>
          </div>
        </div>
        <div className="bloco bloco-grande">
          <span className="bloco-titulo">{tituloValor}</span>
          <div className="caixa valor">
            <span className="valor">R$ {formataMilharDecimal(valor)}</span>
            <span className="extenso">{valorPorExtenso(valor)}</span>
          </div>
        </div>
        {exibeDescontos && (
          <>
            <div className="bloco">
              <span className="bloco-titulo">DESCONTOS TOTAIS (D)</span>
              <div className="caixa quantidade">
                <span className="valor">
                  R$ {formataMilharDecimal(descontos.total)}
                </span>
                <span className="unidade">CONFORME ITENS NAS TABELAS</span>
              </div>
            </div>
            <div className="bloco bloco-grande">
              <span className="bloco-titulo">
                {tituloFaturamentoFinal(titulo)}
              </span>
              <div className="caixa valor">
                <span className="valor">
                  R$ {formataMilharDecimal(faturamentoFinal)}
                </span>
                <span className="extenso">
                  {valorPorExtenso(faturamentoFinal)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

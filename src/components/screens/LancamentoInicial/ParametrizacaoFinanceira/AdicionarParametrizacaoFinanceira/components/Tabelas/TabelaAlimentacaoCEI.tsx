import { Table } from "antd";
import { Field } from "react-final-form";
import { AInputNumber } from "src/components/Shareable/MakeField";
import { FormApi } from "final-form";
import { ValorLinha } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { stringDecimalToNumber } from "src/helpers/parsers";
import InputText from "src/components/Shareable/Input/InputText";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  grupoSelecionado: string;
  periodo: string;
  pendencias: string[];
};

interface RecordItem {
  __str__: string;
}

type CampoValor = "valor_unitario" | "valor_unitario_reajuste";

export function TabelaAlimentacaoCEI({
  form,
  faixasEtarias,
  grupoSelecionado,
  periodo,
  pendencias,
}: Props) {
  const labelTabela =
    grupoSelecionado === "grupo_2"
      ? `CEI - Período ${periodo}`
      : `Período ${periodo}`;
  const nomeTabela = "Preço das Alimentações";
  const chaveTabela = `${nomeTabela} - ${labelTabela}`;

  const retornaTotal = (
    value: string,
    campo: CampoValor,
    registro: ValorLinha,
  ) => {
    const valorSoma = stringDecimalToNumber(
      campo === "valor_unitario"
        ? registro?.valor_unitario_reajuste
        : registro?.valor_unitario,
    );
    const valorTotal = stringDecimalToNumber(value) + valorSoma;
    return valorTotal ? String(valorTotal).replace(".", ",") : undefined;
  };

  const atualizaPendencias = (record: RecordItem, valorFormatado: string) => {
    pendencias.forEach((e) => {
      const chaveTabela = `${e} - ${labelTabela}`;

      form.change(
        `tabelas[${chaveTabela}].${record.__str__}.valor_unitario`,
        valorFormatado,
      );

      const percentualAcrescimo =
        form.getState().values.tabelas[chaveTabela]?.[record.__str__]
          ?.percentual_acrescimo || "0";
      const valorUnitarioTotal =
        stringDecimalToNumber(valorFormatado) *
        (1 + stringDecimalToNumber(percentualAcrescimo) / 100);

      form.change(
        `tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`,
        valorUnitarioTotal.toFixed(2),
      );
    });
  };

  const atualizarValoresTabela = (
    form: FormApi<any, any>,
    record: RecordItem,
    value: string,
    campo: CampoValor,
  ) => {
    const tabelas = form.getState().values.tabelas;
    const registro = tabelas?.[chaveTabela]?.[record.__str__];
    const valorFormatado = retornaTotal(value, campo, registro);

    form.change(
      `tabelas[${chaveTabela}].${record.__str__}.${campo}`,
      value ?? null,
    );
    form.change(
      `tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`,
      valorFormatado,
    );
    atualizaPendencias(record, valorFormatado);
  };

  return (
    <div className="row mt-5">
      <div className="col">
        <h2 className="text-start texto-simples-verde fw-bold mb-3">
          {nomeTabela} -{" "}
          <span className={`titulo-tag periodo-${periodo.toLowerCase()}`}>
            {labelTabela}
          </span>
        </h2>

        <Table pagination={false} bordered dataSource={faixasEtarias}>
          <Table.Column
            title="Faixas Etárias"
            dataIndex="__str__"
            key="__str__"
            render={(value, record: any) => (
              <div>
                <p className="fw-bold mb-0">{value}</p>
                <Field
                  component="input"
                  name={`tabelas[${chaveTabela}].${record.__str__}.faixa_etaria`}
                  type="hidden"
                  defaultValue={record.uuid}
                />
              </div>
            )}
          />
          <Table.Column
            title="Valor Unitário"
            dataIndex="valor_unitario"
            key="valor_unitario"
            render={(_, record: any) => (
              <Field
                component={InputText}
                name={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) =>
                  atualizarValoresTabela(
                    form,
                    record,
                    e.target.value,
                    "valor_unitario",
                  )
                }
              />
            )}
          />
          <Table.Column
            title="Valor Unitário Reajuste"
            dataIndex="valor_unitario_reajuste"
            key="valor_unitario_reajuste"
            render={(_, record: any) => (
              <Field
                component={InputText}
                name={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario_reajuste`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                inputOnChange={(e) =>
                  atualizarValoresTabela(
                    form,
                    record,
                    e.target.value,
                    "valor_unitario_reajuste",
                  )
                }
              />
            )}
          />
          <Table.Column
            title="Valor Total"
            dataIndex="valor_unitario_total"
            key="valor_unitario_total"
            render={(_, record: any) => (
              <Field
                component={AInputNumber}
                name={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`}
                placeholder="0,00"
                disabled
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
}

import { Table } from "antd";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import { stringDecimalToNumber } from "src/helpers/parsers";
import InputText from "src/components/Shareable/Input/InputText";
import { formatarTotal, retornaTotal } from "../../helpers";
import { CampoValor } from "src/services/medicaoInicial/parametrizacao_financeira.interface";

type Props = {
  form: FormApi<any, any>;
  faixasEtarias: Array<any>;
  grupoSelecionado: string;
  periodo: string;
  pendencias: string[];
  bloqueiaEdicao?: boolean;
};

interface RecordItem {
  __str__: string;
}

export function TabelaAlimentacaoCEI({
  form,
  faixasEtarias,
  grupoSelecionado,
  periodo,
  pendencias,
  bloqueiaEdicao,
}: Props) {
  const labelTabela = grupoSelecionado?.toLowerCase().includes("grupo 2")
    ? `CEI - Período ${periodo}`
    : `Período ${periodo}`;
  const nomeTabela = "Preço das Alimentações";
  const chaveTabela = `${nomeTabela} - ${labelTabela}`;

  const atualizaPendencias = (
    record: RecordItem,
    valorFormatado: string | null,
  ) => {
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
        stringDecimalToNumber(valorFormatado || "0") *
        (1 + stringDecimalToNumber(percentualAcrescimo) / 100);

      form.change(
        `tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`,
        formatarTotal(valorUnitarioTotal),
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
                dataTestId={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario`}
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
                disabled={bloqueiaEdicao}
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
                dataTestId={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario_reajuste`}
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
                disabled={bloqueiaEdicao}
              />
            )}
          />
          <Table.Column
            title="Valor Total"
            dataIndex="valor_unitario_total"
            key="valor_unitario_total"
            render={(_, record: any) => (
              <Field
                component={InputText}
                dataTestId={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`}
                name={`tabelas[${chaveTabela}].${record.__str__}.valor_unitario_total`}
                placeholder="0,00"
                agrupadorMilharComDecimal
                proibeLetras
                disabled
                readOnly
              />
            )}
          />
        </Table>
      </div>
    </div>
  );
}

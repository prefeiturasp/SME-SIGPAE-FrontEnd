import { Table } from "antd";
import { Field } from "react-final-form";
import { FormApi } from "final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { CampoValor } from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { formatarTotal, retornaTotal } from "../../helpers";
import { stringDecimalToNumber } from "src/helpers/parsers";

type Props = {
  form: FormApi<any, any>;
  tiposAlimentacao: Array<any>;
  grupoSelecionado: string;
  tipoTurma?: string;
  pendencias: string[];
  temaTag?: string;
};

interface RecordItem {
  nome: string;
}

export default ({
  form,
  tiposAlimentacao,
  grupoSelecionado,
  tipoTurma,
  pendencias,
  temaTag = "",
}: Props) => {
  const alimentacoes = tiposAlimentacao.map((t) => ({ ...t }));

  const nomeTabela = tipoTurma
    ? `Preço das Alimentações - ${tipoTurma}`
    : "Preço das Alimentações";

  const grupoTipo4 = grupoSelecionado.toLowerCase().includes("grupo 4");

  const atualizaPendencias = (
    record: RecordItem,
    valorFormatado: string | null,
  ) => {
    pendencias.forEach((e) => {
      let nome = record.nome;
      if (grupoTipo4 && record.nome.includes("Refeição"))
        nome = nome.replace("- ", "- Dieta Enteral - ");

      form.change(`tabelas[${e}].${nome}.valor_unitario`, valorFormatado);

      const percentualAcrescimo =
        form.getState().values.tabelas[e]?.[nome]?.percentual_acrescimo || "0";
      const valorUnitarioTotal =
        stringDecimalToNumber(valorFormatado || "0") *
        (1 + stringDecimalToNumber(percentualAcrescimo) / 100);

      form.change(
        `tabelas[${e}].${nome}.valor_unitario_total`,
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
    const registro = tabelas?.[nomeTabela]?.[record.nome];
    const valorFormatado = retornaTotal(value, campo, registro);

    form.change(
      `tabelas[${nomeTabela}].${record.nome}.${campo}`,
      value ?? null,
    );
    form.change(
      `tabelas[${nomeTabela}].${record.nome}.valor_unitario_total`,
      valorFormatado,
    );
    atualizaPendencias(record, valorFormatado);
  };

  return (
    <div className="row mt-5">
      <div className="col">
        {["grupo 2", "grupo 5"].some((grupo) =>
          grupoSelecionado.toLowerCase().includes(grupo),
        ) && tipoTurma ? (
          <h2 className="text-start texto-simples-verde fw-bold mb-3">
            Preço das Alimentações -{" "}
            <span className={`titulo-tag ${temaTag}`}>{tipoTurma}</span>
          </h2>
        ) : (
          <h2 className="text-start texto-simples-verde fw-bold">
            Preço das Alimentações
          </h2>
        )}
        <Table pagination={false} bordered dataSource={alimentacoes}>
          <Table.Column
            title="Tipo de Alimentação"
            dataIndex="nome"
            key="nome"
            render={(value, record: any) => {
              return (
                <div>
                  <p className="fw-bold mb-0">
                    {value} {record.grupo && `- ${record.grupo}`}
                  </p>
                  <Field
                    component="input"
                    name={`tabelas[${nomeTabela}].${value}.tipo_alimentacao`}
                    type="hidden"
                    defaultValue={record.uuid}
                  />
                </div>
              );
            }}
          />
          <Table.Column
            title="Valor Unitário"
            dataIndex="valor_unitario"
            key="valor_unitario"
            render={(_, record: any) => (
              <Field
                component={InputText}
                dataTestId={`tabelas[${nomeTabela}].${record.nome}.valor_unitario`}
                name={`tabelas[${nomeTabela}].${record.nome}.valor_unitario`}
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
                dataTestId={`tabelas[${nomeTabela}].${record.nome}.valor_unitario_reajuste`}
                name={`tabelas[${nomeTabela}].${record.nome}.valor_unitario_reajuste`}
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
                component={InputText}
                dataTestId={`tabelas[${nomeTabela}].${record.nome}.valor_unitario_total`}
                name={`tabelas[${nomeTabela}].${record.nome}.valor_unitario_total`}
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
};

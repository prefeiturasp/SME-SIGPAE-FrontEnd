import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Field } from "react-final-form";
import "./styles.scss";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { getListaCompletaProdutosLogistica } from "../../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../../helpers/autoCompleteSelect";
import { getListaCronogramasPraCadastro } from "../../../../../../../services/cronograma.service";
import {
  DocsRecebimentoRelatorio,
  EmpresaFiltros,
  FiltrosRelatorioDocRecebimento,
} from "../../interfaces";
import { getEmpresasCronograma } from "src/services/terceirizada.service";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import { ProdutoLogistica } from "src/interfaces/produto.interface";
import { CronogramaSimples } from "src/interfaces/pre_recebimento.interface";

interface Props {
  setFiltros: Dispatch<SetStateAction<FiltrosRelatorioDocRecebimento>>;
  setCarregando: Dispatch<SetStateAction<boolean>>;
  setObjetos: Dispatch<SetStateAction<DocsRecebimentoRelatorio[]>>;
  setConsultaRealizada?: Dispatch<SetStateAction<boolean>>;
}

const Filtros: React.FC<Props> = ({
  setFiltros,
  setCarregando,
  setObjetos,
  setConsultaRealizada,
}) => {
  const [fornecedores, setFornecedores] = useState<Array<EmpresaFiltros>>([]);
  const [listaProdutos, setListaProdutos] = useState<Array<ProdutoLogistica>>(
    [],
  );
  const [dadosCronogramas, setDadosCronogramas] = useState<
    Array<CronogramaSimples>
  >([]);

  const buscaFornecedores = async () => {
    const response = await getEmpresasCronograma();
    setFornecedores(
      response.data.results.map((fornecedor: EmpresaFiltros) => ({
        value: fornecedor.uuid,
        label: fornecedor.nome_fantasia,
      })),
    );
  };

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };

  const buscarDadosCronogramas = async (): Promise<void> => {
    const response = await getListaCronogramasPraCadastro();
    setDadosCronogramas(response.data.results);
  };

  const onSubmit = (values: Record<string, any>): void => {
    let filtros = { ...values };
    setFiltros(filtros);
  };

  const onClear = () => {
    setConsultaRealizada(false);
    setObjetos([]);
    setFiltros({});
  };

  useEffect(() => {
    (async () => {
      setCarregando(true);
      await Promise.all([
        buscaFornecedores(),
        buscarListaProdutos(),
        buscarDadosCronogramas(),
      ]);
      setCarregando(false);
    })();
  }, []);

  return (
    <div className="filtros-documentos-recebimento">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-6 mt-2">
              <Field
                label="Empresa"
                component={MultiSelect}
                name="empresa"
                multiple
                nomeDoItemNoPlural="empresas"
                options={fornecedores}
                placeholder="Selecione uma ou mais Empresas"
                pluralFeminino={true}
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  listaProdutos.map((e) => e.nome),
                  values.nome_produto,
                  true,
                )}
                label="Filtrar por Produto"
                name="nome_produto"
                placeholder="Selecione um Produto"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  dadosCronogramas.map((e) => e.numero),
                  values.numero,
                  true,
                )}
                label="Filtrar por Nº do Cronograma"
                name="numero_cronograma"
                placeholder="Selecione um cronograma"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={MultiSelect}
                disableSearch
                options={[
                  {
                    label: "Enviado para Análise",
                    value: "ENVIADO_PARA_ANALISE",
                  },
                  {
                    label: "Enviado para Correção",
                    value: "ENVIADO_PARA_CORRECAO",
                  },
                  { label: "Aprovado", value: "APROVADO" },
                ]}
                label="Filtrar por Status"
                name="status_documento"
                nomeDoItemNoPlural="Status"
                placeholder="Selecione os status"
                pluralFeminino={true}
              />
            </div>
          </div>
        )}
      </CollapseFiltros>
    </div>
  );
};

export default Filtros;

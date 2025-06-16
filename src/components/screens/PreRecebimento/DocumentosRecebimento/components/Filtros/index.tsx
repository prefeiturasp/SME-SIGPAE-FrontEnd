import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import "./styles.scss";
import { NavLink } from "react-router-dom";
import {
  CADASTRO_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "../../../../../../configs/constants";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import { InputComData } from "src/components/Shareable/DatePicker";
import { getListaCronogramasPraCadastro } from "../../../../../../services/cronograma.service";
import { getListaCompletaProdutosLogistica } from "../../../../../../services/produto.service";
import { getListaFiltradaAutoCompleteSelect } from "../../../../../../helpers/autoCompleteSelect";
import { FiltrosDocumentosRecebimento } from "../../interfaces";
import { ProdutoLogistica } from "interfaces/produto.interface";
import {
  CronogramaSimples,
  DocumentosRecebimento,
} from "interfaces/pre_recebimento.interface";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";

interface Props {
  setFiltros: Dispatch<SetStateAction<FiltrosDocumentosRecebimento>>;
  setDocumentos: Dispatch<SetStateAction<DocumentosRecebimento[]>>;
  setConsultaRealizada: Dispatch<SetStateAction<boolean>>;
}

const Filtros: React.FC<Props> = ({
  setFiltros,
  setDocumentos,
  setConsultaRealizada,
}) => {
  const [dadosCronogramas, setDadosCronogramas] = useState<
    Array<CronogramaSimples>
  >([]);
  const [listaProdutos, setListaProdutos] = useState<Array<ProdutoLogistica>>(
    []
  );

  const buscarListaProdutos = async (): Promise<void> => {
    const response = await getListaCompletaProdutosLogistica();
    setListaProdutos(response.data.results);
  };

  const buscarDadosCronogramas = async (): Promise<void> => {
    const response = await getListaCronogramasPraCadastro();
    setDadosCronogramas(response.data.results);
  };

  const opcoesStatus = [
    {
      label: "Enviado para Análise",
      value: "ENVIADO_PARA_ANALISE",
    },
    {
      label: "Solicitada Correção",
      value: "ENVIADO_PARA_CORRECAO",
    },
    {
      label: "Aprovado",
      value: "APROVADO",
    },
  ];

  const onSubmit = (values: Record<string, any>): void => {
    let filtros = { ...values };
    if (values.data_criacao) {
      delete filtros.data_criacao;
      filtros.data_cadastro = moment(values.data_criacao, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
    }
    setFiltros(filtros);
  };

  const onClear = () => {
    setDocumentos([]);
    setConsultaRealizada(false);
    setFiltros({});
  };

  useEffect(() => {
    buscarDadosCronogramas();
    buscarListaProdutos();
  }, []);

  return (
    <div className="filtros-documentos-recebimento">
      <CollapseFiltros onSubmit={onSubmit} onClear={onClear}>
        {(values) => (
          <div className="row">
            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  listaProdutos.map((e) => e.nome),
                  values.nome_produto,
                  true
                )}
                label="Filtrar por Nome do Produto"
                name="nome_produto"
                placeholder="Selecione um Produto"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={AutoCompleteSelectField}
                options={getListaFiltradaAutoCompleteSelect(
                  dadosCronogramas.map((e) => e.numero),
                  values.numero_cronograma
                )}
                label="Filtrar por Nº do Cronograma"
                name="numero_cronograma"
                placeholder="Digite o Nº do Cronograma"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={MultiSelect}
                disableSearch
                options={opcoesStatus}
                label="Filtrar por Status"
                name="status"
                nomeDoItemNoPlural="Status"
                placeholder="Selecione os Status"
              />
            </div>

            <div className="col-6 mt-2">
              <Field
                component={InputComData}
                className="input-data"
                label="Filtrar por Data da Criação"
                name="data_criacao"
                placeholder="Selecione a Data de Criação"
                writable={false}
                minDate={null}
                maxDate={null}
              />
            </div>
          </div>
        )}
      </CollapseFiltros>

      <div className="pt-4 pb-4">
        <NavLink to={`/${PRE_RECEBIMENTO}/${CADASTRO_DOCUMENTOS_RECEBIMENTO}`}>
          <Botao
            texto="Cadastrar Documentos"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default Filtros;

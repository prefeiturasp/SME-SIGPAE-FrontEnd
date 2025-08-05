import { Spin } from "antd";
import CollapseFiltros from "src/components/Shareable/CollapseFiltros";
import HTTP_STATUS from "http-status-codes";
import React, { useCallback, useEffect, useState } from "react";
import { Field } from "react-final-form";
import Select from "src/components/Shareable/Select";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { InputComData } from "src/components/Shareable/DatePicker";
import moment from "moment";
import {
  addOpcaoTodas,
  usuarioEhCogestorDRE,
  usuarioEhEmpresa,
  usuarioEhEscola,
} from "src/helpers/utilities";
import { getLotesSimples } from "src/services/lote.service";
import {
  getAlergiasIntolerancias,
  getClassificacoesDietaEspecial,
  getUnidadesEducacionaisComCodEol,
} from "src/services/dietaEspecial.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { IRelatorioDietaRecreioFerias } from "../../interfaces";

interface Lote {
  uuid: string;
  nome: string;
  diretoria_regional: { nome: string; [key: string]: any };
  [key: string]: any;
}

interface opcaoMultiSelect {
  label: string;
  value: string;
}

interface FiltrosProps {
  meusDados: any;
  setDietas: (_e: IRelatorioDietaRecreioFerias[]) => void;
  setValuesForm: (_e: object) => void;
  carregaDietas: (_e: object) => Promise<void>;
  setErro: (_e: string) => void;
}

export const Filtros: React.FC<FiltrosProps> = ({
  meusDados,
  setValuesForm,
  carregaDietas,
  setErro,
  setDietas,
}) => {
  const [formInstance, setFormInstance] = useState<any>(null);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState<
    opcaoMultiSelect[]
  >([]);
  const [classificacoes, setClassificacoes] = useState<opcaoMultiSelect[]>([]);
  const [diagnosticos, setDiagnosticos] = useState<opcaoMultiSelect[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);

  const getDiagnosticos = async () => {
    const resposta = await getAlergiasIntolerancias();
    if (resposta.status === HTTP_STATUS.OK) {
      setDiagnosticos(
        addOpcaoTodas("Todos os diagnósticos").concat(
          resposta.data.map(({ id, descricao }) => ({
            value: id,
            label: descricao,
          }))
        )
      );
    } else {
      setErro("Houve um erro ao carregar Alergias e Intolerâncias");
    }
  };

  const getLotes = async () => {
    let params = {};
    if (usuarioEhEscola()) {
      params["uuid"] = meusDados.vinculo_atual.instituicao.lotes[0].uuid;
    } else if (usuarioEhCogestorDRE()) {
      params["diretoria_regional__uuid"] =
        meusDados.vinculo_atual.instituicao.uuid;
    } else if (usuarioEhEmpresa()) {
      params["terceirizada__uuid"] = meusDados.vinculo_atual.instituicao.uuid;
    }
    const resposta = await getLotesSimples(params);
    if (resposta.status === HTTP_STATUS.OK) {
      setLotes(resposta.data.results);
    } else setErro("Erro ao carregar lotes.");
  };

  const getClassificacoesDieta = async () => {
    const resposta = await getClassificacoesDietaEspecial();
    if (resposta.status === HTTP_STATUS.OK) {
      setClassificacoes(
        addOpcaoTodas("Todas as classificações").concat(
          resposta.data.map(({ id, nome }) => ({
            value: id,
            label: nome,
          }))
        )
      );
    } else setErro("Erro ao carregar classificações de dieta.");
  };

  const carregaFiltros = async () => {
    try {
      setCarregando(true);
      await Promise.all([
        getLotes(),
        getClassificacoesDieta(),
        getDiagnosticos(),
      ]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregaFiltros();
  }, []);

  const getUnidadesEducacionais = async (values: object) => {
    setUnidadesEducacionais([]);
    let data = values;
    const resposta = await getUnidadesEducacionaisComCodEol(data);
    if (resposta.status === HTTP_STATUS.OK) {
      if (resposta.data.length === 0 || resposta.data.mensagem) {
        toastError("Não existem unidades para os filtros selecionados");
      } else {
        setUnidadesEducacionais(
          addOpcaoTodas("Todas as unidades").concat(
            resposta.data.map(({ uuid, codigo_eol_escola }) => ({
              value: uuid,
              label: codigo_eol_escola,
            }))
          )
        );
      }
    } else {
      toastError("Erro ao carregar unidades educacionais.");
    }
  };

  const onSubmit = useCallback(
    async (params: object) => {
      setValuesForm(params);
      await carregaDietas(params);
    },
    [setValuesForm, carregaDietas]
  );

  const onClear = useCallback(() => {
    setValuesForm({});
    setDietas(null);
  }, [setValuesForm, setDietas]);

  return (
    <CollapseFiltros
      onSubmit={onSubmit}
      onClear={onClear}
      titulo="Filtrar Resultados"
    >
      {(values, form) => (
        <Spin tip="Carregando filtros..." spinning={carregando}>
          <>
            {!formInstance && setFormInstance(form)}
            <div className="row">
              <div className="col-4">
                <Field
                  label="DRE / Lote"
                  component={Select}
                  dataTestId="select-dre-lote"
                  name="lote"
                  required
                  placeholder="Selecione a DRE/Lote"
                  options={
                    lotes
                      ? [{ nome: "Selecione a DRE/Lote", uuid: "" }].concat(
                          lotes.map((lote) => ({
                            nome: `${lote.nome} - ${lote.diretoria_regional.nome}`,
                            uuid: lote.uuid,
                          }))
                        )
                      : []
                  }
                  naoDesabilitarPrimeiraOpcao
                  onChangeEffect={async (e) => {
                    const value = e.target.value;
                    form.change("unidades_educacionais_selecionadas", []);
                    if (value?.length === 0) setUnidadesEducacionais([]);
                    else getUnidadesEducacionais(form.getState().values);
                  }}
                />
              </div>
              <div className="col-8">
                <label className="label fw-normal pb-2 pt-2">
                  Unidades de Destino
                </label>
                <Field
                  component={MultiselectRaw}
                  name="unidades_educacionais_selecionadas"
                  placeholder="Selecione as unidades"
                  options={unidadesEducacionais}
                  selected={values.unidades_educacionais_selecionadas || []}
                  onSelectedChanged={(values: opcaoMultiSelect[]) => {
                    form.change(
                      `unidades_educacionais_selecionadas`,
                      values.map(({ value }) => value)
                    );
                  }}
                  disabled={unidadesEducacionais?.length === 0}
                />
              </div>
              <div className="col-4">
                <label className="label fw-normal pb-2 pt-2">
                  Classificação das Dietas
                </label>
                <Field
                  component={MultiselectRaw}
                  name="classificacoes_selecionadas"
                  placeholder="Selecione a classificação"
                  options={classificacoes}
                  selected={values.classificacoes_selecionadas || []}
                  onSelectedChanged={(values: opcaoMultiSelect[]) => {
                    form.change(
                      `classificacoes_selecionadas`,
                      values.map(({ value }) => value)
                    );
                  }}
                />
              </div>
              <div className="col-4">
                <Field
                  component={InputComData}
                  label="Período Atendimento da Dieta"
                  name="data_inicio"
                  className="data-inicio"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_termino
                      ? moment(values.data_termino, "DD/MM/YYYY").toDate()
                      : null
                  }
                />
              </div>
              <div className="col-4">
                <Field
                  component={InputComData}
                  label="&nbsp;"
                  name="data_fim"
                  className="data-fim"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_fim
                      ? moment(values.data_fim, "DD/MM/YYYY").toDate()
                      : null
                  }
                />
              </div>
              <div className="col-8">
                <label className="label fw-normal pb-2 pt-2">
                  Relação por Diagnóstico
                </label>
                <Field
                  component={MultiselectRaw}
                  name="alergias_intolerancias_selecionadas"
                  options={diagnosticos}
                  placeholder="Selecione as relações de diagnósticos"
                  selected={values.alergias_intolerancias_selecionadas || []}
                  onSelectedChanged={(values: opcaoMultiSelect[]) => {
                    form.change(
                      "alergias_intolerancias_selecionadas",
                      values.map(({ value }) => value)
                    );
                  }}
                />
              </div>
            </div>
          </>
        </Spin>
      )}
    </CollapseFiltros>
  );
};

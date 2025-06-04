import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import { Checkbox, Spin } from "antd";
import { FormApi } from "final-form";
import { format, parseISO } from "date-fns";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { InputComData } from "src/components/Shareable/DatePicker";
import Botao from "src/components/Shareable/Botao";
import Select from "src/components/Shareable/Select";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import {
  deepCopy,
  getAmanha,
  getError,
  maxEntreDatas,
} from "src/helpers/utilities";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolaSimples,
  getEscolasTercTotal,
} from "src/services/escola.service";
import {
  getAlimentacoesLancamentosEspeciais,
  criarPermissaoLancamentoEspecial,
  atualizarPermissaoLancamentoEspecial,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { PermissaoLancamentosEspeciaisInterface } from "interfaces/medicao_inicial.interface";

import "./style.scss";
import { NovaPermissaoInterface } from "./interfaces";

export const NovaPermissaoLancamentoEspecial: React.FC = () => {
  const { meusDados } = useContext(MeusDadosContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [erroAPI, setErroAPI] = useState("");
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState<Date>(null);
  const [diretoriasRegionais, setDiretoriasRegionais] = useState<
    { nome: string; uuid: string }[]
  >([]);
  const [carregandoDREs, setCarregandoDREs] = useState(false);
  const [carregandoEscolas, setCarregandoEscolas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [escolas, setEscolas] = useState<{ label: string; uuid: string }[]>([]);
  const [labelEscolas, setLabelEscolas] = useState<
    { label: string; value: string }[]
  >([]);
  const [periodos, setPeriodos] = useState<{ nome: string; uuid: string }[]>(
    []
  );
  const [aliLancEspeciais, setAliLancEspeciais] = useState<
    { nome: string; uuid: string }[]
  >([]);
  const [aliLancEspeciaisSelecionadas, setAliLancEspeciaisSelecionadas] =
    useState<string[]>([]);

  const ehEscolaValida = (labelEscola: string) => {
    return escolas?.find((escola) => escola.label === labelEscola);
  };

  const [valoresIniciais, setValoresIniciais] =
    useState<NovaPermissaoInterface>();

  const getDiretoriasRegionaisAsync = async () => {
    setCarregandoDREs(true);
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDiretoriasRegionais(
        response.data.results.map((dre: { nome: string; uuid: string }) => {
          return {
            nome: dre.nome,
            uuid: dre.uuid,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar DREs. Tente novamente mais tarde.");
    }
    setCarregandoDREs(false);
  };

  const getAlimentacoesLancamentosEspeciaisAsync = async () => {
    setLoading(true);
    const response = await getAlimentacoesLancamentosEspeciais();
    if (response.status === HTTP_STATUS.OK) {
      setAliLancEspeciais(
        response.data.map((alimentacao: { nome: string; uuid: string }) => {
          return {
            nome: alimentacao.nome,
            uuid: alimentacao.uuid,
          };
        })
      );
    } else {
      setErroAPI(
        "Erro ao carregar Alimentações de Lançamentos Especiais. Tente novamente mais tarde."
      );
    }
    setLoading(false);
  };

  const getEscolasTercTotalAsync = async (dreUuid: string) => {
    setCarregandoEscolas(true);
    const response = await getEscolasTercTotal({ dre: dreUuid });
    if (response.status === HTTP_STATUS.OK) {
      setEscolas(
        response.data.map(
          (escola: { uuid: string; codigo_eol: string; nome: string }) => {
            return {
              uuid: escola.uuid,
              label: `${escola.codigo_eol} - ${escola.nome}`,
            };
          }
        )
      );
      setLabelEscolas(
        response.data.map(
          (escola: { uuid: string; codigo_eol: string; nome: string }) => {
            return {
              label: `${escola.codigo_eol} - ${escola.nome}`,
              value: `${escola.codigo_eol} - ${escola.nome}`,
            };
          }
        )
      );
    } else {
      setErroAPI("Erro ao carregar escolas. Tente novamente mais tarde.");
    }
    setCarregandoEscolas(false);
  };

  const getEscolaSimplesAsync = async (labelEscola: string) => {
    setLoading(true);
    const uuidEscola = escolas.find((escola) => escola.label === labelEscola);
    if (ehEscolaValida(labelEscola) && uuidEscola) {
      const response = await getEscolaSimples(uuidEscola.uuid);
      if (response.status === HTTP_STATUS.OK) {
        const unidadeEducacional = response.data;
        setPeriodos(
          unidadeEducacional.periodos_escolares.map(
            (periodo: { nome: string; uuid: string }) => {
              return {
                nome: periodo.nome,
                uuid: periodo.uuid,
              };
            }
          )
        );
      } else {
        setErroAPI(
          "Erro ao carregar unidade educacional. Tente novamente mais tarde."
        );
      }
    }
    setLoading(false);
  };

  const getInitialValues = async () => {
    let initialValues: NovaPermissaoInterface = {
      uuid: null,
      diretoria_regional: null,
      escola: null,
      periodo_escolar: null,
      data_inicial: getAmanha(),
      data_final: null,
      alimentacoes_lancamento_especial: [],
    };

    if (location.state && location.state.permissao) {
      const permissao: PermissaoLancamentosEspeciaisInterface =
        location.state.permissao;
      await getEscolasTercTotalAsync(permissao.diretoria_regional.uuid);
      const escolaLabel = `${permissao.escola.codigo_eol} - ${permissao.escola.nome}`;
      await getEscolaSimplesAsync(escolaLabel);
      const alimentacoesPermissao =
        permissao.alimentacoes_lancamento_especial.map((ali) => ali.uuid);
      setAliLancEspeciaisSelecionadas(alimentacoesPermissao);

      initialValues = {
        uuid: permissao.uuid,
        diretoria_regional: permissao.diretoria_regional.uuid,
        escola: escolaLabel,
        periodo_escolar: permissao.periodo_escolar.uuid,
        data_inicial: permissao.data_inicial,
        data_final: permissao.data_final,
        alimentacoes_lancamento_especial: alimentacoesPermissao,
      };
    }
    setValoresIniciais(initialValues);
  };

  useEffect(() => {
    getDiretoriasRegionaisAsync();
    getAlimentacoesLancamentosEspeciaisAsync();
    getInitialValues();
  }, []);

  const onChangeCheckBox = (form: FormApi, e: CheckboxChangeEvent) => {
    let listaSelecionados: string[] = [];

    if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "2ª Refeição 1ª oferta").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "2ª Refeição 1ª oferta")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Refeição")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Refeição 1ª oferta"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Refeição"
              ).uuid
        );
      }
    } else if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Refeição").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Refeição")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "2ª Refeição 1ª oferta")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Refeição"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Refeição 1ª oferta"
              ).uuid
        );
      }
    } else if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "2ª Sobremesa 1ª oferta").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "2ª Sobremesa 1ª oferta")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Sobremesa")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Sobremesa 1ª oferta"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Sobremesa"
              ).uuid
        );
      }
    } else if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Sobremesa").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Sobremesa")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "2ª Sobremesa 1ª oferta")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Sobremesa"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Sobremesa 1ª oferta"
              ).uuid
        );
      }
    } else {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.uuid === e.target.value).uuid
        )
      ) {
        listaSelecionados = [...aliLancEspeciaisSelecionadas, e.target.value];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
            aliLancEspeciais.find((ali) => ali.uuid === e.target.value).uuid
        );
      }
    }

    form.change("alimentacoes_lancamento_especial", listaSelecionados);
    setAliLancEspeciaisSelecionadas(listaSelecionados);
  };

  const formatarValues = (values: Record<string, any>) => {
    let values_ = deepCopy(values);
    values_.escola = escolas?.find(
      (escola) => escola.label === values.escola
    )?.uuid;
    values_.criado_por = meusDados.uuid;
    if (values_?.data_inicial?.includes("-")) {
      values_.data_inicial = format(
        parseISO(values_.data_inicial),
        "dd/MM/yyy"
      );
    }
    if (values_?.data_final?.includes("-")) {
      values_.data_final = format(parseISO(values_.data_final), "dd/MM/yyy");
    }

    return values_;
  };

  const onSubmit = async (values: Record<string, any>) => {
    const payload = formatarValues(values);
    let response = undefined;
    if (values.uuid) {
      response = await atualizarPermissaoLancamentoEspecial(
        payload,
        values.uuid
      );
    } else {
      response = await criarPermissaoLancamentoEspecial(payload);
    }
    if ([HTTP_STATUS.CREATED, HTTP_STATUS.OK].includes(response.status)) {
      toastSuccess("Permissão de Lançamento Especial salva com sucesso!");
      navigate(
        "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais"
      );
    } else {
      toastError(getError(response.data));
    }
  };

  const LOADING = carregandoDREs;

  return (
    <div className="card mt-3">
      {erroAPI && <div>{erroAPI}</div>}
      <div className="card-body">
        <Spin
          tip="Carregando..."
          spinning={LOADING || carregandoEscolas || loading}
        >
          {!erroAPI && !LOADING && diretoriasRegionais && (
            <Form
              onSubmit={(values) => onSubmit(values)}
              initialValues={valoresIniciais}
            >
              {({ handleSubmit, form, values }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-4">
                      <Field
                        className="diretoria-regional-select"
                        component={Select}
                        options={[
                          { nome: "Selecione uma DRE", uuid: "" },
                          ...diretoriasRegionais,
                        ]}
                        name="diretoria_regional"
                        label="Diretoria Regional"
                        naoDesabilitarPrimeiraOpcao
                        validate={required}
                        required
                        disabled={values.uuid ? true : false}
                        onChangeEffect={(e: ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          getEscolasTercTotalAsync(value);
                        }}
                      />
                    </div>
                    <div className="col-8">
                      <Field
                        component={AutoCompleteField}
                        options={labelEscolas}
                        filterOption={(
                          inputValue: string,
                          option: { label: string }
                        ) =>
                          option!.label
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                        name="escola"
                        label="Pesquisar por Código EOL e/ou Unidade Educacional"
                        placeholder={"Selecione uma unidade educacional"}
                        required
                        disabled={
                          !values.diretoria_regional ||
                          carregandoEscolas ||
                          values.uuid
                        }
                        inputOnChange={(value: string) => {
                          getEscolaSimplesAsync(value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <Field
                        component={Select}
                        options={[
                          { nome: "Selecione o período", uuid: "" },
                          ...periodos,
                        ]}
                        name="periodo_escolar"
                        label="Período"
                        naoDesabilitarPrimeiraOpcao
                        validate={required}
                        required
                        disabled={
                          !ehEscolaValida(values.escola) ||
                          (valoresIniciais?.uuid &&
                            dataInicio &&
                            dataInicio <= new Date())
                        }
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputComData}
                        label="Data Início da Permissão"
                        name="data_inicial"
                        minDate={getAmanha()}
                        disabled={
                          !values.diretoria_regional ||
                          !ehEscolaValida(values.escola) ||
                          (valoresIniciais?.uuid &&
                            dataInicio &&
                            dataInicio <= new Date())
                        }
                        placeholder="De"
                        inputOnChange={(value: string) => {
                          if (value) {
                            const [dia, mes, ano] = value.split("/");
                            const dataInicioSelecionada = new Date(
                              Number(ano),
                              Number(mes) - 1,
                              Number(dia)
                            );
                            setDataInicio(dataInicioSelecionada);
                            if (dataFim && dataInicioSelecionada > dataFim) {
                              form.change("data_final", null);
                            }
                          } else {
                            setDataInicio(null);
                          }
                        }}
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        component={InputComData}
                        label="Data Fim da Permissão"
                        name="data_final"
                        minDate={maxEntreDatas([getAmanha(), dataInicio])}
                        disabled={
                          !values.diretoria_regional ||
                          !ehEscolaValida(values.escola) ||
                          (valoresIniciais?.uuid &&
                            dataInicio &&
                            dataFim &&
                            dataInicio <= new Date() &&
                            dataFim <= new Date())
                        }
                        placeholder="Até"
                        inputOnChange={(value: string) => {
                          if (value) {
                            if (value) {
                              const [dia, mes, ano] = value.split("/");
                              setDataFim(
                                new Date(
                                  Number(ano),
                                  Number(mes) - 1,
                                  Number(dia)
                                )
                              );
                            } else {
                              setDataFim(null);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <Field
                      component="input"
                      type="hidden"
                      name="alimentacoes_lancamento_especial"
                    />
                    <div className="titulo-permissoes-lancamentos col-3">
                      Permissões de Lançamentos Especiais:
                    </div>
                    <div className="col-9">
                      <div>
                        <Checkbox.Group
                          className="check-boxes-lancamentos-especiais"
                          value={aliLancEspeciaisSelecionadas}
                        >
                          {aliLancEspeciais.map((alimentacao) => (
                            <Checkbox
                              onChange={(e) => onChangeCheckBox(form, e)}
                              className="ck-lancamentos-especiais mb-3 me-4 ms-3"
                              key={alimentacao.uuid}
                              value={alimentacao.uuid}
                              name={`ck_lancamentos_especiais__${alimentacao.uuid}`}
                              disabled={
                                valoresIniciais?.uuid &&
                                dataInicio &&
                                dataInicio <= new Date()
                              }
                            >
                              {alimentacao.nome}
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                      </div>
                    </div>
                  </div>
                  <div className="row float-end mt-4">
                    <div className="col-12">
                      <Link
                        to={
                          "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais"
                        }
                        style={{ display: "contents" }}
                      >
                        <Botao
                          texto="Cancelar"
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="me-3"
                        />
                      </Link>
                      <Botao
                        texto="Salvar"
                        style={BUTTON_STYLE.GREEN}
                        type={BUTTON_TYPE.SUBMIT}
                        disabled={
                          !values.diretoria_regional ||
                          !ehEscolaValida(values.escola) ||
                          !values.periodo_escolar ||
                          !values.alimentacoes_lancamento_especial ||
                          !values.alimentacoes_lancamento_especial.length
                        }
                      />
                    </div>
                  </div>
                </form>
              )}
            </Form>
          )}
        </Spin>
      </div>
    </div>
  );
};

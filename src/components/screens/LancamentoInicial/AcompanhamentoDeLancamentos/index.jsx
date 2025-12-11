import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { Select as SelectAntd, Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MEDICAO_STATUS_DE_PROGRESSO } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos/constants";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { ASelect } from "src/components/Shareable/MakeField";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import { Paginacao } from "src/components/Shareable/Paginacao";
import Select from "src/components/Shareable/Select";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  CONFERENCIA_DOS_LANCAMENTOS,
  DETALHAMENTO_DO_LANCAMENTO,
  MEDICAO_INICIAL,
} from "src/configs/constants";
import { MESES, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { required } from "src/helpers/fieldValidators";
import {
  acessoModuloMedicaoRelatorioConsolidado,
  formatarOpcoesDRE,
  getError,
  getISOLocalDatetimeString,
  usuarioEhAdministradorNutriSupervisao,
  usuarioEhCODAEGabinete,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCoordenadorNutriSupervisao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
  usuarioEhMedicao,
  usuarioEhQualquerCODAE,
} from "src/helpers/utilities";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolasTercTotal,
  getGruposExistentesPorDre,
} from "src/services/escola.service";
import { getLotesSimples } from "src/services/lote.service";
import {
  getDashboardMedicaoInicialResultados,
  getDashboardMedicaoInicialTotalizadores,
  getMesesAnosSolicitacoesMedicaoinicial,
} from "src/services/medicaoInicial/dashboard.service";
import { updateSolicitacaoMedicaoInicial } from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import {
  relatorioConsolidadoMedicaoInicialXLSX,
  relatorioMedicaoInicialPDF,
  relatorioUnificadoMedicaoInicialPDF,
} from "src/services/relatorios";
import { CardMedicaoPorStatus } from "./components/CardMedicaoPorStatus";
import ModalRelatorio from "./components/ModalRelatorio";
import {
  MEDICAO_CARD_NOME_POR_STATUS_DRE,
  STATUS_RELACAO_DRE_UE,
} from "./constants";
import "./style.scss";

export const AcompanhamentoDeLancamentos = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { meusDados } = useContext(MeusDadosContext);
  const DEFAULT_STATE = usuarioEhEscolaTerceirizadaQualquerPerfil() ? [] : null;

  const [dadosDashboard, setDadosDashboard] = useState(null);
  const [statusSelecionado, setStatusSelecionado] = useState(
    searchParams.get("status"),
  );
  const [resultados, setResultados] = useState(null);
  const [mesesAnos, setMesesAnos] = useState(null);
  const [lotes, setLotes] = useState([]);
  const [tiposUnidades, setTiposUnidades] = useState(DEFAULT_STATE);
  const [nomesEscolas, setNomesEscolas] = useState(DEFAULT_STATE);
  const [diretoriasRegionais, setDiretoriasRegionais] = useState(null);
  const [diretoriaRegional, setDiretoriaRegional] = useState(
    searchParams.get("diretoria_regional"),
  );
  const [mudancaDre, setMudancaDre] = useState(false);

  const [erroAPI, setErroAPI] = useState("");
  const [loadingComFiltros, setLoadingComFiltros] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [exibirModalRelatorioUnificado, setExibirModalRelatorioUnificado] =
    useState(false);
  const [exibirModalRelatorioConsolidado, setExibirModalRelatorioConsolidado] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [initialValues, setInitialValues] = useState({
    diretoria_regional: diretoriaRegional,
    mes_ano: searchParams.get("mes_ano"),
    lotes_selecionados: searchParams.get("lotes")
      ? searchParams.get("lotes").split(",")
      : null,
    tipo_unidade: searchParams.get("tipo_unidade"),
    escola: searchParams.get("escola"),
    ocorrencias: null,
  });

  const [gruposHabilitadosPorDre, setGruposHabilitadosPorDre] = useState({});
  const PAGE_SIZE = 10;

  const getDashboardMedicaoInicialAsync = async (params = {}) => {
    if (Object.keys(params).length === 0) {
      params = initialValues;
    }

    setLoadingComFiltros(true);
    if (diretoriaRegional)
      params = {
        ...params,
        dre: diretoriaRegional,
      };
    if (!["true", "false"].includes(params.ocorrencias))
      delete params.ocorrencias;

    if (
      !dadosDashboard ||
      mudancaDre ||
      (diretoriaRegional && !params.mes_ano)
    ) {
      const responseDre = await getDashboardMedicaoInicialTotalizadores({
        dre: diretoriaRegional,
      });
      if (responseDre.status !== HTTP_STATUS.OK) {
        setErroAPI(
          "Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde.",
        );
      } else {
        const dashboardResults = responseDre.data.results;
        if (
          (!usuarioEhMedicao() &&
            !usuarioEhCODAENutriManifestacao() &&
            !usuarioEhQualquerCODAE() &&
            !usuarioEhDinutreDiretoria() &&
            !usuarioEhCODAEGabinete()) ||
          diretoriaRegional
        ) {
          let NovoDashboardResults = [...dashboardResults];

          if (
            usuarioEhMedicao() ||
            usuarioEhCODAENutriManifestacao() ||
            usuarioEhQualquerCODAE() ||
            usuarioEhDinutreDiretoria() ||
            usuarioEhCODAEGabinete()
          ) {
            NovoDashboardResults = NovoDashboardResults.filter(
              (medicoes) => !STATUS_RELACAO_DRE_UE.includes(medicoes.status),
            );
          }

          if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
            NovoDashboardResults = NovoDashboardResults.filter(
              (medicoes) => medicoes.status !== "TODOS_OS_LANCAMENTOS",
            );
          }

          setDadosDashboard(NovoDashboardResults);
        }
      }
    }

    const response = await getDashboardMedicaoInicialResultados(params);
    if (response.status === HTTP_STATUS.OK) {
      if (statusSelecionado || usuarioEhEscolaTerceirizadaQualquerPerfil()) {
        setResultados(response.data.results);
      }
    } else {
      setErroAPI(
        "Erro ao carregados dashboard de medição inicial. Tente novamente mais tarde.",
      );
    }
    setLoadingComFiltros(false);
    setMudancaDre(false);
  };

  const atualizaSolicitacaoMedicaoInicial = async (solicitacao) => {
    setLoadingComFiltros(true);
    let payload = new FormData();
    payload.append("dre_ciencia_correcao_data", getISOLocalDatetimeString());
    const response = await updateSolicitacaoMedicaoInicial(
      solicitacao.uuid,
      payload,
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Assinatura confirmada com sucesso!");
    } else {
      setLoadingComFiltros(false);
      toastError(getError(response.data));
    }
  };

  const desabilitaExportarPDF = (dado) => {
    return (
      (usuarioEhMedicao() || usuarioEhDRE()) &&
      dado.status === "Corrigido para CODAE" &&
      !dado.dre_ciencia_correcao_data
    );
  };

  const DREPrecisaDarCiencia = (dado) => {
    return (
      (usuarioEhMedicao() || usuarioEhDRE()) &&
      dado.status === "Corrigido para CODAE" &&
      !dado.dre_ciencia_correcao_data &&
      dado.todas_medicoes_e_ocorrencia_aprovados_por_medicao
    );
  };

  const getMesesAnosSolicitacoesMedicaoinicialAsync = async () => {
    const response = await getMesesAnosSolicitacoesMedicaoinicial({
      dre: diretoriaRegional,
    });
    if (response.status === HTTP_STATUS.OK) {
      setMesesAnos(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar meses/anos das solicitações de medição inicial. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    if (diretoriasRegionais && mesesAnos && tiposUnidades) {
      setIsLoading(false);
    }
  }, [diretoriasRegionais, mesesAnos, tiposUnidades]);

  useEffect(() => {
    const getTiposUnidadeEscolarAsync = async () => {
      const response = await getTiposUnidadeEscolar();
      if (response.status === HTTP_STATUS.OK) {
        setTiposUnidades(response.data.results);
      } else {
        setErroAPI(
          "Erro ao carregar tipos de unidades. Tente novamente mais tarde.",
        );
      }
    };
    setCurrentPage(1);

    getMesesAnosSolicitacoesMedicaoinicialAsync();

    if (!usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      getTiposUnidadeEscolarAsync();
    }

    if (!usuarioEhDRE() && !usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      getDiretoriasRegionaisAsync();
    } else {
      onPageChanged(1, { status: statusSelecionado, ...initialValues });
      setDiretoriasRegionais([]);
    }
  }, []);

  useEffect(() => {
    if (!usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      const uuid = usuarioEhDRE()
        ? meusDados && meusDados.vinculo_atual.instituicao.uuid
        : diretoriaRegional;

      const getLotesAsync = async () => {
        const response = await getLotesSimples({
          diretoria_regional__uuid: uuid,
        });
        if (response.status === HTTP_STATUS.OK) {
          setLotes(response.data.results);
        } else {
          setErroAPI("Erro ao carregar lotes. Tente novamente mais tarde.");
        }
      };

      const getEscolasTrecTotalAsync = async () => {
        const response = await getEscolasTercTotal({ dre: uuid });
        if (response.status === HTTP_STATUS.OK) {
          setNomesEscolas(
            response.data.map(
              (escola) => `${escola.codigo_eol} - ${escola.nome}`,
            ),
          );
        } else {
          setErroAPI("Erro ao carregar escolas. Tente novamente mais tarde.");
        }
      };

      meusDados && uuid && getLotesAsync();
      meusDados && uuid && getEscolasTrecTotalAsync();
    }
    if (diretoriaRegional) {
      onPageChanged(currentPage, {
        status: statusSelecionado,
        ...initialValues,
      });
      getMesesAnosSolicitacoesMedicaoinicialAsync();
    }
  }, [meusDados, diretoriaRegional]);

  useEffect(() => {
    if (usuarioEhDRE() && meusDados?.vinculo_atual?.instituicao?.uuid) {
      const dreUUID = meusDados.vinculo_atual.instituicao.uuid;
      buscarGruposPorDre(dreUUID);
    }
  }, [meusDados]);

  const onPageChanged = async (page, filtros) => {
    const params = {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      ...filtros,
    };
    setCurrentPage(page);
    await getDashboardMedicaoInicialAsync(params);
  };

  const getNomesItemsFiltrado = (value) => {
    if (value) {
      let value_ = value;
      if (localStorage.getItem("tipo_perfil") === TIPO_PERFIL.ESCOLA) {
        value_ = value[0];
      }
      return nomesEscolas.filter((a) => a.includes(value_.toUpperCase()));
    }
    return [];
  };

  const getDiretoriasRegionaisAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      const { Option } = SelectAntd;
      const dres = formatarOpcoesDRE(response.data.results).map((dre) => {
        return <Option key={dre.value}>{dre.label}</Option>;
      });
      setDiretoriasRegionais(
        [
          <Option value="" key={0} hidden>
            Selecione a DRE para visualizar os resultados
          </Option>,
        ].concat(dres),
      );
    } else {
      setErroAPI("Erro ao carregar DREs");
    }
  };

  const onSubmit = (values) => {
    setCurrentPage(1);
    const filtros = { status: statusSelecionado, ...values };
    onPageChanged(1, filtros);
  };

  const resetForm = (form) => {
    let diretoria_regional =
      form.getFieldState("diretoria_regional") || undefined;
    form.reset();
    resetURL(["mes_ano", "lotes", "tipo_unidade", "escola"]);
    setInitialValues({
      diretoria_regional: diretoria_regional?.value,
    });
    setResultados(undefined);
    diretoria_regional &&
      form.change("diretoria_regional", diretoria_regional.value);
  };

  const handleClickVisualizar = (
    uuidSolicitacaoMedicao,
    escolaUuid,
    mes,
    ano,
    status,
  ) => {
    if (usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor()) {
      navigate(
        {
          pathname: `/${MEDICAO_INICIAL}/${DETALHAMENTO_DO_LANCAMENTO}`,
          search: `mes=${mes}&ano=${ano}`,
        },
        {
          state: {
            veioDoAcompanhamentoDeLancamentos: true,
            status,
          },
        },
      );
    } else {
      navigate(
        {
          pathname: `/${MEDICAO_INICIAL}/${CONFERENCIA_DOS_LANCAMENTOS}`,
          search: `uuid=${uuidSolicitacaoMedicao}`,
        },
        {
          state: {
            escolaUuid: escolaUuid,
            mes: mes,
            ano: ano,
          },
        },
      );
    }
  };

  const handleClickDownload = async (uuidSolicitacaoMedicao) => {
    const response = await relatorioMedicaoInicialPDF(uuidSolicitacaoMedicao);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
  };

  const handleSubmitRelatorio = async (
    values,
    grupoSelecionado,
    nomeRelatorio,
  ) => {
    const dre = usuarioEhDRE()
      ? meusDados && meusDados.vinculo_atual.instituicao.uuid
      : diretoriaRegional;
    const [mes, ano] = values.mes_ano ? values.mes_ano.split("_") : "";

    const lotes = values.lotes_selecionados;

    const payload = {
      dre,
      status: statusSelecionado,
      grupo_escolar: grupoSelecionado,
      mes,
      ano,
      lotes,
    };

    const funcExportarRelatorio = {
      "Relatório Unificado": relatorioUnificadoMedicaoInicialPDF,
      "Relatório Consolidado": relatorioConsolidadoMedicaoInicialXLSX,
    };

    try {
      await funcExportarRelatorio[nomeRelatorio](payload);
      setExibirModalCentralDownloads(true);
    } catch ({ response }) {
      toastError(getError(response.data));
    }
  };

  const exibirDashboard = () => {
    if (
      (usuarioEhMedicao() ||
        usuarioEhCODAENutriManifestacao() ||
        usuarioEhQualquerCODAE() ||
        usuarioEhDinutreDiretoria() ||
        usuarioEhCODAEGabinete()) &&
      loadingComFiltros
    ) {
      return !mudancaDre;
    }
    return true;
  };

  const desabilitaAcoes = (dado) => {
    return (
      dado.status ===
      MEDICAO_STATUS_DE_PROGRESSO.MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE.nome
    );
  };

  const getTooltipAcoes = (dado) => {
    if (
      dado.status ===
      MEDICAO_STATUS_DE_PROGRESSO.MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE.nome
    ) {
      return "Aguardando envio pela unidade";
    }
    return "";
  };

  const resetURL = (nomes) => {
    setSearchParams((prev) => {
      nomes.forEach((nome) => {
        prev.delete(nome);
      });
      return prev;
    });
  };

  const solicitacaoPossuiLancamentos = (dado) => {
    return !dado.sem_lancamentos;
  };

  const adicionaFiltroNaURL = (nome, valor) => {
    setSearchParams((prev) => {
      if (
        (typeof valor !== "object" && valor) ||
        (Array.isArray(valor) && valor.length > 0)
      ) {
        prev.set(nome, valor);
      } else {
        prev.delete(nome);
      }
      return prev;
    });
  };

  const formatarGrupos = (lista) => {
    const obj = {};
    lista.forEach((g) => {
      obj[g.nome] = g.habilitado;
    });
    return obj;
  };

  const buscarGruposPorDre = async (dreUUID) => {
    const response = await getGruposExistentesPorDre({ dre: dreUUID });
    if (response.status === HTTP_STATUS.OK) {
      setGruposHabilitadosPorDre(formatarGrupos(response.data.grupos));
    } else {
      toastError(getError(response));
    }
  };

  return (
    <div className="acompanhamento-de-lancamentos">
      {erroAPI && <div>{erroAPI}</div>}
      <Spin tip="Carregando..." spinning={isLoading}>
        {!erroAPI && diretoriasRegionais && mesesAnos && tiposUnidades && (
          <Form onSubmit={onSubmit} initialValues={initialValues}>
            {({ handleSubmit, form, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="card mt-3">
                  {usuarioEhMedicao() ||
                  usuarioEhCODAENutriManifestacao() ||
                  usuarioEhQualquerCODAE() ||
                  usuarioEhDinutreDiretoria() ||
                  usuarioEhCODAEGabinete() ||
                  usuarioEhEmpresaTerceirizada() ||
                  usuarioEhCoordenadorNutriSupervisao() ||
                  usuarioEhAdministradorNutriSupervisao() ? (
                    <div className="col-5">
                      <Field
                        component={ASelect}
                        showSearch
                        className="seletor-dre"
                        onChange={(value) => {
                          form.change(`diretoria_regional`, value || undefined);
                          setDiretoriaRegional(value || undefined);
                          setStatusSelecionado(null);
                          setResultados(null);
                          setMudancaDre(true);
                          adicionaFiltroNaURL("diretoria_regional", value);
                          setInitialValues((prev) => ({
                            ...prev,
                            diretoria_regional: value,
                          }));
                          buscarGruposPorDre(value);
                        }}
                        name="diretoria_regional"
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toString()
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        }
                        naoDesabilitarPrimeiraOpcao
                        disabled={!diretoriasRegionais || loadingComFiltros}
                        dataTestId="select-diretoria-regional"
                      >
                        {diretoriasRegionais}
                      </Field>
                    </div>
                  ) : null}
                  <div className="card-body">
                    <div className="d-flex row row-cols-1">
                      {exibirDashboard() &&
                        dadosDashboard &&
                        dadosDashboard.map((dadosPorStatus, key) => {
                          return (
                            <CardMedicaoPorStatus
                              key={key}
                              dados={dadosPorStatus}
                              form={form}
                              resetForm={resetForm}
                              page={currentPage}
                              onPageChanged={() =>
                                onPageChanged(1, {
                                  status: statusSelecionado,
                                  ...values,
                                })
                              }
                              setResultados={setResultados}
                              setStatusSelecionado={(status) => {
                                setStatusSelecionado(status);
                                adicionaFiltroNaURL("status", status);
                              }}
                              statusSelecionado={statusSelecionado}
                              total={dadosPorStatus.total}
                              classeCor={
                                dadosPorStatus.total &&
                                (!statusSelecionado ||
                                  statusSelecionado === dadosPorStatus.status)
                                  ? MEDICAO_CARD_NOME_POR_STATUS_DRE[
                                      dadosPorStatus.status
                                    ].cor
                                  : `cinza ${
                                      dadosPorStatus.total && "cursor-pointer"
                                    }`
                              }
                              dataTestId={dadosPorStatus.status}
                              getDashboardMedicaoInicialAsync={
                                getDashboardMedicaoInicialAsync
                              }
                            >
                              {
                                MEDICAO_CARD_NOME_POR_STATUS_DRE[
                                  dadosPorStatus.status
                                ].nome
                              }
                            </CardMedicaoPorStatus>
                          );
                        })}
                    </div>

                    <div className="text-center mt-3">
                      {!loadingComFiltros && dadosDashboard && (
                        <span>
                          Selecione os status acima para visualizar a listagem
                          detalhada
                        </span>
                      )}{" "}
                    </div>
                    {statusSelecionado &&
                      !usuarioEhEscolaTerceirizadaQualquerPerfil() && (
                        <>
                          <hr />

                          <div className="row">
                            <div className="col-4">
                              <Field
                                dataTestId="div-select-mes-referencia"
                                component={Select}
                                name="mes_ano"
                                label="Mês de referência"
                                options={[
                                  { nome: "Selecione o mês", uuid: "" },
                                ].concat(
                                  mesesAnos
                                    .filter((mesAno) =>
                                      statusSelecionado !==
                                      "TODOS_OS_LANCAMENTOS"
                                        ? mesAno.status.includes(
                                            statusSelecionado,
                                          )
                                        : true,
                                    )
                                    .map((mesAno) => ({
                                      nome: `${
                                        MESES[parseInt(mesAno.mes) - 1]
                                      } - ${mesAno.ano}`,
                                      uuid: `${mesAno.mes}_${mesAno.ano}`,
                                    })),
                                )}
                                naoDesabilitarPrimeiraOpcao
                                validate={required}
                                required
                                onChangeEffect={(e) => {
                                  adicionaFiltroNaURL(
                                    "mes_ano",
                                    e.target.value,
                                  );
                                }}
                              />
                            </div>
                            <div className="col-4">
                              <label className="mb-2">Lote</label>
                              <Field
                                component={StatefulMultiSelect}
                                name="lotes"
                                selected={values.lotes_selecionados || []}
                                options={lotes.map((lote) => ({
                                  label: lote.nome,
                                  value: lote.uuid,
                                }))}
                                onSelectedChanged={(values_) => {
                                  form.change(`lotes_selecionados`, values_);
                                  adicionaFiltroNaURL("lotes", values_);
                                }}
                                disableSearch={true}
                                overrideStrings={{
                                  selectSomeItems: "Selecione um ou mais lotes",
                                  allItemsAreSelected:
                                    "Todos os lotes estão selecionados",
                                  selectAll: "Todos",
                                }}
                              />
                            </div>
                            <div className="col-4">
                              <Field
                                component={Select}
                                name="tipo_unidade"
                                label="Tipo de unidade"
                                options={[
                                  { nome: "Selecione o tipo de UE", uuid: "" },
                                ].concat(
                                  tiposUnidades.map((tipoUnidade) => ({
                                    nome: tipoUnidade.iniciais,
                                    uuid: tipoUnidade.uuid,
                                  })),
                                )}
                                naoDesabilitarPrimeiraOpcao
                                onChangeEffect={(e) => {
                                  adicionaFiltroNaURL(
                                    "tipo_unidade",
                                    e.target.value,
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div
                            className={`row ${resultados ? "" : "ue-botoes"}`}
                          >
                            <div className="col-8">
                              <Field
                                dataSource={getNomesItemsFiltrado(
                                  values.escola,
                                )}
                                component={AutoCompleteField}
                                name="escola"
                                label="Unidade Educacional"
                                placeholder={"Digite um nome"}
                                className="input-busca-nome-item"
                                onSelect={(value) => {
                                  adicionaFiltroNaURL("escola", value);
                                }}
                              />
                            </div>
                            <div className="col-4">
                              <Field
                                dataTestId="div-select-ocorrencias"
                                component={Select}
                                name="ocorrencias"
                                label="Ocorrências"
                                options={[
                                  {
                                    nome: "Selecione a Avaliação do Serviço",
                                    uuid: "",
                                  },
                                ].concat([
                                  { uuid: null, nome: "Todos" },
                                  { uuid: false, nome: "Sem ocorrências" },
                                  { uuid: true, nome: "Com ocorrências" },
                                ])}
                                onChangeEffect={(e) => {
                                  adicionaFiltroNaURL(
                                    "ocorrencias",
                                    e.target.value,
                                  );
                                }}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-12 mt-auto text-end">
                              <Botao
                                type={BUTTON_TYPE.BUTTON}
                                onClick={() => resetForm(form)}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                texto="Limpar"
                                className="me-3"
                              />
                              <Botao
                                type={BUTTON_TYPE.SUBMIT}
                                style={BUTTON_STYLE.GREEN}
                                texto="Filtrar"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    <Spin tip="Carregando..." spinning={loadingComFiltros}>
                      {resultados && (
                        <>
                          <div className="titulo-tabela m-3">Resultados</div>
                          {resultados.dados?.length === 0 && (
                            <div>Nenhum resultado encontrado.</div>
                          )}
                          {resultados.dados?.length > 0 && (
                            <>
                              <table className="resultados">
                                <thead>
                                  <tr className="row">
                                    <th className="col-5 ps-2">
                                      {usuarioEhEscolaTerceirizadaQualquerPerfil()
                                        ? "Período do Lançamento"
                                        : "Nome da UE"}
                                    </th>
                                    {!usuarioEhEscolaTerceirizadaQualquerPerfil() && (
                                      <th className="col-1 text-center">
                                        Tipo de UE
                                      </th>
                                    )}
                                    <th
                                      className={`${
                                        !usuarioEhEscolaTerceirizadaQualquerPerfil()
                                          ? "col-2"
                                          : "col-3"
                                      } text-center`}
                                    >
                                      {usuarioEhEscolaTerceirizadaQualquerPerfil()
                                        ? "Status"
                                        : "Status do lançamento"}
                                    </th>
                                    <th className="col-2 text-center">
                                      Última atualização
                                    </th>
                                    <th className="col-2 text-center">Ações</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {resultados.dados.map((dado, key) => {
                                    return (
                                      <tr key={key} className="row">
                                        <td className="col-5 ps-2 pt-3">
                                          {usuarioEhEscolaTerceirizadaQualquerPerfil()
                                            ? dado.mes_ano
                                            : dado.escola}
                                        </td>
                                        {!usuarioEhEscolaTerceirizadaQualquerPerfil() && (
                                          <td className="col-1 text-center pt-3">
                                            {dado.tipo_unidade}
                                          </td>
                                        )}
                                        <td
                                          className={`${
                                            !usuarioEhEscolaTerceirizadaQualquerPerfil()
                                              ? "col-2"
                                              : "col-3"
                                          } text-center pt-3`}
                                        >
                                          {dado.status}
                                        </td>
                                        <td className="col-2 text-center pt-3">
                                          {dado.log_mais_recente}
                                        </td>
                                        <td
                                          className="col-2"
                                          style={{ paddingLeft: "5.25%" }}
                                        >
                                          <Botao
                                            type={BUTTON_TYPE.BUTTON}
                                            style={`${BUTTON_STYLE.GREEN_OUTLINE} border-0`}
                                            icon={BUTTON_ICON.EYE}
                                            onClick={() =>
                                              handleClickVisualizar(
                                                dado.uuid,
                                                dado.escola_uuid,
                                                dado.mes,
                                                dado.ano,
                                                dado.status,
                                              )
                                            }
                                            disabled={
                                              desabilitaAcoes(dado) &&
                                              !usuarioEhDRE()
                                            }
                                            tooltipExterno={getTooltipAcoes(
                                              dado,
                                            )}
                                          />
                                          {usuarioEhDRE() &&
                                            dado.status ===
                                              "Corrigido para CODAE" && (
                                              <Botao
                                                type={BUTTON_TYPE.BUTTON}
                                                style={`${BUTTON_STYLE.GREEN_OUTLINE} border-0`}
                                                icon={BUTTON_ICON.EDIT}
                                                onClick={async () => {
                                                  await atualizaSolicitacaoMedicaoInicial(
                                                    dado,
                                                  );
                                                  await getDashboardMedicaoInicialAsync(
                                                    {
                                                      status: statusSelecionado,
                                                      ...values,
                                                    },
                                                  );
                                                }}
                                                disabled={
                                                  !DREPrecisaDarCiencia(dado)
                                                }
                                                tooltipExterno={
                                                  DREPrecisaDarCiencia(dado) &&
                                                  "Ciente das correções"
                                                }
                                              />
                                            )}
                                          {solicitacaoPossuiLancamentos(
                                            dado,
                                          ) && (
                                            <Botao
                                              type={BUTTON_TYPE.BUTTON}
                                              style={`${BUTTON_STYLE.GREEN_OUTLINE} border-0`}
                                              icon={BUTTON_ICON.DOWNLOAD}
                                              onClick={() =>
                                                handleClickDownload(dado.uuid)
                                              }
                                              disabled={
                                                desabilitaAcoes(dado) ||
                                                desabilitaExportarPDF(dado)
                                              }
                                              tooltipExterno={
                                                getTooltipAcoes(dado) ||
                                                (desabilitaExportarPDF(dado) &&
                                                  "Só será possível exportar o PDF com as assinaturas, após a Ciência das Correções pela DRE.")
                                              }
                                            />
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                              <Paginacao
                                onChange={(page) =>
                                  onPageChanged(page, {
                                    status: statusSelecionado,
                                    ...values,
                                  })
                                }
                                total={resultados.total}
                                pageSize={PAGE_SIZE}
                                current={currentPage}
                              />

                              {statusSelecionado ===
                              "MEDICAO_APROVADA_PELA_CODAE" ? (
                                <div className="col-12 mt-4 botoes-relatorios">
                                  {(usuarioEhDRE() || usuarioEhMedicao()) && (
                                    <Botao
                                      type={BUTTON_TYPE.BUTTON}
                                      style={BUTTON_STYLE.GREEN_OUTLINE}
                                      icon={BUTTON_ICON.FILE_PDF}
                                      texto="Relatório Unificado"
                                      onClick={() =>
                                        setExibirModalRelatorioUnificado(true)
                                      }
                                    />
                                  )}
                                  {acessoModuloMedicaoRelatorioConsolidado() && (
                                    <Botao
                                      type={BUTTON_TYPE.BUTTON}
                                      style={BUTTON_STYLE.GREEN_OUTLINE}
                                      icon={BUTTON_ICON.FILE_EXCEL}
                                      texto="Relatório Consolidado"
                                      onClick={() =>
                                        setExibirModalRelatorioConsolidado(true)
                                      }
                                    />
                                  )}
                                </div>
                              ) : null}

                              <ModalSolicitacaoDownload
                                show={exibirModalCentralDownloads}
                                setShow={setExibirModalCentralDownloads}
                              />

                              <ModalRelatorio
                                show={exibirModalRelatorioUnificado}
                                onClose={() =>
                                  setExibirModalRelatorioUnificado(false)
                                }
                                onSubmit={({ grupoSelecionado }) =>
                                  handleSubmitRelatorio(
                                    values,
                                    grupoSelecionado,
                                    "Relatório Unificado",
                                  )
                                }
                                nomeRelatorio="Relatório Unificado"
                                gruposHabilitadosPorDre={
                                  gruposHabilitadosPorDre
                                }
                              />

                              <ModalRelatorio
                                show={exibirModalRelatorioConsolidado}
                                onClose={() =>
                                  setExibirModalRelatorioConsolidado(false)
                                }
                                onSubmit={({ grupoSelecionado }) =>
                                  handleSubmitRelatorio(
                                    values,
                                    grupoSelecionado,
                                    "Relatório Consolidado",
                                  )
                                }
                                nomeRelatorio="Relatório Consolidado"
                              />
                            </>
                          )}
                        </>
                      )}
                    </Spin>
                  </div>
                </div>
              </form>
            )}
          </Form>
        )}
      </Spin>
    </div>
  );
};

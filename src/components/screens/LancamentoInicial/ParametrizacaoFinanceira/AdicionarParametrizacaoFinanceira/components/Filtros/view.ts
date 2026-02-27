import { useEffect, useState, Dispatch, SetStateAction, useRef } from "react";
import { getNumerosEditais } from "src/services/edital.service";
import { getLotesSimples } from "src/services/lote.service";
import { getGrupoUnidadeEscolar } from "src/services/escola.service";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  ParametrizacaoFinanceiraPayload,
  GrupoUnidadeEscolar,
  TipoUnidade,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { SelectOption } from "src/interfaces/option.interface";
import { FormApi } from "final-form";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import { carregarValores, limparTabelas, parseDate } from "../../helpers";
import { getTiposUnidadeEscolarTiposAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import moment from "moment";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MEDICAO_INICIAL,
  PARAMETRIZACAO_FINANCEIRA,
} from "src/configs/constants";

type Props = {
  setGrupoSelecionado: Dispatch<SetStateAction<string>>;
  setEditalSelecionado: Dispatch<SetStateAction<string>>;
  setLoteSelecionado: Dispatch<SetStateAction<string>>;
  setFaixasEtarias: Dispatch<SetStateAction<Array<any>>>;
  setTiposAlimentacao: Dispatch<SetStateAction<Array<any>>>;
  setParametrizacao: Dispatch<SetStateAction<ParametrizacaoFinanceiraPayload>>;
  uuidParametrizacao: string | null;
  form: FormApi<any, any>;
};

export default ({
  setGrupoSelecionado,
  setEditalSelecionado,
  setLoteSelecionado,
  setFaixasEtarias,
  setTiposAlimentacao,
  setParametrizacao,
  uuidParametrizacao,
  form,
}: Props) => {
  const [editais, setEditais] = useState<SelectOption[]>([]);
  const [lotes, setLotes] = useState<SelectOption[]>([]);
  const [gruposUnidadesOpcoes, setGruposUnidadesOpcoes] = useState<
    SelectOption[]
  >([]);
  const [tiposUnidades, setTiposUnidades] = useState<any[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [parametrizacaoConflito, setParametrizacaoConflito] = useState<
    string | null
  >(null);

  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const getEditaisAsync = async () => {
    try {
      const { data } = await getNumerosEditais();
      setEditais(
        [{ uuid: "", nome: "Selecione um edital" }].concat(
          data.results.map((edital) => ({
            uuid: edital.uuid,
            nome: edital.numero,
          })),
        ),
      );
    } catch {
      toastError("Erro ao carregar editais. Tente novamente mais tarde.");
    }
  };

  const getLotesAsync = async () => {
    try {
      const { data } = await getLotesSimples();
      const lotes = data.results;
      const lotesOrdenados = lotes.sort((loteA, loteB) => {
        return loteA.diretoria_regional.nome < loteB.diretoria_regional.nome;
      });
      setLotes(
        [
          {
            uuid: "",
            nome: "Selecione um lote e uma DRE",
          },
        ].concat(
          lotesOrdenados.map((lote) => ({
            uuid: lote.uuid,
            nome: `${lote.nome} - ${lote.diretoria_regional.nome}`,
          })),
        ),
      );
    } catch {
      toastError("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getGruposTiposUnidades = (gruposUnidades: GrupoUnidadeEscolar[]) => {
    return gruposUnidades.map((grupo: GrupoUnidadeEscolar) => {
      const uuid = grupo.uuid;
      const nome = `${grupo.nome} (${grupo.tipos_unidades.map((e: TipoUnidade) => e.iniciais).join(", ")})`;
      return {
        uuid,
        nome,
      };
    });
  };

  const getGrupoUnidadeEscolarAsync = async () => {
    const response = await getGrupoUnidadeEscolar();
    if (response.status === 200) {
      setGruposUnidadesOpcoes(
        [
          {
            uuid: "",
            nome: "Selecione os tipos de unidades",
          },
        ].concat(getGruposTiposUnidades(response.data.results)),
      );
    } else {
      toastError(
        "Erro ao carregar grupos de unidade escolar. Tente novamente mais tarde.",
      );
    }
  };

  const getFaixasEtariasAsync = async () => {
    try {
      const { data } = await getFaixasEtarias();
      setFaixasEtarias(data.results);
    } catch {
      toastError(
        "Erro ao carregar faixas etárias. Tente novamente mais tarde.",
      );
    }
  };

  const getTiposUnidadeEscolarAsync = async () => {
    try {
      const { data } = await getTiposUnidadeEscolarTiposAlimentacao();
      setTiposUnidades(data.results);
    } catch {
      toastError(
        "Erro ao carregar tipos unidade escolar. Tente novamente mais tarde.",
      );
    }
  };

  const requisicoesPreRender = async (): Promise<void> => {
    setCarregando(true);
    Promise.all([
      getEditaisAsync(),
      getLotesAsync(),
      getGrupoUnidadeEscolarAsync(),
      setFaixasEtarias && getFaixasEtariasAsync(),
      setTiposAlimentacao && getTiposUnidadeEscolarAsync(),
      uuidParametrizacao && getParametrizacao(uuidParametrizacao),
    ]).then(() => {
      setCarregando(false);
    });
  };

  const getParametrizacao = async (uuid: string) => {
    try {
      const response =
        await ParametrizacaoFinanceiraService.getDadosParametrizacaoFinanceira(
          uuid,
        );
      const dadosTabelas = carregarValores(
        response.tabelas,
        response.grupo_unidade_escolar.nome,
      );
      const parametrizacao = {
        edital: response.edital.uuid,
        lote: response.lote.uuid,
        grupo_unidade_escolar: response.grupo_unidade_escolar.uuid,
        data_inicial: response.data_inicial,
        data_final: response.data_final,
        legenda: response.legenda,
        tabelas: dadosTabelas,
      };

      setParametrizacao(parametrizacao);
    } catch {
      toastError(
        "Erro ao carregar parametrização financeira. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  const onChangeEdital = (edital: string) => {
    form.change("edital", edital);
    setEditalSelecionado(editais.find((e) => e.uuid === edital).nome);
  };

  const onChangeLote = (lote: string) => {
    form.change("lote", lote);
    setLoteSelecionado(lotes.find((e) => e.uuid === lote).nome);
  };

  const getGruposPendentes = async (carregamento = true) => {
    try {
      const { edital, lote, grupo_unidade_escolar, data_inicial, data_final } =
        form.getState().values;

      const { results } =
        await ParametrizacaoFinanceiraService.getParametrizacoesFinanceiras(1, {
          edital,
          lote,
        });

      const grupoNome = gruposUnidadesOpcoes.find(
        (e) => e.uuid === grupo_unidade_escolar,
      ).nome;

      const nomeSelecionado = grupoNome.replace(/\s*\(.*?\)\s*/g, "").trim();

      const novoInicio = parseDate(data_inicial);
      const novoFim = parseDate(data_final);

      const parametrizacaoConflito = results.find((e) => {
        if (e.grupo_unidade_escolar.nome !== nomeSelecionado) {
          return false;
        }

        const inicioVigente = parseDate(e.data_inicial);
        const fimVigente = parseDate(e.data_final);

        if (!fimVigente && !novoFim) return true;
        if (!fimVigente) return inicioVigente <= novoFim;
        if (!novoFim) return novoInicio <= fimVigente;

        return novoInicio <= fimVigente && inicioVigente <= novoFim;
      });

      if (parametrizacaoConflito) {
        setParametrizacaoConflito(parametrizacaoConflito.uuid);
        return true;
      } else if (carregamento) {
        const numeroGrupo = grupoNome.match(/\d+/)?.[0];

        const grupoPendencias = {
          "2": ["grupo 1", "grupo 3"],
          "5": ["grupo 3", "grupo 4"],
        };

        let dadosTabelas = form.getState().values.tabelas;
        const pendencias = grupoPendencias[numeroGrupo] ?? [];
        for (const grupoPendencia of pendencias) {
          const pendencia = results.find(
            (parametrizacao) =>
              parametrizacao.grupo_unidade_escolar.nome.toLowerCase() ===
              grupoPendencia,
          );
          if (pendencia) {
            const response =
              await ParametrizacaoFinanceiraService.getDadosParametrizacaoFinanceira(
                pendencia.uuid,
              );
            const dados = carregarValores(
              response.tabelas,
              grupoNome,
              grupoPendencia,
            );

            for (const chave of Object.keys(dados)) {
              dadosTabelas = {
                ...dadosTabelas,
                [chave]: {
                  ...dadosTabelas[chave],
                  ...dados[chave],
                },
              };
            }
          }
        }

        if (Object.keys(dadosTabelas).length > 0)
          form.change("tabelas", dadosTabelas);
        return false;
      }
      return false;
    } catch {
      toastError("Erro ao carregar valores do grupo selecionado.");
    }
  };

  const onChangeTiposUnidades = (grupo: string) => {
    form.change("grupo_unidade_escolar", grupo);
    const selecionado = gruposUnidadesOpcoes.find((e) => e.uuid === grupo).nome;
    setGrupoSelecionado(selecionado);

    const match = selecionado.match(/\((.*?)\)/);
    let unidades: string[] = [];
    if (match && match[1]) {
      const tipos = match[1].split(",");
      unidades = tipos.map((item) => item.trim());
    }

    const tiposAlimentacaoUnidades: Array<SelectOption> = unidades.reduce(
      (acc, tipoUnidade) => {
        acc.push(
          ...tiposUnidades
            .find((t) => t.iniciais === tipoUnidade)
            .periodos_escolares.reduce((acc, periodo) => {
              acc.push(...periodo.tipos_alimentacao);
              return acc;
            }, []),
        );
        return acc;
      },
      [],
    );

    const tiposAlimentacaoUnicos = {};

    tiposAlimentacaoUnidades.forEach((tipoAlimentacao) => {
      tiposAlimentacaoUnicos[tipoAlimentacao.uuid] = tipoAlimentacao.nome;
    });

    const tiposAlimentacao = Object.entries(tiposAlimentacaoUnicos).map(
      ([uuid, nome]) => ({
        uuid,
        nome,
      }),
    );

    setTiposAlimentacao(tiposAlimentacao);
  };

  const inicializouRef = useRef(false);
  useEffect(() => {
    if (!uuidParametrizacao || carregando || !form) return;
    if (inicializouRef.current) return;

    const values = form.getState().values;

    if (!values?.grupo_unidade_escolar) return;

    onChangeTiposUnidades(values.grupo_unidade_escolar);

    if (values?.edital) onChangeEdital(values.edital);

    if (values?.lote) onChangeLote(values.lote);

    inicializouRef.current = true;
  }, [uuidParametrizacao, carregando, form]);

  const onChangeConflito = async (opcao: string, _form = form) => {
    try {
      const { data_inicial, data_final, tabelas, ...rest } =
        _form.getState().values;

      if (opcao === "manter") {
        toastSuccess("Parametrização Financeira mantida com sucesso!");
        navigate(`/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`);
      } else if (opcao === "encerrar_copiar") {
        const response =
          await ParametrizacaoFinanceiraService.cloneParametrizacaoFinanceira(
            parametrizacaoConflito,
            {
              data_inicial: data_inicial,
              data_final: data_final,
              tabelas,
              ...rest,
            },
          );

        if (response.uuid) {
          _form.change(
            "tabelas",
            carregarValores(
              response.tabelas,
              response.grupo_unidade_escolar.nome,
            ),
          );
          _form.change("data_inicial", moment().format("DD/MM/YYYY"));
          _form.change("data_final", null);

          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            params.set("nova_uuid", response.uuid);
            params.set("fluxo", "encerrar_copiar");
            params.delete("uuid_origem");
            return params;
          });
          setParametrizacaoConflito(null);
        } else
          toastError(
            "Erro ao encerrar e criar nova parametrização financeira.",
          );
      } else if (opcao === "encerrar_novo") {
        const tabelasLimpas = limparTabelas(tabelas);
        _form.change("tabelas", tabelasLimpas);
        _form.change("data_inicial", moment().format("DD/MM/YYYY"));
        _form.change("data_final", null);

        await ParametrizacaoFinanceiraService.editParametrizacaoFinanceira(
          parametrizacaoConflito,
          { data_final: moment().subtract(1, "day").format("YYYY-MM-DD") },
        );
        setSearchParams((prev) => {
          const params = new URLSearchParams(prev);
          params.set("fluxo", "encerrar_novo");
          params.delete("uuid_origem");
          return params;
        });
        setParametrizacaoConflito(null);
      }
    } catch {
      toastError("Ocorreu um erro inesperado");
    }
  };

  return {
    carregando,
    editais,
    lotes,
    gruposUnidadesOpcoes,
    parametrizacaoConflito,
    onChangeTiposUnidades,
    onChangeEdital,
    onChangeLote,
    onChangeConflito,
    setParametrizacaoConflito,
    getGruposPendentes,
  };
};

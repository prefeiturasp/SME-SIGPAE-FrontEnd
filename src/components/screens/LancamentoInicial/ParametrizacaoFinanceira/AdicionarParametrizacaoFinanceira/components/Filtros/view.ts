import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { getNumerosEditais } from "src/services/edital.service";
import { getLotesSimples } from "src/services/lote.service";
import { getGrupoUnidadeEscolar } from "src/services/escola.service";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  ParametrizacaoFinanceiraPayload,
  GrupoUnidadeEscolar,
  TipoUnidade,
} from "src/services/medicaoInicial/parametrizacao_financeira.interface";
import { SelectOption } from "src/interfaces/option.interface";
import { FormApi } from "final-form";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import { carregarValores } from "../../helpers";
import { getTiposUnidadeEscolarTiposAlimentacao } from "src/services/cadastroTipoAlimentacao.service";

type Props = {
  setGrupoSelecionado: Dispatch<SetStateAction<string>>;
  setEditalSelecionado: Dispatch<SetStateAction<string>>;
  setLoteSelecionado: Dispatch<SetStateAction<string>>;
  setFaixasEtarias: Dispatch<SetStateAction<Array<any>>>;
  setTiposAlimentacao: Dispatch<SetStateAction<Array<any>>>;
  setParametrizacao: Dispatch<SetStateAction<ParametrizacaoFinanceiraPayload>>;
  uuidParametrizacao: string;
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
  const [carregando, setCarregando] = useState(true);

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

  const initialEdital = uuidParametrizacao && form.getState().values?.edital;
  const onChangeEdital = (edital: string) => {
    form.change("edital", edital);
    setEditalSelecionado(editais.find((e) => e.uuid === edital).nome);
  };

  const initialLote = uuidParametrizacao && form.getState().values?.lote;
  const onChangeLote = (lote: string) => {
    form.change("lote", lote);
    setLoteSelecionado(lotes.find((e) => e.uuid === lote).nome);
  };

  const initialGrupoUnidade =
    uuidParametrizacao && form.getState().values?.grupo_unidade_escolar;

  const getGruposPendentes = async (
    setParametrizacaoConflito: (_e: string) => void,
  ) => {
    try {
      const { edital, lote, grupo_unidade_escolar } = form.getState().values;

      const { results } =
        await ParametrizacaoFinanceiraService.getParametrizacoesFinanceiras(1, {
          edital,
          lote,
        });
      const grupoNome = gruposUnidadesOpcoes.find(
        (e) => e.uuid === grupo_unidade_escolar,
      ).nome;

      const hoje = new Date();

      const parametrizacaoConflito = results.find((e) => {
        if (
          e.grupo_unidade_escolar.nome !==
          grupoNome.replace(/\s*\(.*?\)\s*/g, "").trim()
        )
          return null;

        const dataInicial = new Date(e.data_inicial);
        const dataFinal = e.data_final ? new Date(e.data_final) : null;

        const iniciou = dataInicial <= hoje;
        const naoExpirou = !dataFinal || dataFinal >= hoje;

        if (iniciou && naoExpirou) return e;
      });

      if (parametrizacaoConflito)
        setParametrizacaoConflito(parametrizacaoConflito.uuid);
      else {
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
      }
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

  useEffect(() => {
    if (uuidParametrizacao && !carregando) {
      if (initialGrupoUnidade) onChangeTiposUnidades(initialGrupoUnidade);
      if (initialEdital) onChangeEdital(initialEdital);
      if (initialLote) onChangeLote(initialLote);
    }
  }, [uuidParametrizacao, carregando]);

  return {
    carregando,
    editais,
    lotes,
    gruposUnidadesOpcoes,
    onChangeTiposUnidades,
    onChangeEdital,
    onChangeLote,
    getGruposPendentes,
  };
};

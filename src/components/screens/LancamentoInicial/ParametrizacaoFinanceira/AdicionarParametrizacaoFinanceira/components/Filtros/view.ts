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

type Props = {
  setGrupoSelecionado: Dispatch<SetStateAction<string>>;
  setFaixasEtarias: Dispatch<SetStateAction<Array<any>>>;
  setParametrizacao: Dispatch<SetStateAction<ParametrizacaoFinanceiraPayload>>;
  uuidParametrizacao: string;
  form: FormApi<any, any>;
};

export default ({
  setGrupoSelecionado,
  setFaixasEtarias,
  setParametrizacao,
  uuidParametrizacao,
  form,
}: Props) => {
  const [editais, setEditais] = useState<SelectOption[]>([]);
  const [lotes, setLotes] = useState<SelectOption[]>([]);
  const [gruposUnidadesOpcoes, setGruposUnidadesOpcoes] = useState<
    SelectOption[]
  >([]);
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
        "Erro ao carregar tipos de unidades. Tente novamente mais tarde.",
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

  const requisicoesPreRender = async (): Promise<void> => {
    setCarregando(true);
    Promise.all([
      getEditaisAsync(),
      getLotesAsync(),
      getGrupoUnidadeEscolarAsync(),
      setFaixasEtarias && getFaixasEtariasAsync(),
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
      const dadosTabelas = carregarValores(response.tabelas);
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

  const onChangeTiposUnidades = (grupo: string) => {
    form.change("grupo_unidade_escolar", grupo);
    setGrupoSelecionado(
      gruposUnidadesOpcoes.find((e) => e.uuid === grupo).nome,
    );
  };

  const initialGrupoUnidade =
    uuidParametrizacao && form.getState().values?.grupo_unidade_escolar;

  useEffect(() => {
    if (uuidParametrizacao && initialGrupoUnidade && !carregando)
      onChangeTiposUnidades(initialGrupoUnidade);
  }, [uuidParametrizacao, carregando]);

  return {
    carregando,
    editais,
    lotes,
    gruposUnidadesOpcoes,
    onChangeTiposUnidades,
  };
};

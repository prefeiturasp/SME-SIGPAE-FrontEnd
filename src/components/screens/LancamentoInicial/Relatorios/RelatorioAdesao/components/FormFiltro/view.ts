import { ChangeEvent, useContext, useEffect, useState } from "react";

import { MeusDadosContext } from "src/context/MeusDadosContext";

import {
  formatarOpcoesLote,
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "src/helpers/utilities";

import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import { getLotesSimples } from "src/services/lote.service";
import {
  getEscolasParaFiltros,
  getEscolaPeriodosEscolares,
  getEscolaTiposAlimentacao,
  buscaPeriodosEscolares,
} from "src/services/escola.service";
import { getTiposDeAlimentacao } from "src/services/cadastroTipoAlimentacao.service";
import { getMesesAnosSolicitacoesMedicaoinicial } from "src/services/medicaoInicial/dashboard.service";

import { MESES } from "src/constants/shared";

import { Args, SelectOption, MultiSelectOption, Option } from "./types";

export default ({ form, onChange }: Args) => {
  const { meusDados } = useContext(MeusDadosContext);
  const [mesesAnosOpcoes, setMesesAnosOpcoes] = useState<Array<SelectOption>>(
    []
  );
  const [diretoriasRegionaisOpcoes, setDiretoriasRegionaisOpcoes] = useState<
    Array<SelectOption>
  >([]);
  const [lotesOpcoes, setLotesOpcoes] = useState<Array<MultiSelectOption>>([]);
  const [unidadesEducacionaisOpcoes, setUnidadesEducacionaisOpcoes] = useState<
    Array<Option>
  >([]);
  const [periodosEscolaresOpcoes, setPeriodosEscolaresOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);
  const [tiposAlimentacaoOpcoes, setTiposAlimentacaoOpcoes] = useState<
    Array<MultiSelectOption>
  >([]);

  const [lotes, setLotes] = useState([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState([]);
  const [periodosEscolares, setPeriodosEscolares] = useState([]);
  const [tiposAlimentacao, setTiposAlimentacao] = useState([]);

  const [buscandoOpcoes, setBuscandoOpcoes] = useState({
    buscandoMesesAnos: false,
    buscandoDiretoriasRegionais: false,
    buscandoLotes: false,
    buscandoUnidadesEducacionais: false,
    buscandoPeriodosEscolares: false,
    buscandoTiposAlimentacao: false,
  });

  useEffect(() => {
    setBuscandoOpcoes({
      buscandoMesesAnos: true,
      buscandoDiretoriasRegionais: true,
      buscandoLotes: true,
      buscandoUnidadesEducacionais: true,
      buscandoPeriodosEscolares: true,
      buscandoTiposAlimentacao: true,
    });

    const uuidInstituicao = localStorage
      .getItem("uuid_instituicao")
      .replace(/"/g, "");
    const endpointPeriodosEscolares =
      usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
        ? getEscolaPeriodosEscolares(uuidInstituicao)
        : buscaPeriodosEscolares();
    const endpointTiposDeAlimentacao =
      usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
        ? getEscolaTiposAlimentacao(uuidInstituicao)
        : getTiposDeAlimentacao();

    Promise.all([
      getMesesAnosSolicitacoesMedicaoinicial({
        status: "MEDICAO_APROVADA_PELA_CODAE",
        eh_relatorio_adesao: true,
      }),
      getDiretoriaregionalSimplissima(),
      getLotesSimples(),
      getEscolasParaFiltros(),
      endpointPeriodosEscolares,
      endpointTiposDeAlimentacao,
    ]).then(
      ([
        responseMesesAnos,
        responseDRE,
        responseLotes,
        responseEscolas,
        responsePeriodos,
        responseAlimentacoes,
      ]) => {
        setMesesAnosOpcoes(
          formataMesesAnosOpcoes(responseMesesAnos.data.results)
        );

        setDiretoriasRegionaisOpcoes(
          formataDiretoriasRegionaisOpcoes(responseDRE.data.results)
        );

        const lotes = responseLotes.data.results;
        setLotes(lotes);
        setLotesOpcoes(formatarOpcoesLote(lotes));

        let escolas = responseEscolas.filter(
          (escola) =>
            ![
              "CEI",
              "CEI DIRET",
              "CEI INDIR",
              "CEI CEU",
              "CCI",
              "CCI/CIPS",
              "CEU CEI",
              "CEU CEMEI",
              "CEMEI",
            ].includes(escola.tipo_unidade.iniciais)
        );
        setUnidadesEducacionais(escolas);
        setUnidadesEducacionaisOpcoes(
          formataUnidadesEducacionaisOpcoes(escolas)
        );

        const periodos = formataPeriodosEscolaresOpcoes(
          usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
            ? responsePeriodos
            : responsePeriodos.data.results
        );
        setPeriodosEscolares(periodos);
        setPeriodosEscolaresOpcoes(periodos);

        const tipos = formataTiposAlimentacoesOpcoes(
          usuarioEhEscolaTerceirizadaQualquerPerfil() && uuidInstituicao
            ? responseAlimentacoes
            : responseAlimentacoes.results
        );
        setTiposAlimentacao(tipos);
        setTiposAlimentacaoOpcoes(tipos);

        form.subscribe(
          (values) => {
            if (!values.dirty) {
              let lotes_ = lotes;
              if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
                lotes_ = lotes?.filter(
                  (lote) => localStorage.getItem("escolaLoteUuid") === lote.uuid
                );
              }
              setLotesOpcoes(formatarOpcoesLote(lotes_));
              setUnidadesEducacionaisOpcoes(
                formataUnidadesEducacionaisOpcoes(escolas)
              );
              setPeriodosEscolaresOpcoes(periodos);
              setTiposAlimentacaoOpcoes(tipos);
            }
          },
          { dirty: true }
        );

        setBuscandoOpcoes({
          buscandoMesesAnos: false,
          buscandoDiretoriasRegionais: false,
          buscandoLotes: false,
          buscandoUnidadesEducacionais: false,
          buscandoPeriodosEscolares: false,
          buscandoTiposAlimentacao: false,
        });
      }
    );
  }, []);

  useEffect(() => {
    if (usuarioEhDRE()) {
      const dreUuidMeusDados = meusDados?.vinculo_atual?.instituicao.uuid;
      if (dreUuidMeusDados && lotes && unidadesEducacionais) {
        form.change("dre", dreUuidMeusDados);
        setLotesOpcoes(
          formatarOpcoesLote(
            lotes?.filter(
              (lote) => lote.diretoria_regional.uuid === dreUuidMeusDados
            )
          )
        );
        setUnidadesEducacionaisOpcoes(
          formataUnidadesEducacionaisOpcoes(
            unidadesEducacionais?.filter(
              (escola) => escola.diretoria_regional.uuid === dreUuidMeusDados
            )
          )
        );
      }
    } else if (usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      const escolaInstituicaoMeusDados = meusDados?.vinculo_atual?.instituicao;
      const dreUuidMeusDados =
        meusDados?.vinculo_atual?.instituicao?.diretoria_regional.uuid;
      const escola = unidadesEducacionais.find(
        (escola) => escola.codigo_eol === escolaInstituicaoMeusDados.codigo_eol
      );
      if (
        escolaInstituicaoMeusDados &&
        dreUuidMeusDados &&
        escola &&
        lotes &&
        unidadesEducacionais
      ) {
        form.change("dre", dreUuidMeusDados);
        setLotesOpcoes(
          formatarOpcoesLote(
            lotes?.filter((lote) => escola?.lote?.uuid === lote.uuid)
          )
        );
        setUnidadesEducacionaisOpcoes(
          formataUnidadesEducacionaisOpcoes(
            unidadesEducacionais?.filter(
              (escola) => escola.diretoria_regional.uuid === dreUuidMeusDados
            )
          )
        );
        const labelEscola = `${escola?.codigo_eol} - ${escola?.nome} - ${
          escola?.lote ? escola?.lote?.nome : ""
        }`;
        form.change("unidade_educacional", labelEscola);
        labelEscola && onChangeUnidadeEducacional(labelEscola);
        labelEscola && localStorage.setItem("labelEscolaLote", labelEscola);
        localStorage.setItem("escolaLoteUuid", escola?.lote?.uuid);
      }
    }
  }, [meusDados, lotes, unidadesEducacionais]);

  const formataMesesAnosOpcoes = (mesesAnos) => {
    return [{ nome: "Selecione o mês de referência", uuid: "" }].concat(
      mesesAnos.map((mesAno) => ({
        nome: `${MESES[parseInt(mesAno.mes) - 1]} - ${mesAno.ano}`,
        uuid: `${mesAno.mes}_${mesAno.ano}`,
      }))
    );
  };

  const formataDiretoriasRegionaisOpcoes = (dres) => {
    return [{ nome: "Selecione uma DRE", uuid: "" }].concat(dres);
  };

  const formataPeriodosEscolaresOpcoes = (periodos) => {
    return periodos.map((periodo) => ({
      label: periodo.nome,
      value: periodo.uuid,
    }));
  };

  const formataTiposAlimentacoesOpcoes = (tipos) => {
    return tipos.map((alimentacao) => ({
      label: alimentacao.nome,
      value: alimentacao.uuid,
    }));
  };

  const onChangeMesAno = (e: ChangeEvent<HTMLInputElement>) => {
    const mesAno = e.target.value;

    onChange({
      mes: mesAno
        ? mesesAnosOpcoes
            .find((m) => m.uuid === e.target.value)
            .nome.replace("-", "")
            .toUpperCase()
        : undefined,
    });
  };

  const onChangeDRE = (e: ChangeEvent<HTMLInputElement>) => {
    limpaCampos(["lotes", "unidade_educacional"]);

    const dreUUID = e.target.value;

    onChange({
      dre: dreUUID
        ? diretoriasRegionaisOpcoes.find((d) => d.uuid === dreUUID).nome
        : undefined,
      lotes: undefined,
      unidade_educacional: undefined,
    });

    if (!dreUUID) {
      setLotesOpcoes(formatarOpcoesLote(lotes));
      setUnidadesEducacionaisOpcoes(
        formataUnidadesEducacionaisOpcoes(unidadesEducacionais)
      );

      return;
    }

    setLotesOpcoes(
      formatarOpcoesLote(
        lotes.filter((lote) => lote.diretoria_regional.uuid === dreUUID)
      )
    );
    setUnidadesEducacionaisOpcoes(
      formataUnidadesEducacionaisOpcoes(
        unidadesEducacionais.filter(
          (escola) => escola.diretoria_regional.uuid === dreUUID
        )
      )
    );
  };

  const onChangeLotes = (lotes: Array<string>) => {
    if (!usuarioEhEscolaTerceirizadaQualquerPerfil()) {
      limpaCampo("unidade_educacional");
    }

    onChange({
      lotes: lotesOpcoes
        .filter((l) => lotes.includes(l.value.toString()))
        .map((l) => l.label),
      unidade_educacional: undefined,
    });

    let escolas = unidadesEducacionais;

    const dreUUID = form.getState().values.dre;
    if (dreUUID) {
      escolas = escolas.filter(
        (escola) => escola.diretoria_regional.uuid === dreUUID
      );
    }

    if (lotes.length === 0) {
      setUnidadesEducacionaisOpcoes(formataUnidadesEducacionaisOpcoes(escolas));
    } else {
      setUnidadesEducacionaisOpcoes(
        formataUnidadesEducacionaisOpcoes(
          escolas.filter(
            (escola) => escola.lote && lotes.includes(escola.lote.uuid)
          )
        )
      );
    }
  };

  const onChangeUnidadeEducacional = async (escolaLabel: string) => {
    limpaCampos(["periodos", "tipos_alimentacao"]);

    onChange({
      unidade_educacional: escolaLabel,
    });

    if (!escolaLabel) {
      setPeriodosEscolaresOpcoes(periodosEscolares);
      setTiposAlimentacaoOpcoes(tiposAlimentacao);
      return;
    }

    const escola = unidadesEducacionais.find((escola) =>
      escolaLabel.includes(escola.codigo_eol)
    );

    if (escola) {
      setBuscandoOpcoes((prev) => ({
        ...prev,
        buscandoPeriodosEscolares: true,
        buscandoTiposAlimentacao: true,
      }));

      const [periodosEscolares, tiposAlimentacao] = await Promise.all([
        getEscolaPeriodosEscolares(escola.uuid),
        getEscolaTiposAlimentacao(escola.uuid),
      ]);

      setPeriodosEscolaresOpcoes(
        formataPeriodosEscolaresOpcoes(periodosEscolares)
      );

      setTiposAlimentacaoOpcoes(
        formataTiposAlimentacoesOpcoes(tiposAlimentacao)
      );

      setBuscandoOpcoes((prev) => ({
        ...prev,
        buscandoPeriodosEscolares: false,
        buscandoTiposAlimentacao: false,
      }));
    }
  };

  const formataUnidadesEducacionaisOpcoes = (escolas): Array<Option> => {
    return [{ label: "Selecione uma Unidade Educacional", value: "" }].concat(
      escolas.map((escola): Option => {
        const label = `${escola.codigo_eol} - ${escola.nome} - ${
          escola.lote ? escola.lote.nome : ""
        }`;

        return { label, value: label };
      })
    );
  };

  const filtraUnidadesEducacionaisOpcoes = (
    inputValue: string,
    option: Option
  ) => {
    return (
      option.value &&
      option.label.toUpperCase().includes(inputValue.toUpperCase())
    );
  };

  const validaMesAno = (mesAno: string) => {
    if (!mesAno) return;

    const hoje = new Date();
    let [mesSelecionado, anoSelecionado] = mesAno.split("_");

    return new Date(Number(anoSelecionado), Number(mesSelecionado) - 1, 1) >
      hoje
      ? "Não é possível exportar o relatório com mês posterior ao atual"
      : "";
  };

  const limpaCampo = (nomeCampo: string) => {
    form.resetFieldState(nomeCampo);
    form.change(nomeCampo, undefined);
  };

  const limpaCampos = (nomeCampos: Array<string>) => {
    nomeCampos.forEach((nomeCampo) => limpaCampo(nomeCampo));
  };

  return {
    mesesAnosOpcoes,
    diretoriasRegionaisOpcoes,
    lotesOpcoes,
    unidadesEducacionaisOpcoes,
    periodosEscolaresOpcoes,
    tiposAlimentacaoOpcoes,
    onChangeMesAno,
    onChangeDRE,
    onChangeLotes,
    onChangeUnidadeEducacional,
    filtraUnidadesEducacionaisOpcoes,
    buscandoOpcoes,
    validaMesAno,
  };
};

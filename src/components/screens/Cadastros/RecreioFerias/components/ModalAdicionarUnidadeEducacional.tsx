import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Form } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import Select from "src/components/Shareable/Select";
import { required } from "src/helpers/fieldValidators";
import { ResponseGetEscolasTercTotalInterface } from "src/interfaces/responses.interface";
import {
  getTiposUnidadeEscolar,
  getVinculosTipoAlimentacaoPorTipoUnidadeEscolar,
} from "src/services/cadastroTipoAlimentacao.service";
import { getEscolasTercTotal } from "src/services/escola.service";
import { getLotesAsync } from "src/services/lote.service";
import "../../style.scss";

type ModalAdicionarUnidadeEducacionalInterface = {
  showModal: boolean;
  closeModal: () => void;
  submitting: boolean;
  setUnidadesParticipantes: React.Dispatch<React.SetStateAction<any[]>>;
  unidadesParticipantes: any[];
};

type Option = { uuid: string; nome: string };

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
  setUnidadesParticipantes,
  unidadesParticipantes,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const [lotes, setLotes] = useState<Option[]>([]);
  const [tiposUnidadesEscolares, setTiposUnidadesEscolares] = useState<
    Option[]
  >([]);
  const [tiposAlimentacaoInscritos, setTiposAlimentacaoInscritos] = useState(
    []
  );
  const [
    tiposAlimentacaoInscritosInfantil,
    setTiposAlimentacaoInscritosInfantil,
  ] = useState([]);
  const [tiposAlimentacaoColaboradores, setTiposAlimentacaoColaboradores] =
    useState([]);
  const [unidadesEducacionaisOpts, setUnidadesEducacionaisOpts] = useState([]);

  const tiposMap = useMemo(() => {
    const map: Record<string, Option> = {};
    tiposUnidadesEscolares.forEach((t) => {
      map[t.nome] = t;
    });
    return map;
  }, [tiposUnidadesEscolares]);

  useEffect(() => {
    const fetchData = async () => {
      const tipos = await getTiposUnidadeEscolar();
      const formatTipos = tipos.data.results.map((t) => ({
        nome: t.iniciais,
        uuid: t.uuid,
      }));
      setTiposUnidadesEscolares(formatTipos);
      getLotesAsync(setLotes, "uuid", "nome");
    };
    fetchData();
  }, []);

  const lotesOpts = useMemo(
    () => [{ uuid: "", nome: "Selecione a DRE/Lote" }, ...lotes],
    [lotes]
  );
  const tiposUnidadesOpts = useMemo(
    () => [
      { uuid: "", nome: "Selecione o Tipo de Unidade" },
      ...tiposUnidadesEscolares,
    ],
    [tiposUnidadesEscolares]
  );

  const unidadesEducacionaisFiltradas = useMemo(() => {
    const uuidsJaAdicionados = unidadesParticipantes.map(
      (u) => u.unidadeEducacionalUuid
    );
    return unidadesEducacionaisOpts.filter(
      (u: any) => !uuidsJaAdicionados.includes(u.value)
    );
  }, [unidadesEducacionaisOpts, unidadesParticipantes]);

  const handleBuscarUnidadesEducacionais = async (
    dreUuid: string,
    tipoUnidadeUuid: string
  ) => {
    if (!dreUuid || !tipoUnidadeUuid) return;
    const response: ResponseGetEscolasTercTotalInterface =
      await getEscolasTercTotal({
        dre: dreUuid,
        tipo_unidade: tipoUnidadeUuid,
      });
    if (response.status === 200) {
      setUnidadesEducacionaisOpts(
        response.data.map((escola) => ({
          value: escola.uuid,
          label: escola.nome,
        }))
      );
    }
  };

  const handleBuscarTipoAlimentacao = async (
    tipoUnidadeUuid: string,
    setter: any
  ) => {
    if (!tipoUnidadeUuid) return;
    const response = await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
      tipoUnidadeUuid
    );

    const results = Array.isArray(response?.results) ? response.results : [];
    const allTipos = results.flatMap((r: any) => r?.tipos_alimentacao ?? []);

    const seen = new Set<string>();
    const uniqueTipos = [];
    for (const t of allTipos) {
      const nome = t?.nome;
      if (!nome) continue;
      if (!seen.has(nome)) {
        seen.add(nome);
        uniqueTipos.push(t);
      }
    }

    setter(uniqueTipos.map((t: any) => ({ value: t.uuid, label: t.nome })));
  };

  const handleAdicionarUnidade = (values: any) => {
    const lote = lotes.find((l) => l.uuid === values.dres_lote);

    const alimentacoesInscritos = tiposAlimentacaoInscritos
      .filter((t: any) => values.tipos_alimentacao_inscritos?.includes(t.value))
      .map((t: any) => t.label);

    const alimentacoesColaboradores = tiposAlimentacaoColaboradores
      .filter((t: any) =>
        values.tipos_alimentacao_colaboradores?.includes(t.value)
      )
      .map((t: any) => t.label);

    const alimentacoesInfantil = tiposAlimentacaoInscritosInfantil
      .filter((t: any) =>
        values.tipos_alimentacao_inscritos_infantil?.includes(t.value)
      )
      .map((t: any) => t.label);

    const tipoUnidadeSelecionado = tiposUnidadesEscolares.find(
      (t: any) => t.uuid === values?.tipos_unidades
    );
    const mostrarSeletorInfantil =
      tipoUnidadeSelecionado?.nome === "CEMEI" ||
      tipoUnidadeSelecionado?.nome === "CEU CEMEI";

    const novasUnidades = values.unidades_educacionais.flatMap(
      (uuid: string) => {
        const unidade = unidadesEducacionaisOpts.find(
          (u: any) => u.value === uuid
        );

        const baseUnidade = {
          dreLoteNome: lote.nome || "",
          loteUuid: lote.uuid,
          unidadeEducacionalUuid: uuid,
          numeroInscritos: 0,
          numeroColaboradores: 0,
          liberarMedicao: true,
          unidadeEducacional: unidade?.label || "",
          alimentacaoColaboradores: alimentacoesColaboradores,
          tiposAlimentacaoColaboradoresUuids:
            values.tipos_alimentacao_colaboradores || [],
        };

        if (mostrarSeletorInfantil) {
          return [
            {
              ...baseUnidade,
              id: `${Date.now()}-${Math.random()}-CEI`,
              ceiOuEmei: "CEI",
              alimentacaoInscritos: alimentacoesInscritos,
              alimentacaoInscritosInfantil: [],
              tiposAlimentacaoInscritosUuids:
                values.tipos_alimentacao_inscritos || [],
              tiposAlimentacaoInfantilUuids: [],
            },
            {
              ...baseUnidade,
              id: `${Date.now()}-${Math.random()}-EMEI`,
              ceiOuEmei: "EMEI",
              alimentacaoInscritos: alimentacoesInfantil,
              alimentacaoInscritosInfantil: alimentacoesInfantil,
              tiposAlimentacaoInscritosUuids:
                values.tipos_alimentacao_inscritos_infantil || [],
              tiposAlimentacaoInfantilUuids:
                values.tipos_alimentacao_inscritos_infantil || [],
            },
          ];
        } else {
          return [
            {
              ...baseUnidade,
              id: `${Date.now()}-${Math.random()}`,
              alimentacaoInscritos: alimentacoesInscritos,
              alimentacaoInscritosInfantil: [],
              tiposAlimentacaoInscritosUuids:
                values.tipos_alimentacao_inscritos || [],
              tiposAlimentacaoInfantilUuids: [],
            },
          ];
        }
      }
    );

    setUnidadesParticipantes((prev) => [...novasUnidades, ...prev]);
    closeModal();
  };

  return (
    <Modal
      dialogClassName="modal-adicionar-unidades-educacionais"
      show={showModal}
      onHide={closeModal}
      data-testid="modal-adicionar-unidade"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-cadastro-edital">
          Adicionar Unidades Educacionais
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          keepDirtyOnReinitialize
          onSubmit={() => {}}
          render={({
            handleSubmit,
            values,
            form,
            submitting: formSubmitting,
          }) => {
            const hasDreLote = Boolean(values?.dres_lote);
            const hasTipoUnidade = Boolean(values?.tipos_unidades);
            const enableSeletores = hasDreLote && hasTipoUnidade;

            const tipoUnidadeSelecionado = tiposUnidadesEscolares.find(
              (t: any) => t.uuid === values?.tipos_unidades
            );
            const mostrarSeletorInfantil =
              tipoUnidadeSelecionado?.nome === "CEMEI" ||
              tipoUnidadeSelecionado?.nome === "CEU CEMEI";

            // Validação dos campos obrigatórios
            const hasUnidadesEducacionais =
              values?.unidades_educacionais &&
              values.unidades_educacionais.length > 0;

            const hasTiposAlimentacaoInscritos =
              values?.tipos_alimentacao_inscritos &&
              values.tipos_alimentacao_inscritos.length > 0;

            const hasTiposAlimentacaoInscritosInfantil =
              !mostrarSeletorInfantil ||
              (values?.tipos_alimentacao_inscritos_infantil &&
                values.tipos_alimentacao_inscritos_infantil.length > 0);

            const addDisabled =
              submitting ||
              formSubmitting ||
              !hasDreLote ||
              !hasTipoUnidade ||
              !hasUnidadesEducacionais ||
              !hasTiposAlimentacaoInscritos ||
              !hasTiposAlimentacaoInscritosInfantil;

            useEffect(() => {
              if (hasDreLote && hasTipoUnidade) {
                const lote = lotes.find((l) => l.uuid === values.dres_lote);
                const dreUuid = lote?.dreUuid;

                if (dreUuid) {
                  handleBuscarUnidadesEducacionais(
                    dreUuid,
                    values.tipos_unidades
                  );
                  handleBuscarTipoAlimentacao(
                    values.tipos_unidades,
                    setTiposAlimentacaoInscritos
                  );
                  handleBuscarTipoAlimentacao(
                    tiposMap["EMEF"]?.uuid,
                    setTiposAlimentacaoColaboradores
                  );

                  if (mostrarSeletorInfantil) {
                    handleBuscarTipoAlimentacao(
                      tiposMap["CEI DIRET"]?.uuid,
                      setTiposAlimentacaoInscritos
                    );
                    handleBuscarTipoAlimentacao(
                      tiposMap["EMEI"]?.uuid,
                      setTiposAlimentacaoInscritosInfantil
                    );
                  }
                }
              } else {
                setUnidadesEducacionaisOpts([]);
              }
            }, [values?.dres_lote, values?.tipos_unidades]);

            return (
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="w-50">
                    <Field
                      component={Select}
                      dataTestId="select-dres-lote"
                      label="DREs/LOTE"
                      name="dres_lote"
                      options={lotesOpts}
                      required
                      validate={required}
                    />
                  </div>
                  <div className="w-50">
                    <Field
                      component={Select}
                      dataTestId="select-tipos-unidades"
                      label="Tipos de Unidades"
                      name="tipos_unidades"
                      options={tiposUnidadesOpts}
                      required
                      validate={required}
                    />
                  </div>
                </div>

                <div className="row">
                  <Field
                    component={MultiselectRaw}
                    dataTestId="multiselect-unidades-educacionais"
                    label="Unidades Educacionais"
                    name="unidades_educacionais"
                    placeholder="Selecione as Unidades Educacionais"
                    options={unidadesEducacionaisFiltradas}
                    selected={values?.unidades_educacionais || []}
                    required
                    validate={required}
                    disabled={!enableSeletores}
                    onSelectedChanged={(values_) => {
                      form.change(
                        "unidades_educacionais",
                        values_.map((v) => v.value)
                      );
                    }}
                  />
                </div>

                <div className="row">
                  <div className="w-50">
                    <Field
                      component={MultiselectRaw}
                      label={`Tipos de Alimentações para Inscritos ${
                        mostrarSeletorInfantil && "CEI"
                      }`}
                      name="tipos_alimentacao_inscritos"
                      options={tiposAlimentacaoInscritos}
                      selected={values?.tipos_alimentacao_inscritos || []}
                      required
                      validate={required}
                      disabled={!enableSeletores}
                      onSelectedChanged={(values_) => {
                        form.change(
                          "tipos_alimentacao_inscritos",
                          values_.map((v) => v.value)
                        );
                      }}
                    />
                  </div>

                  <div className="w-50">
                    <Field
                      component={MultiselectRaw}
                      label="Tipos de Alimentações para Colaboradores"
                      name="tipos_alimentacao_colaboradores"
                      options={tiposAlimentacaoColaboradores}
                      selected={values?.tipos_alimentacao_colaboradores || []}
                      disabled={!enableSeletores}
                      onSelectedChanged={(values_) => {
                        form.change(
                          "tipos_alimentacao_colaboradores",
                          values_.map((v) => v.value)
                        );
                      }}
                    />
                  </div>

                  {mostrarSeletorInfantil && (
                    <div className="w-50">
                      <Field
                        component={MultiselectRaw}
                        dataTestId="multiselect-tipos-alimentacao-inscritos-infantil"
                        label="Tipos de Alimentações para Inscritos - INFANTIL"
                        name="tipos_alimentacao_inscritos_infantil"
                        options={tiposAlimentacaoInscritosInfantil}
                        selected={
                          values?.tipos_alimentacao_inscritos_infantil || []
                        }
                        required
                        validate={required}
                        disabled={!enableSeletores}
                        onSelectedChanged={(values_) => {
                          form.change(
                            "tipos_alimentacao_inscritos_infantil",
                            values_.map((v) => v.value)
                          );
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <Botao
                    texto="Cancelar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={closeModal}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="ms-3"
                  />
                  <Botao
                    texto="Adicionar"
                    dataTestId="modal-adicionar-botao"
                    type={BUTTON_TYPE.BUTTON}
                    disabled={addDisabled}
                    onClick={() => handleAdicionarUnidade(values)}
                    style={BUTTON_STYLE.GREEN}
                    className="ms-2"
                  />
                </div>
              </form>
            );
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

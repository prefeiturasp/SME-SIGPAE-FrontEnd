import { FormApi } from "final-form";
import { useEffect, useMemo, useState } from "react";
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
import "../../style.scss";
import {
  extractDreUuid,
  useAlimentacao,
  useLotes,
  useTiposUnidade,
  useUnidadesEducacionais,
} from "../hooks/useModalUnidades";

type ModalAdicionarUnidadeEducacionalInterface = {
  showModal: boolean;
  closeModal: () => void;
  submitting: boolean;
  form: FormApi<any>;
};

const TIPOS_CEMEI = ["CEMEI", "CEU CEMEI"];
const TIPOS_COM_ALIMENTACAO_FIXA_INSCRITOS = [
  "CEI",
  "CEU CEI",
  "CCI",
  "CEMEI",
  "CEU CEMEI",
];

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
  form,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const { lotes, lotesOpts } = useLotes();
  const [dreLote, setDreLote] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const [formApiRef, setFormApiRef] = useState<any>(null);

  const { tipos, tiposOpts, tiposMap } = useTiposUnidade(dreLote, lotes);
  const alimentacao = useAlimentacao();
  const { unidadesFiltradas, fetchUnidades, resetUnidades } =
    useUnidadesEducacionais(form);

  const tipoSelecionado = useMemo(
    () => tipos.find((t) => t.uuid === tipoUnidade),
    [tipos, tipoUnidade],
  );

  const isCemei = useMemo(
    () => TIPOS_CEMEI.includes(tipoSelecionado?.nome || ""),
    [tipoSelecionado],
  );

  const isTipoComAlimentacaoFixaParaInscritos = useMemo(
    () =>
      TIPOS_COM_ALIMENTACAO_FIXA_INSCRITOS.includes(
        tipoSelecionado?.nome || "",
      ),
    [tipoSelecionado],
  );

  useEffect(() => {
    if (!dreLote || !tipoUnidade) {
      alimentacao.reset();
      resetUnidades();
      return;
    }

    const lote = lotes.find((l) => l.uuid === dreLote);
    const dreUuid = extractDreUuid(lote);

    if (!dreUuid) return;

    fetchUnidades(dreUuid, tipoUnidade);
    alimentacao.loadAlimentacao(tipoUnidade, tiposMap, isCemei);
  }, [dreLote, tipoUnidade, lotes, tiposMap, isCemei]);

  useEffect(() => {
    if (
      formApiRef &&
      isTipoComAlimentacaoFixaParaInscritos &&
      alimentacao.inscritos?.length > 0
    ) {
      const opcoesFiltradas = filtrarLancheEmergencial(alimentacao.inscritos);
      const todosValores = opcoesFiltradas.map((opt: any) => opt.value);
      formApiRef.change("tipos_alimentacao_inscritos", todosValores);
    }
  }, [
    formApiRef,
    isTipoComAlimentacaoFixaParaInscritos,
    alimentacao.inscritos,
  ]);

  const handleAdicionarUnidade = (values: any) => {
    const lote = lotes.find((l) => l.uuid === values.dres_lote);

    const mapAlimentacoes = (opcoes: any[], selecionados: string[] = []) =>
      opcoes.filter((o) => selecionados.includes(o.value)).map((o) => o.label);

    const novasUnidades = values.unidades_educacionais.flatMap(
      (uuid: string) => {
        const unidade = unidadesFiltradas.find((u: any) => u.value === uuid);

        const base = {
          id: `${Date.now()}-${Math.random()}`,
          uuid: null,

          loteUuid: lote?.uuid,
          dreLoteNome: lote?.nome_exibicao || lote?.nome || "",

          unidadeEducacionalUuid: uuid,
          unidadeEducacional: unidade?.label || "",
          unidadeEducacionalCodigoEol: unidade?.codigo_eol || "",

          num_inscritos: 0,
          num_colaboradores: 0,
          liberarMedicao: true,

          alimentacaoColaboradores: mapAlimentacoes(
            alimentacao.colaboradores,
            values.tipos_alimentacao_colaboradores,
          ),
          tiposAlimentacaoColaboradoresUuids:
            values.tipos_alimentacao_colaboradores || [],
        };

        if (isCemei) {
          return ["CEI", "EMEI"].map((tipo) => ({
            ...base,
            id: `${Date.now()}-${Math.random()}-${tipo}`,
            ceiOuEmei: tipo,

            alimentacaoInscritos: mapAlimentacoes(
              alimentacao.inscritos,
              values.tipos_alimentacao_inscritos,
            ),
            tiposAlimentacaoInscritosUuids:
              values.tipos_alimentacao_inscritos || [],

            alimentacaoInscritosInfantil: mapAlimentacoes(
              alimentacao.inscritosInfantil,
              values.tipos_alimentacao_inscritos_infantil,
            ),
            tiposAlimentacaoInfantilUuids:
              values.tipos_alimentacao_inscritos_infantil || [],
          }));
        }

        return [
          {
            ...base,
            alimentacaoInscritos: mapAlimentacoes(
              alimentacao.inscritos,
              values.tipos_alimentacao_inscritos,
            ),
            tiposAlimentacaoInscritosUuids:
              values.tipos_alimentacao_inscritos || [],

            alimentacaoInscritosInfantil: [],
            tiposAlimentacaoInfantilUuids: [],
          },
        ];
      },
    );

    novasUnidades.forEach((unidade) => {
      form.mutators.push("unidades_participantes", unidade);
    });

    closeModal();
  };

  const filtrarLancheEmergencial = (options: any[] = []) =>
    options.filter(
      (opt) => !opt.label?.toLowerCase().includes("lanche emergencial"),
    );

  return (
    <Modal
      dialogClassName="modal-adicionar-unidades-educacionais"
      show={showModal}
      onHide={closeModal}
      data-testid="modal-adicionar-unidade"
    >
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Unidades Educacionais</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          keepDirtyOnReinitialize
          onSubmit={() => {}}
          render={({ values, form: formApi, submitting: formSubmitting }) => {
            useEffect(() => {
              setFormApiRef(formApi);
            }, [formApi]);

            const enableSelectors = Boolean(
              values?.dres_lote && values?.tipos_unidades,
            );

            const isAddDisabled =
              submitting ||
              formSubmitting ||
              !values?.dres_lote ||
              !values?.tipos_unidades ||
              !values?.unidades_educacionais?.length ||
              !values?.tipos_alimentacao_inscritos?.length ||
              (isCemei &&
                !values?.tipos_alimentacao_inscritos_infantil?.length);

            const resetDependentFields = () => {
              formApi.change("unidades_educacionais", []);
              formApi.change("tipos_alimentacao_inscritos", []);
              formApi.change("tipos_alimentacao_colaboradores", []);
              formApi.change("tipos_alimentacao_inscritos_infantil", []);
            };

            useEffect(() => {
              const novoDreLote = values?.dres_lote || "";
              if (dreLote !== novoDreLote) {
                setDreLote(novoDreLote);
                formApi.change("tipos_unidades", undefined);
                formApi.resetFieldState("tipos_unidades");
                resetDependentFields();
              }
            }, [values?.dres_lote, dreLote]);

            useEffect(() => {
              const novoTipoUnidade = values?.tipos_unidades || "";
              if (tipoUnidade !== novoTipoUnidade) {
                setTipoUnidade(novoTipoUnidade);
                resetDependentFields();
              }
            }, [values?.tipos_unidades, tipoUnidade]);

            return (
              <form>
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
                      naoDesabilitarPrimeiraOpcao
                    />
                  </div>
                  <div className="w-50">
                    <Field
                      component={Select}
                      dataTestId="select-tipos-unidades"
                      label="Tipos de Unidades"
                      name="tipos_unidades"
                      options={tiposOpts}
                      required
                      validate={required}
                      naoDesabilitarPrimeiraOpcao
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
                    options={unidadesFiltradas}
                    selected={values?.unidades_educacionais || []}
                    required
                    validate={required}
                    disabled={!enableSelectors}
                    onSelectedChanged={(vals) =>
                      formApi.change(
                        "unidades_educacionais",
                        vals.map((v) => v.value),
                      )
                    }
                  />
                </div>

                <div className="row">
                  <div className="w-50">
                    <Field
                      component={MultiselectRaw}
                      label={`Tipos de Alimentações para Inscritos${
                        isCemei ? " - CEI" : ""
                      }`}
                      name="tipos_alimentacao_inscritos"
                      options={filtrarLancheEmergencial(alimentacao.inscritos)}
                      selected={values?.tipos_alimentacao_inscritos || []}
                      required
                      validate={required}
                      disabled={
                        !enableSelectors ||
                        isTipoComAlimentacaoFixaParaInscritos
                      }
                      onSelectedChanged={(vals) => {
                        if (isTipoComAlimentacaoFixaParaInscritos) return;
                        formApi.change(
                          "tipos_alimentacao_inscritos",
                          vals.map((v) => v.value),
                        );
                      }}
                    />
                  </div>

                  <div className="w-50">
                    <Field
                      component={MultiselectRaw}
                      label="Tipos de Alimentações para Colaboradores"
                      name="tipos_alimentacao_colaboradores"
                      options={filtrarLancheEmergencial(
                        alimentacao.colaboradores,
                      )}
                      selected={values?.tipos_alimentacao_colaboradores || []}
                      disabled={!enableSelectors}
                      onSelectedChanged={(vals) =>
                        formApi.change(
                          "tipos_alimentacao_colaboradores",
                          vals.map((v) => v.value),
                        )
                      }
                    />
                  </div>

                  {isCemei && (
                    <div className="w-50">
                      <Field
                        component={MultiselectRaw}
                        dataTestId="multiselect-tipos-alimentacao-inscritos-infantil"
                        label="Tipos de Alimentações para Inscritos - INFANTIL"
                        name="tipos_alimentacao_inscritos_infantil"
                        options={filtrarLancheEmergencial(
                          alimentacao.inscritosInfantil,
                        )}
                        selected={
                          values?.tipos_alimentacao_inscritos_infantil || []
                        }
                        required
                        validate={required}
                        disabled={!enableSelectors}
                        onSelectedChanged={(vals) =>
                          formApi.change(
                            "tipos_alimentacao_inscritos_infantil",
                            vals.map((v) => v.value),
                          )
                        }
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
                    disabled={isAddDisabled}
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

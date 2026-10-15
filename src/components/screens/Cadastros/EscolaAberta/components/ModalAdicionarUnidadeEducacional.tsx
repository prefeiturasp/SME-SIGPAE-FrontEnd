import { FormApi } from "final-form";
import { useEffect, useMemo, useRef, useState } from "react";
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

const resetCamposDependentes = (formApi: FormApi<any>) => {
  formApi.change("unidades_educacionais", []);
  formApi.change("tipos_alimentacao_participantes", []);
};

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
  form,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const { lotes, lotesOpts } = useLotes();
  const [dreLote, setDreLote] = useState("");
  const [tipoUnidade, setTipoUnidade] = useState("");
  const { tiposOpts } = useTiposUnidade(dreLote, lotes, "Grupo 4");
  const alimentacao = useAlimentacao();
  const { unidadesFiltradas, fetchUnidades, resetUnidades } =
    useUnidadesEducacionais(form);
  const formApiRef = useRef(null);

  const decorators = useMemo(
    () => [
      (formApi: FormApi<any>) => {
        let dreAtual = "";
        let tipoAtual = "";

        return formApi.subscribe(
          ({ values }) => {
            const novoDre = values?.dres_lote || "";
            const novoTipo = values?.tipos_unidades || "";

            if (novoDre !== dreAtual) {
              dreAtual = novoDre;
              tipoAtual = "";
              setDreLote(novoDre);
              setTipoUnidade("");
              formApi.change("tipos_unidades", undefined);
              if (formApi.getFieldState("tipos_unidades")) {
                formApi.resetFieldState("tipos_unidades");
              }
              resetCamposDependentes(formApi);
              return;
            }

            if (novoTipo !== tipoAtual) {
              tipoAtual = novoTipo;
              setTipoUnidade(novoTipo);
              resetCamposDependentes(formApi);
            }
          },
          { values: true },
        );
      },
    ],
    [],
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
    alimentacao.loadAlimentacao(tipoUnidade);
  }, [dreLote, tipoUnidade, lotes]);

  const handleAdicionarUnidade = (values: any) => {
    const lote = lotes.find((l) => l.uuid === values.dres_lote);

    const mapAlimentacoes = (opcoes: any[], selecionados: string[] = []) =>
      opcoes.filter((o) => selecionados.includes(o.value)).map((o) => o.label);

    const novasUnidades = values.unidades_educacionais.map((uuid: string) => {
      const unidade = unidadesFiltradas.find((u: any) => u.value === uuid);

      return {
        id: crypto.randomUUID(),
        uuid: null,

        loteUuid: lote?.uuid,
        dreLoteNome: lote?.nome_exibicao || lote?.nome || "",

        unidadeEducacionalUuid: uuid,
        unidadeEducacional: unidade?.label || "",
        unidadeEducacionalCodigoEol: unidade?.codigo_eol || "",

        num_participantes: 0,
        liberarMedicao: true,

        tiposAlimentacaoParticipantesUuids:
          values.tipos_alimentacao_participantes || [],
        alimentacaoParticipantes: mapAlimentacoes(
          alimentacao.participantes,
          values.tipos_alimentacao_participantes,
        ).join(", "),
      };
    });

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
          decorators={decorators}
          onSubmit={() => {}}
          render={({ values, form: formApi, submitting: formSubmitting }) => {
            const enableSelectors = Boolean(
              values?.dres_lote && values?.tipos_unidades,
            );

            const isAddDisabled =
              submitting ||
              formSubmitting ||
              !values?.dres_lote ||
              !values?.tipos_unidades ||
              !values?.unidades_educacionais?.length ||
              !values?.tipos_alimentacao_participantes?.length;

            return (
              <form
                ref={() => {
                  formApiRef.current = formApi;
                }}
              >
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
                      className="tipo-unidade-select"
                      component={Select}
                      dataTestId="select-tipos-unidades"
                      label="Tipos de Unidades"
                      name="tipos_unidades"
                      options={tiposOpts}
                      required
                      validate={required}
                      naoDesabilitarPrimeiraOpcao
                      disabled={!values?.dres_lote}
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
                  <div className="w-75">
                    <Field
                      component={MultiselectRaw}
                      label="Tipos de Alimentações para Participantes"
                      name="tipos_alimentacao_participantes"
                      options={filtrarLancheEmergencial(
                        alimentacao.participantes,
                      )}
                      selected={values?.tipos_alimentacao_participantes || []}
                      required
                      validate={required}
                      disabled={!enableSelectors}
                      onSelectedChanged={(vals) =>
                        formApi.change(
                          "tipos_alimentacao_participantes",
                          vals.map((v) => v.value),
                        )
                      }
                    />
                  </div>
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

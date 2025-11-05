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
};

type Option = { uuid: string; nome: string };

export const ModalAdicionarUnidadeEducacional = ({
  showModal,
  closeModal,
  submitting,
  setUnidadesParticipantes,
}: ModalAdicionarUnidadeEducacionalInterface) => {
  const [lotes, setLotes] = useState<Option[]>([]);
  const [tiposUnidadesEscolares, setTiposUnidadesEscolares] = useState([]);
  const [tiposAlimentacaoInscritos, setTiposAlimentacaoInscritos] = useState(
    []
  );
  const [tiposAlimentacaoColaboradores, setTiposAlimentacaoColaboradores] =
    useState([]);
  const [unidadesEducacionaisOpts, setUnidadesEducacionaisOpts] = useState([]);
  const [emefTipo, setEmefTipo] = useState<{
    nome: string;
    uuid: string;
  } | null>(null);

  useEffect(() => {
    const handleCarregaSeletor = async () => {
      const tiposUnidadesEscolares = await getTiposUnidadeEscolar();
      const formatTiposOpcoesUnidadesEscolares =
        tiposUnidadesEscolares.data.results.map((unidadeEscolar) => ({
          nome: unidadeEscolar.iniciais,
          uuid: unidadeEscolar.uuid,
        }));

      setTiposUnidadesEscolares(formatTiposOpcoesUnidadesEscolares);
      setEmefTipo(
        formatTiposOpcoesUnidadesEscolares.find((t) => t.nome === "EMEF") ||
          null
      );
      getLotesAsync(setLotes, "uuid", "nome");
    };

    handleCarregaSeletor();
  }, []);

  const lotesOpts = useMemo<Option[]>(
    () => [{ uuid: "", nome: "Selecione a DRE/Lote" }].concat(lotes || []),
    [lotes]
  );

  const tiposUnidadesOpts = useMemo<Option[]>(
    () =>
      [{ uuid: "", nome: "Selecione o Tipo de Unidade" }].concat(
        tiposUnidadesEscolares || []
      ),
    [tiposUnidadesEscolares]
  );

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
      const formatOpcoesUnidades = response.data.map((escola) => ({
        value: escola.uuid,
        label: escola.nome,
      }));
      setUnidadesEducacionaisOpts(formatOpcoesUnidades);
    }
  };

  const handleBuscarTipoAlimentacaoInscritos = async (
    tipoUnidadeUuid: string
  ) => {
    if (!tipoUnidadeUuid) return;

    const response = await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
      tipoUnidadeUuid
    );

    if (!response.results[0].tipos_alimentacao) {
      setTiposAlimentacaoInscritos([]);
      return;
    }

    const opcoes = response.results[0].tipos_alimentacao.map((tipo: any) => ({
      value: tipo.uuid,
      label: tipo.nome,
    }));

    setTiposAlimentacaoInscritos(opcoes);
  };

  const handleBuscarTipoAlimentacaoColaboradores = async () => {
    if (!emefTipo?.uuid) return;

    const responseEmef = await getVinculosTipoAlimentacaoPorTipoUnidadeEscolar(
      emefTipo.uuid
    );

    const integralItem = responseEmef.results.find(
      (item: any) => item?.periodo_escolar?.nome?.toUpperCase() === "INTEGRAL"
    );

    if (!integralItem || !Array.isArray(integralItem.tipos_alimentacao)) {
      setTiposAlimentacaoColaboradores([]);
      return;
    }

    const opcoes = integralItem.tipos_alimentacao.map((tipo: any) => ({
      value: tipo.uuid,
      label: tipo.nome,
    }));

    setTiposAlimentacaoColaboradores(opcoes);
  };

  const handleAdicionarUnidade = (values: any) => {
    // Busca os nomes das alimentações selecionadas
    const alimentacoesInscritosNomes = tiposAlimentacaoInscritos
      .filter((tipo: any) =>
        values.tipos_alimentacao_inscritos?.includes(tipo.value)
      )
      .map((tipo: any) => tipo.label);

    const alimentacoesColaboradoresNomes = tiposAlimentacaoColaboradores
      .filter((tipo: any) =>
        values.tipos_alimentacao_colaboradores?.includes(tipo.value)
      )
      .map((tipo: any) => tipo.label);

    // Para cada unidade educacional selecionada, cria um objeto
    const novasUnidades = values.unidades_educacionais.map(
      (unidadeUuid: string) => {
        const unidadeEducacional = unidadesEducacionaisOpts.find(
          (u: any) => u.value === unidadeUuid
        );

        return {
          id: `${Date.now()}-${Math.random()}`,
          dreLote: values.dres_lote.nome,
          unidadeEducacional: unidadeEducacional?.label || "",
          unidadeEducacionalUuid: unidadeUuid,
          numeroInscritos: 0,
          numeroColaboradores: 0,
          liberarMedicao: true,
          alimentacaoInscritos: alimentacoesInscritosNomes,
          alimentacaoColaboradores: alimentacoesColaboradoresNomes,
        };
      }
    );

    setUnidadesParticipantes((prev) => [...prev, ...novasUnidades]);

    closeModal();
  };

  return (
    <Modal
      dialogClassName="modal-adicionar-unidades-educacionais"
      show={showModal}
      onHide={closeModal}
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

            const addDisabled = submitting || formSubmitting;

            useEffect(() => {
              if (hasDreLote && hasTipoUnidade) {
                const dreUuid = values.dres_lote.dreUuid;

                handleBuscarUnidadesEducacionais(
                  dreUuid,
                  values.tipos_unidades
                );

                handleBuscarTipoAlimentacaoInscritos(values.tipos_unidades);
                handleBuscarTipoAlimentacaoColaboradores();
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
                      label="DREs/LOTE"
                      name="dres_lote"
                      options={lotesOpts}
                      required
                      validate={required}
                      parse={(value) => {
                        return (
                          lotes.find((lote) => lote.uuid === value) || value
                        );
                      }}
                    />
                  </div>
                  <div className="w-50">
                    <Field
                      component={Select}
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
                    label="Unidades Educacionais"
                    name="unidades_educacionais"
                    placeholder="Selecione as Unidades Educacionais"
                    options={unidadesEducacionaisOpts}
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
                      label="Tipos de Alimentações para Inscritos"
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

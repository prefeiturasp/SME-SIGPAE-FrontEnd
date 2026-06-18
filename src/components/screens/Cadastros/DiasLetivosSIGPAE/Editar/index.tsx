import HTTP_STATUS from "http-status-codes";
import { useEffect, useState, useRef } from "react";
import { Field, Form } from "react-final-form";
import { lotesToOptions } from "src/components/screens/Relatorios/SolicitacoesAlimentacao/helpers";
import { MultiselectRaw } from "src/components/Shareable/MultiselectRaw";
import { requiredMultiselect } from "src/helpers/fieldValidators";
import { getLotesSimples } from "src/services/lote.service";
import { getUnidadesEducacionaisComCodEol } from "src/services/dietaEspecial.service";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getTiposUnidadeEscolar } from "src/services/cadastroTipoAlimentacao.service";
import { Spin } from "antd";
import {
  FiltroUnidadesEducacionaisInterface,
  OpcaoMultiselectInterface,
  TipoUnidadeEscolarInterface,
} from "./interfaces";

export const EditarDiasLetivosSIGPAE = () => {
  const [lotes, setLotes] = useState<OpcaoMultiselectInterface[]>([]);
  const [tiposUnidades, setTiposUnidades] = useState<
    TipoUnidadeEscolarInterface[]
  >([]);
  const [unidadesEducacionais, setUnidadesEducacionais] = useState<
    OpcaoMultiselectInterface[]
  >([]);

  const debounceUnidadesRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [carregandoUnidades, setCarregandoUnidades] = useState(false);

  const [erroAPI, setErroAPI] = useState("");

  const getLotesSimplesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(lotesToOptions(response.data.results));
    } else {
      setErroAPI("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };

  const getTiposUnidadesUEAsync = async () => {
    const response = await getTiposUnidadeEscolar({
      pertence_relatorio_solicitacoes_alimentacao: true,
    });
    if (response.status === HTTP_STATUS.OK) {
      setTiposUnidades(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar tipos de unidade educacional. Tente novamente mais tarde.",
      );
    }
  };

  const getUnidadesEducacionaisAsync = async (
    values: FiltroUnidadesEducacionaisInterface,
  ) => {
    setCarregandoUnidades(true);
    setUnidadesEducacionais([]);
    try {
      let data = values;
      const response = await getUnidadesEducacionaisComCodEol(data);
      if (response.status === HTTP_STATUS.OK) {
        if (response.data.mensagem) {
          setUnidadesEducacionais([
            {
              label: response.data.mensagem,
              value: "__no_result__",
              disabled: true,
            },
          ]);
          return;
        }
        setUnidadesEducacionais(
          response.data.map((unidade) => ({
            label: `${unidade.codigo_eol_escola}`,
            value: unidade.uuid,
          })),
        );
      } else {
        toastError("Erro ao buscar unidades educacionais");
      }
    } finally {
      setCarregandoUnidades(false);
    }
  };

  const onSubmit = () => {};

  useEffect(() => {
    Promise.all([getLotesSimplesAsync(), getTiposUnidadesUEAsync()]);
  }, []);

  return (
    <div className="editar-dias-letivos">
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && (
        <div className="card mt-3">
          <div className="card-body">
            <Form onSubmit={onSubmit}>
              {({ handleSubmit, form, values }) => (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-4">
                      <label className="col-form-label">
                        <span className="red">*</span> DRE/Lote
                      </label>
                      <Field
                        component={MultiselectRaw}
                        name="lotes"
                        selected={values.lotes || []}
                        options={lotes}
                        onSelectedChanged={(values_) => {
                          form.change(
                            `lotes`,
                            values_.map((value_) => value_.value),
                          );
                          form.change(`tipos_unidades`, undefined);
                        }}
                        hasSelectAll
                        placeholder="Selecione os Lote(s)"
                        required
                        validate={requiredMultiselect}
                      />
                    </div>
                    <div className="col-4">
                      <label className="label fw-normal pb-2 pt-2">
                        <span className="red">*</span> Tipo de Unidade
                      </label>
                      <Field
                        component={MultiselectRaw}
                        placeholder="Selecione o(s) tipo(s) de unidade"
                        name="tipos_unidades"
                        dataTestId="select-tipos-unidades"
                        options={tiposUnidades.map((tipo_unidade) => ({
                          label: tipo_unidade.iniciais,
                          value: tipo_unidade.uuid,
                        }))}
                        selected={values.tipos_unidades || []}
                        onSelectedChanged={(values_) => {
                          setUnidadesEducacionais([]);
                          form.change("unidades_educacionais", undefined);
                          form.change(
                            `tipos_unidades`,
                            values_.map((value_) => value_.value),
                          );
                          if (debounceUnidadesRef.current) {
                            clearTimeout(debounceUnidadesRef.current);
                          }
                          const lotes = values.lotes;
                          const tiposUnidades = values_.map((v) => v.value);
                          debounceUnidadesRef.current = setTimeout(() => {
                            getUnidadesEducacionaisAsync({
                              lotes,
                              tipos_unidades: tiposUnidades,
                            });
                          }, 3000);
                        }}
                        onBlur={() => {
                          if (debounceUnidadesRef.current) {
                            clearTimeout(debounceUnidadesRef.current);
                            debounceUnidadesRef.current = null;
                          }
                          if (values.tipos_unidades?.length > 0) {
                            getUnidadesEducacionaisAsync({
                              lotes: values.lotes,
                              tipos_unidades: values.tipos_unidades,
                            });
                          }
                        }}
                        required
                        validate={requiredMultiselect}
                      />
                    </div>
                    <div className="col-4">
                      <label className="label fw-normal pb-2 pt-2">
                        Unidades Educacionais
                      </label>
                      <Spin
                        tip="Carregando unidades educacionais..."
                        spinning={carregandoUnidades}
                      >
                        <Field
                          component={MultiselectRaw}
                          name="unidades_educacionais"
                          options={unidadesEducacionais}
                          selected={values.unidades_educacionais || []}
                          onSelectedChanged={(values_) => {
                            form.change(
                              "unidades_educacionais",
                              values_.map((value_) => value_.value),
                            );
                          }}
                          disabled={!values.lotes && !values.tipos_unidades}
                        />
                      </Spin>
                    </div>
                  </div>
                </form>
              )}
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { FormApi } from "final-form";
import React, { ReactNode, useState } from "react";
import { Form } from "react-final-form";
import "./styles.scss";

import {
  usuarioEhDRE,
  usuarioEhEscolaTerceirizadaQualquerPerfil,
} from "helpers/utilities";

type Props = {
  titulo?: string;
  children: (_values?: Record<string, any>, _form?: FormApi) => ReactNode;
  onSubmit: (_values: Record<string, any>) => void;
  onClear: () => void;
  manterFiltros?: Array<string>;
  desabilitarBotoes?: boolean;
  initialValues?: Object;
  keepDirtyOnReinitialize?: boolean;
  destroyOnUnregister?: boolean;
};

export const CollapseFiltros: React.FC<Props> = ({
  titulo = "Filtrar Cadastros",
  children,
  onSubmit,
  onClear,
  desabilitarBotoes,
  manterFiltros,
  initialValues = {},
  keepDirtyOnReinitialize = false,
  destroyOnUnregister = false,
}) => {
  const id = "collapseFiltros";
  const [collapse, setCollapse] = useState(true);

  const toggleCollapse = () => {
    setCollapse(!collapse);
    const element = document.getElementById("heading");
    element.classList.toggle("open");
  };

  const limparFiltros = (form: FormApi, values: Record<string, any>) => {
    if (usuarioEhDRE() && manterFiltros?.includes("dre")) {
      form.reset({ dre: values["dre"] });
    } else if (
      usuarioEhEscolaTerceirizadaQualquerPerfil() &&
      manterFiltros?.includes("unidade_educacional")
    ) {
      form.reset({
        dre: values["dre"],
        unidade_educacional: values["unidade_educacional"],
      });
    } else if (manterFiltros?.includes("status_selecionado")) {
      form.reset({ status_selecionado: values["status_selecionado"] });
    } else {
      form.reset({});
    }
    onClear();
  };

  return (
    <div className="accordion accordionFiltros mt-1" id={id}>
      <div className="card mt-3">
        <div className={`card-header card-tipo open`} id={`heading`}>
          <div className="row card-header-content">
            <div className="col-11 titulo my-auto">
              <i className="fas fa-sort-amount-down"></i>
              <span>{titulo}</span>
            </div>

            <div className="col-1 my-auto">
              <button
                onClick={() => toggleCollapse()}
                className="btn btn-link btn-block text-end px-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse`}
                aria-expanded="true"
                aria-controls={`collapse`}
              >
                <span className="span-icone-toogle">
                  <i
                    className={
                      collapse ? "fas fa-chevron-up" : "fas fa-chevron-down"
                    }
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          id={`collapse`}
          className="collapse show"
          aria-labelledby="headingOne"
          data-bs-parent={`#${id}`}
        >
          <div className="card-body">
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues}
              destroyOnUnregister={destroyOnUnregister}
              keepDirtyOnReinitialize={keepDirtyOnReinitialize}
              render={({ form, handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <div>{children(values, form)}</div>

                  <div className="pt-4 pb-4 mb-2">
                    <Botao
                      dataTestId="botao-filtrar"
                      texto="Filtrar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      disabled={desabilitarBotoes}
                    />

                    <Botao
                      texto="Limpar Filtros"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={() => limparFiltros(form, values)}
                      disabled={desabilitarBotoes}
                    />
                  </div>
                </form>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapseFiltros;

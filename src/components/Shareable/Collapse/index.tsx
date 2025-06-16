import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
} from "react";
import "./styles.scss";
import { CollapseConfig } from "./interfaces";
import { StateConferidosAnalise } from "src/components/screens/PreRecebimento/FichaTecnica/interfaces";

export interface CollapseControl {
  [index: number]: boolean;
}

type Props = {
  collapse: CollapseControl;
  setCollapse: Dispatch<SetStateAction<CollapseControl>>;
  titulos?: ReactElement[];
  children: ReactElement[];
  id: string;
  collapseConfigs?: CollapseConfig[];
  state?: StateConferidosAnalise;
};

const Collapse: React.FC<Props> = ({
  collapse,
  setCollapse,
  titulos,
  children,
  id,
  collapseConfigs,
  state,
}) => {
  const toggleCollapse = (index: number) => {
    setCollapse({
      [index]: !collapse[index],
    });
  };

  const gerarConfigsPadrao = () =>
    children.map((): CollapseConfig => {
      return { titulo: "", camposObrigatorios: true };
    });

  const configs =
    collapseConfigs?.length > 0 ? collapseConfigs : gerarConfigsPadrao();

  useEffect(() => {
    const elements = document.querySelectorAll(`.accordionComponent .collapse`);
    elements.forEach((element, index) => {
      if (collapse[index]) element.classList.add("show");
    });
  }, []);

  return (
    collapse && (
      <div className="accordion accordionComponent mt-1" id={id}>
        {children.filter(Boolean).map((el, index) => (
          <>
            <div className="card mt-3">
              <div className={`card-header card-tipo`} id={`heading_${index}`}>
                <div className="row card-header-content">
                  <span className="col-8 titulo">
                    {configs[index]?.titulo || titulos[index]}
                  </span>
                  <div className="col-4 my-auto flex-end">
                    {configs[index].camposObrigatorios && (
                      <>
                        <span className="texto-obrigatorio required-asterisk">
                          *
                        </span>
                        <span className="texto-obrigatorio">
                          Campos de Preenchimento Obrigatório
                        </span>
                      </>
                    )}
                    {/* TODO: Transformar isso em parametro(componentes separados) 
                              quando for necessário incluir mais opções de tags */}
                    {state && (
                      <span className="tags">
                        {configs[index].tag === true &&
                          (state[el.props.id] === false ? (
                            <div className="tag correcao">
                              <i className="fas fa-exclamation-circle" />
                              Indicação de Correção
                            </div>
                          ) : state[el.props.id] === true ? (
                            <div className="tag collapse-conferido">
                              <i className="fas fa-check-circle" />
                              Conferido
                            </div>
                          ) : (
                            <div className="tag pendente">
                              Pendente de Análise
                            </div>
                          ))}
                      </span>
                    )}
                    <span>
                      <button
                        onClick={() => toggleCollapse(index)}
                        className="btn btn-link text-end px-0 ms-4"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse_${index}`}
                        aria-expanded="true"
                        aria-controls={`collapse_${index}`}
                      >
                        <span className="span-icone-toogle">
                          <i
                            className={
                              collapse[index]
                                ? "fas fa-chevron-up"
                                : "fas fa-chevron-down"
                            }
                          />
                        </span>
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <div
                id={`collapse_${index}`}
                className={`collapse`}
                aria-labelledby="headingOne"
                data-bs-parent={`#${id}`}
              >
                <div className="card-body">{el}</div>
              </div>
            </div>
          </>
        ))}
      </div>
    )
  );
};

export default Collapse;

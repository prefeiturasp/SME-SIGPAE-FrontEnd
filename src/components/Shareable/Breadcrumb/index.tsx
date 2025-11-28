import { TemaContext } from "src/context/TemaContext";
import React, { useContext } from "react";
import {
  Link,
  Location,
  NavigateFunction,
  useNavigate,
} from "react-router-dom";
import "./style.scss";

type BreadcrumbProps = {
  home: string;
  anteriores?: {
    href?: string;
    navigate_to?: number;
    location?: Location;
    titulo: string;
  }[];
  atual: {
    href: string;
    titulo: string;
  };
};

export default function Breadcrumb({
  home,
  anteriores,
  atual,
}: BreadcrumbProps) {
  const temaContext = useContext(TemaContext);

  const navigate: NavigateFunction = useNavigate();

  return (
    <div className="breadcrumb-row row g-0">
      <div className="col-xs-9 col-sm-10">
        <ul className="br-breadcrumb">
          <li>
            <Link className={`home ${!atual && "is-active"}`} to={home}>
              <i className="fas fa-home home" />
              Início
            </Link>
          </li>
          {anteriores &&
            anteriores.length > 0 &&
            anteriores.map((anterior, key) => {
              return (
                <li
                  key={key}
                  onClick={() => {
                    if (anterior.navigate_to) navigate(anterior.navigate_to);
                  }}
                >
                  <Link to={anterior.href}>{anterior.titulo}</Link>
                </li>
              );
            })}
          {atual && (
            <li>
              <Link className="is-active" to={atual.href}>
                {atual.titulo}
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div
        className="col-xs-3 col-sm-2 text-end contrast"
        onClick={() => {
          temaContext.mudarTema();
        }}
      >
        <i className="fas fa-adjust" /> Contraste
      </div>
    </div>
  );
}

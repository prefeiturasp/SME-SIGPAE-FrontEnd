import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import {
  DETALHAR_ALTERACAO_CRONOGRAMA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import { tipoDeStatusClasse } from "./helper";
import { validate } from "uuid";
import "./style.scss";
export const FluxoDeStatusPreRecebimento = ({
  listaDeStatus,
  itensClicaveisCronograma,
}) => {
  const navigate = useNavigate();
  let ultimoStatus = listaDeStatus.slice(-1)[0];
  if (
    ultimoStatus.status_evento_explicacao === "Alteração enviada ao fornecedor"
  ) {
    listaDeStatus.push({
      status_evento_explicacao: "Fornecedor Ciente",
      criado_em: "",
      usuario: { nome: "", uuid: "" },
      justificativa: "",
    });
  }
  const item = (status, key) => {
    const content = _jsxs(_Fragment, {
      children: [
        status.criado_em,
        _jsx("br", {}),
        status.usuario && _jsx("span", { children: status.usuario.nome }),
      ],
    });
    const uuidValido = validate(status.justificativa);
    return _jsx(
      "li",
      {
        className: `${tipoDeStatusClasse(status)}`,
        style: {
          width: `${100 / listaDeStatus.length}%`,
          cursor:
            itensClicaveisCronograma && uuidValido ? "pointer" : "default",
        },
        onClick: () => {
          itensClicaveisCronograma &&
            uuidValido &&
            navigate(
              `/${PRE_RECEBIMENTO}/${DETALHAR_ALTERACAO_CRONOGRAMA}?uuid=${status.justificativa}`
            );
        },
        children: content,
      },
      key
    );
  };
  return _jsxs("div", {
    className: "w-100",
    children: [
      _jsx("ul", {
        className: `progressbar-titles fluxos`,
        children: listaDeStatus.map((status, key) =>
          _jsx("li", { children: status.status_evento_explicacao }, key)
        ),
      }),
      _jsx("ul", {
        className: "progressbar-dados",
        children: listaDeStatus.map((status, key) => item(status, key)),
      }),
    ],
  });
};

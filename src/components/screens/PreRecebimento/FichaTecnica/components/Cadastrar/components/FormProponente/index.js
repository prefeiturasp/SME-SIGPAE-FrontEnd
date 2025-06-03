import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import InputText from "src/components/Shareable/Input/InputText";
const FormProponente = ({ proponente }) => {
  return _jsxs(_Fragment, {
    children: [
      _jsx("div", {
        className: "row",
        children: _jsx("div", {
          className: "col-6",
          children: _jsx(InputText, {
            label: "CNPJ",
            valorInicial: proponente.cnpj,
            disabled: true,
          }),
        }),
      }),
      _jsx("div", {
        className: "row",
        children: _jsx("div", {
          className: "col-8",
          children: _jsx(InputText, {
            label: "Nome da Empresa/Organiza\u00E7\u00E3o",
            valorInicial: `${proponente.nome_fantasia} / ${proponente.razao_social}`,
            disabled: true,
          }),
        }),
      }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-8",
            children: _jsx(InputText, {
              label: "Endere\u00E7o",
              valorInicial: proponente.endereco,
              disabled: true,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsx(InputText, {
              label: "N\u00BA",
              valorInicial: proponente.numero,
              disabled: true,
            }),
          }),
        ],
      }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-4",
            children: _jsx(InputText, {
              label: "Complemento",
              valorInicial: proponente.complemento,
              disabled: true,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsx(InputText, {
              label: "Bairro",
              valorInicial: proponente.bairro,
              disabled: true,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsx(InputText, {
              label: "CEP",
              valorInicial: proponente.cep,
              disabled: true,
            }),
          }),
        ],
      }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-8",
            children: _jsx(InputText, {
              label: "Cidade",
              valorInicial: proponente.cidade,
              disabled: true,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsx(InputText, {
              label: "Estado",
              valorInicial: proponente.estado,
              disabled: true,
            }),
          }),
        ],
      }),
      _jsxs("div", {
        className: "row",
        children: [
          _jsx("div", {
            className: "col-8",
            children: _jsx(InputText, {
              label: "E-mail",
              valorInicial: proponente.responsavel_email,
              required: true,
              disabled: true,
            }),
          }),
          _jsx("div", {
            className: "col-4",
            children: _jsx(InputText, {
              label: "Telefone",
              valorInicial: proponente.responsavel_telefone,
              required: true,
              disabled: true,
            }),
          }),
        ],
      }),
    ],
  });
};
export default FormProponente;

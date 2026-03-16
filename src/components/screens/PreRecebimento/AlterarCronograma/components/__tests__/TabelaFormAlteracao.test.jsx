import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";

import TabelaFormAlteracao from "../TabelaFormAlteracao";

describe("TabelaFormAlteracao", () => {
  const solicitacao = {
    etapas_antigas: [
      {
        etapa: "Etapa 1",
        parte: "Parte 0",
        numero_empenho: "15.826/2026",
        qtd_total_empenho: 167500,
        data_programada: "09/02/2026",
        quantidade: 31500,
        total_embalagens: 1050,
      },
    ],
    etapas_novas: [
      {
        etapa: "Etapa 1",
        parte: "Parte 0",
        numero_empenho: "15.826/2026",
        qtd_total_empenho: 167500,
        data_programada: "06/04/2026",
        quantidade: 31500,
        total_embalagens: 1050,
      },
    ],
  };

  const renderComponent = () =>
    render(
      <Form
        onSubmit={() => {}}
        render={() => (
          <TabelaFormAlteracao
            solicitacao={solicitacao}
            somenteLeitura={true}
            unidadeMedida={{ abreviacao: "kg" }}
            tipoEmbalagemSecundaria={{ abreviacao: "FD" }}
          />
        )}
      />,
    );

  it("formata quantidade total do empenho, quantidade e total de embalagens com unidade", () => {
    renderComponent();

    expect(screen.getByText("167.500,00 kg")).toBeInTheDocument();
    expect(screen.getByText("31.500,00 kg")).toBeInTheDocument();
    expect(screen.getByText("1.050,00 FD")).toBeInTheDocument();
  });
});

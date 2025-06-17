import React from "react";
import { render, screen } from "@testing-library/react";
import ModalExcluirComboSubstituicoes from "../components/ModalExcluirComboSubstituicoes";

describe("ModalExcluirComboSubstituicoes (validação react-bootstrap)", () => {
  it("deve renderizar o Modal do Bootstrap sem erro", () => {
    render(
      <ModalExcluirComboSubstituicoes
        showModal={true}
        closeModal={() => {}}
        deletaComboSubstituicao={() => {}}
        combo={{ label: "Arroz" }}
        indice={0}
      />
    );

    expect(screen.getByText(/exclusão de combinação/i)).toBeInTheDocument();
  });
});

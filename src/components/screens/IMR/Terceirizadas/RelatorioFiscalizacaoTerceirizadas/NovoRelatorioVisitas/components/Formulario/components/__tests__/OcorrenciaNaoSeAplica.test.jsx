import React from "react";
import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import { OcorrenciaNaoSeAplica } from "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/OcorrenciaNaoSeAplica";

describe("Testa o componente OcorrenciaNaoSeAplica", () => {
  const mockTipoOcorrencia = {
    uuid: "d4d7d26e-33f5-4acd-9a7c-069de0da2b31",
    nome: "Teste de Ocorrência",
  };

  const renderWithForm = (props) => {
    return render(
      <Form
        onSubmit={jest.fn()}
        render={() => (
          <table>
            <tbody>
              <OcorrenciaNaoSeAplica {...props} />
            </tbody>
          </table>
        )}
      />,
    );
  };

  it("deve renderizar o campo TextArea com o label e placeholder corretos", () => {
    renderWithForm({
      tipoOcorrencia: mockTipoOcorrencia,
      somenteLeitura: false,
    });

    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Descreva as observações"),
    ).toBeInTheDocument();
  });

  it("deve desabilitar o campo quando somenteLeitura for true", () => {
    renderWithForm({
      tipoOcorrencia: mockTipoOcorrencia,
      somenteLeitura: true,
    });

    const textArea = screen.getByPlaceholderText("Descreva as observações");
    expect(textArea).toBeDisabled();
  });

  it("deve renderizar a célula com colSpan 2 e classe p-3", () => {
    const { container } = renderWithForm({
      tipoOcorrencia: mockTipoOcorrencia,
      somenteLeitura: false,
    });

    const td = container.querySelector("td");
    expect(td).toHaveAttribute("colSpan", "2");
    expect(td).toHaveClass("p-3");
  });
});

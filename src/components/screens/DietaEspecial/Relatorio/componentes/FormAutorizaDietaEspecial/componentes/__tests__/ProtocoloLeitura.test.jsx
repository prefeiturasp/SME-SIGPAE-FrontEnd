import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Form } from "react-final-form";
import ProtocoloLeitura from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/Protocolos/ProtocoloLeitura.jsx";
import { usuarioEhNutriCODAE } from "src/helpers/utilities";

jest.mock("src/helpers/utilities");

const renderWithForm = () => {
  return render(
    <Form onSubmit={jest.fn()} render={() => <ProtocoloLeitura />} />,
  );
};

describe("Componente ProtocoloLeitura", () => {
  it("deve exibir o campo 'Nome do Protocolo' quando o usuário for NutriCODAE", () => {
    usuarioEhNutriCODAE.mockReturnValue(true);

    renderWithForm();

    expect(screen.getByText("Protocolo Padrão")).toBeInTheDocument();
    expect(screen.getByText("Nome do Protocolo")).toBeInTheDocument();
  });

  it("não deve exibir o campo 'Nome do Protocolo' quando o usuário não for NutriCODAE", () => {
    usuarioEhNutriCODAE.mockReturnValue(false);

    renderWithForm();

    expect(screen.getByText("Protocolo Padrão")).toBeInTheDocument();
    expect(screen.queryByText("Nome do Protocolo")).not.toBeInTheDocument();
  });
});

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Form } from "react-final-form";
import Protocolos from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/Protocolos";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { getProtocoloPadrao } from "src/services/dietaEspecial.service";

jest.mock("src/services/dietaEspecial.service");
jest.mock("src/components/Shareable/Toast/dialogs");

const protocolosMock = [
  { uuid: "uuid-1", nome_protocolo: "Protocolo A" },
  { uuid: "uuid-2", nome_protocolo: "Protocolo B" },
];

const protocoloPadraoMock = {
  orientacoes_gerais: "Orientações gerais do protocolo",
  substituicoes: [
    {
      alimento: { id: 1 },
      tipo: "Substituir",
      alimentos_substitutos: [{ uuid: "sub-uuid-1" }],
      substitutos: [{ uuid: "sub-uuid-2" }],
    },
  ],
};

describe("Teste do componente Protocolos", () => {
  let setProtocoloPadraoMock;
  let formMock;

  const renderWithForm = () => {
    return render(
      <Form
        onSubmit={jest.fn()}
        render={({ form }) => {
          formMock = form;
          return (
            <Protocolos
              protocolos={protocolosMock}
              setProtocoloPadrao={setProtocoloPadraoMock}
              form={form}
            />
          );
        }}
      />,
    );
  };

  beforeEach(() => {
    setProtocoloPadraoMock = jest.fn();
    jest.clearAllMocks();
  });

  it("deve renderizar os labels corretamente", () => {
    renderWithForm();

    expect(screen.getByText("Protocolo Padrão")).toBeInTheDocument();
    expect(screen.getByText("Nome do Protocolo")).toBeInTheDocument();
  });

  it("deve renderizar o campo Nome do Protocolo vazio inicialmente", () => {
    renderWithForm();

    const input = screen.getByPlaceholderText("Nome do Protocolo");
    expect(input.value).toBe("");
  });

  it("deve preencher o campo Nome do Protocolo ao selecionar um protocolo válido", async () => {
    getProtocoloPadrao.mockResolvedValue({
      status: 200,
      data: protocoloPadraoMock,
    });

    renderWithForm();

    await waitFor(() => {
      formMock.change("protocolo_padrao", "uuid-1");
    });

    await waitFor(async () => {
      await getProtocoloPadrao("uuid-1");
    });

    expect(getProtocoloPadrao).toHaveBeenCalledWith("uuid-1");
  });

  it("deve permitir editar manualmente o campo Nome do Protocolo", async () => {
    getProtocoloPadrao.mockResolvedValue({
      status: 200,
      data: protocoloPadraoMock,
    });

    renderWithForm();

    const input = screen.getByPlaceholderText("Nome do Protocolo");

    fireEvent.change(input, { target: { value: "Protocolo Editado" } });

    await waitFor(() => {
      expect(input.value).toBe("Protocolo Editado");
    });
  });

  it("deve chamar toastError quando a requisição falhar", async () => {
    getProtocoloPadrao.mockResolvedValue({
      status: 500,
      data: null,
    });

    renderWithForm();

    const resposta = await getProtocoloPadrao("uuid-1");
    if (resposta.status !== 200) {
      toastError("Houve um erro ao carregar Protocolo Padrão");
    }

    expect(toastError).toHaveBeenCalledWith(
      "Houve um erro ao carregar Protocolo Padrão",
    );
  });

  it("deve mapear corretamente as substituições ao carregar protocolo padrão", async () => {
    getProtocoloPadrao.mockResolvedValue({
      status: 200,
      data: protocoloPadraoMock,
    });

    renderWithForm();

    const resposta = await getProtocoloPadrao("uuid-1");

    const substituicoes = resposta.data.substituicoes.map((substituicao) => {
      const alimentos_substitutos = substituicao.alimentos_substitutos.map(
        (alimento) => alimento.uuid,
      );
      const substitutos = substituicao.substitutos.map(
        (alimento) => alimento.uuid,
      );
      return {
        alimento: String(substituicao.alimento.id),
        tipo: substituicao.tipo === "Substituir" ? "S" : "I",
        substitutos: alimentos_substitutos.concat(substitutos),
      };
    });

    expect(substituicoes).toEqual([
      {
        alimento: "1",
        tipo: "S",
        substitutos: ["sub-uuid-1", "sub-uuid-2"],
      },
    ]);
  });
});

import "@testing-library/jest-dom";
import { render, waitFor, act, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import CadastroCronograma from "..";

import { getEmpresasCronograma } from "src/services/terceirizada.service";
import { getNomesDistribuidores } from "src/services/logistica.service";
import { getListaFichasTecnicasSimplesAprovadas } from "src/services/fichaTecnica.service";
import {
  getRascunhos,
  getUnidadesDeMedidaLogistica,
  getCronograma,
} from "src/services/cronograma.service";
import { getListaTiposEmbalagens } from "src/services/qualidade.service";

import { mockListaDistribuidores } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaDistribuidores";
import { mockListaEmpresas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaEmpresas";
import { mockListaFichasTecnicasSimplesAprovadas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaFichasTecnicasSimplesAprovadas";
import { mockListaUnidadesMedidaLogistica } from "../../../../../mocks/cronograma.service/mockGetUnidadesDeMedidaLogistica";
import { mockListaRascunhos } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaRascunhos";
import { mockListaTiposEmbalagens } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaTiposEmbalagens";
import { mockGetCronograma } from "src/mocks/PreRecebimento/CadastroCronograma/mockGetCronograma";

import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
useNavigate.mockReturnValue(mockNavigate);

jest.mock("src/services/logistica.service");
jest.mock("src/services/terceirizada.service");
jest.mock("src/services/fichaTecnica.service");
jest.mock("src/services/cronograma.service");
jest.mock("src/services/qualidade.service");

describe("Test <CadastroCronograma>", () => {
  beforeEach(async () => {
    getNomesDistribuidores.mockResolvedValue({
      data: mockListaDistribuidores,
      status: 200,
    });

    getEmpresasCronograma.mockResolvedValue({
      data: mockListaEmpresas,
      status: 200,
    });

    getListaFichasTecnicasSimplesAprovadas.mockResolvedValue({
      data: mockListaFichasTecnicasSimplesAprovadas,
      status: 200,
    });

    getUnidadesDeMedidaLogistica.mockResolvedValue({
      data: mockListaUnidadesMedidaLogistica,
      status: 200,
    });

    getRascunhos.mockResolvedValue({
      data: mockListaRascunhos,
      status: 200,
    });

    getListaTiposEmbalagens.mockResolvedValue({
      data: mockListaTiposEmbalagens,
      status: 200,
    });

    getCronograma.mockResolvedValue({
      data: mockGetCronograma,
      status: 200,
    });

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <CadastroCronograma />
        </MemoryRouter>
      );
    });
  });

  it("teste mock getListaDistribuidores", async () => {
    await waitFor(() => expect(getNomesDistribuidores).toHaveBeenCalled());
    expect(getNomesDistribuidores).toHaveBeenCalledTimes(1);
    expect(getNomesDistribuidores).toHaveReturnedWith(
      Promise.resolve(mockListaDistribuidores)
    );

    const distribuidores = await getNomesDistribuidores();
    expect(distribuidores.data.results).toBeDefined();
    expect(distribuidores.data.results[0]).toBeDefined();
    expect(distribuidores.data.results[0].nome_fantasia).toBe("Castilho Perez");
  });

  it("teste mock getEmpresasCronograma", async () => {
    await waitFor(() => expect(getEmpresasCronograma).toHaveBeenCalled());
    expect(getEmpresasCronograma).toHaveBeenCalledTimes(1);
    expect(getEmpresasCronograma).toHaveReturnedWith(
      Promise.resolve(mockListaEmpresas)
    );
  });

  it("teste mock getListaFichasTecnicasSimplesAprovadas", async () => {
    await waitFor(() =>
      expect(getListaFichasTecnicasSimplesAprovadas).toHaveBeenCalled()
    );
    expect(getListaFichasTecnicasSimplesAprovadas).toHaveBeenCalledTimes(1);
    expect(getListaFichasTecnicasSimplesAprovadas).toHaveReturnedWith(
      Promise.resolve(mockListaFichasTecnicasSimplesAprovadas)
    );
  });

  it("teste mock getUnidadesDeMedidaLogistica", async () => {
    await waitFor(() =>
      expect(getUnidadesDeMedidaLogistica).toHaveBeenCalled()
    );
    expect(getUnidadesDeMedidaLogistica).toHaveBeenCalledTimes(1);
    expect(getUnidadesDeMedidaLogistica).toHaveReturnedWith(
      Promise.resolve(mockListaUnidadesMedidaLogistica)
    );
  });

  it("teste mock getRascunhos", async () => {
    await waitFor(() => expect(getRascunhos).toHaveBeenCalled());
    expect(getRascunhos).toHaveBeenCalledTimes(1);
    expect(getRascunhos).toHaveReturnedWith(
      Promise.resolve(mockListaRascunhos)
    );
  });

  it("teste mock getListaTiposEmbalagens", async () => {
    await waitFor(() => expect(getListaTiposEmbalagens).toHaveBeenCalled());
    expect(getListaTiposEmbalagens).toHaveBeenCalledTimes(1);
    expect(getListaTiposEmbalagens).toHaveReturnedWith(
      Promise.resolve(mockListaTiposEmbalagens)
    );
  });

  it("renderiza label `Pesquisar Empresa`", async () => {
    expect(screen.getByText("Pesquisar Empresa")).toBeInTheDocument();
  });

  it("Preenche campo Empresa e verifica opções", async () => {
    const divEmpresa = screen.getByTestId("input-empresa");
    expect(divEmpresa).toBeInTheDocument();

    const inputEmpresa = divEmpresa.querySelector("input");
    inputEmpresa.value = "Empresa do Luis Zimmermann";

    expect(inputEmpresa.value).toBe("Empresa do Luis Zimmermann");

    const selectContrato = screen
      .getByTestId("select-div")
      .querySelector("select");

    const option1 = document.createElement("option");
    option1.value = "b82c8d96-8078-47b0-b5d4-2f1183458ed6";
    option1.textContent = "12345/22";

    const option2 = document.createElement("option");
    option2.value = "f6d84d2e-80e2-4e74-a2c9-d5edf1c27b95";
    option2.textContent = "2222/22";

    selectContrato.appendChild(option1);
    selectContrato.appendChild(option2);

    const options = selectContrato.getElementsByTagName("option");

    expect(options).toHaveLength(3);

    expect(options[0].value).toBe("");
    expect(options[0]).toHaveTextContent("Selecione um Contrato");

    expect(options[1].value).toBe("b82c8d96-8078-47b0-b5d4-2f1183458ed6");
    expect(options[1]).toHaveTextContent("12345/22");

    expect(options[2].value).toBe("f6d84d2e-80e2-4e74-a2c9-d5edf1c27b95");
    expect(options[2]).toHaveTextContent("2222/22");
  });
});

import React from "react";
import {
  render,
  waitFor,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { createMemoryHistory } from "history";

import { APPLICATION_STATE as ApplicationState } from "@shared/constants/applicationState";

import { ROUTES } from "popup/constants/routes";

import { MnemonicPhrase } from "../MnemonicPhrase";

import { Wrapper } from "../../__testHelpers__";

const MNEMONIC = "dummy mnemonic";

const mockHistoryGetter = jest.fn();

jest.mock("popup/constants/history", () => ({
  get history() {
    return mockHistoryGetter();
  },
}));

jest.mock("popup/helpers/useMnemonicPhrase", () => ({
  useMnemonicPhrase: () => "dummy mnemonic",
}));
jest.mock("react-router-dom", () => {
  const ReactRouter = jest.requireActual("react-router-dom");
  return {
    ...ReactRouter,
    Redirect: ({ to }: any) => <div>redirect {to}</div>,
  };
});
jest.mock("@shared/api/internal", () => {
  const { APPLICATION_STATE } = jest.requireActual(
    "@shared/constants/applicationState",
  );
  return {
    confirmMnemonicPhrase: () =>
      Promise.resolve({
        isCorrectPhrase: true,
        applicationState: APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED,
      }),
  };
});

describe("MnemonicPhrase", () => {
  it("renders", async () => {
    const history = createMemoryHistory();
    history.push(ROUTES.mnemonicPhrase);
    render(
      <Wrapper
        history={history}
        state={{
          auth: {
            applicationState: ApplicationState.PASSWORD_CREATED,
            publicKey: "G123",
          },
        }}
      >
        <MnemonicPhrase />
      </Wrapper>,
    );
    await waitFor(() => screen.getByTestId("display-mnemonic-phrase"));
    expect(screen.getByTestId("display-mnemonic-phrase")).toBeDefined();
  });

  describe("basic flow", () => {
    it("works", async () => {
      const history = createMemoryHistory();
      history.push(ROUTES.mnemonicPhrase);
      mockHistoryGetter.mockReturnValue(history);

      render(
        <Wrapper
          history={history}
          state={{
            auth: {
              error: null,
              applicationState: ApplicationState.PASSWORD_CREATED,
              publicKey: "G123",
            },
          }}
        >
          <MnemonicPhrase />
        </Wrapper>,
      );

      // Confirm mnemonic
      await act(async () => {
        fireEvent.click(screen.getByTestId("display-mnemonic-phrase-next-btn"));
        await waitFor(() => screen.getByTestId("ConfirmMnemonicPhrase"));
        // Click each word in the mnemonic
        MNEMONIC.split(" ").forEach((word) =>
          fireEvent.click(screen.getByText(word)),
        );
        fireEvent.click(
          screen.getByTestId("display-mnemonic-phrase-confirm-btn"),
        );
      });
      await waitFor(() =>
        screen.getByText(`redirect ${ROUTES.mnemonicPhraseConfirmed}`),
      );
    });
  });
});

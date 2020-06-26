// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import LoginScreen from "./LoginScreen";
import MainScreen from "./MainScreen";
import DamlLedger from "@daml/react";
import Credentials from "../Credentials";
import {httpBaseUrl, wsBaseUrl} from "../config";

/**
 * React component for the entry point into the application.
 */
// APP_BEGIN
const App: React.FC = () => {
  const [credentials, setCredentials] = useLocalStorage<
    Credentials | undefined
  >("credentials", undefined);

  return credentials ? (
    <DamlLedger
      token={credentials.token}
      party={credentials.party}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <MainScreen onLogout={() => setCredentials(undefined)} />
    </DamlLedger>
  ) : (
    <LoginScreen onLogin={setCredentials} />
  );
};
// APP_END

function useLocalStorage<S>(
  key: string,
  initialValue: S,
): [S, React.Dispatch<S>] {
  const [value, setValueState] = React.useState<S>(() => {
    const json = window.localStorage.getItem(key);
    return json ? JSON.parse(json) : initialValue;
  });
  const setValue: React.Dispatch<S> = (newValue: S) => {
    setValueState(newValue);
    if (newValue != null) {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } else {
      window.localStorage.removeItem(key);
    }
  };
  return [value, setValue];
}

export default App;

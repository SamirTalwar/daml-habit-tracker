// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {
  Container,
  Grid,
  Header,
  Icon,
  Segment,
  Divider,
} from "semantic-ui-react";
import {Model} from "@daml.js/create-daml-app";
import {useParty, useLedger, useStreamQuery} from "@daml/react";
import Calendar from "./Calendar";
import HabitList from "./HabitList";
import {Habit, colors} from "./ViewModel";

const MainView: React.FC = () => {
  const ledger = useLedger();
  const username = useParty();

  const habitContracts = useStreamQuery(Model.Habit).contracts;
  const habits = React.useMemo(() => {
    const nextColor = colors();
    const habits: {[id: string]: Habit} = {};
    for (const contract of habitContracts) {
      const payload = contract.payload;
      habits[contract.contractId] = {
        ...payload,
        color: nextColor(),
      };
    }
    return habits;
  }, [habitContracts]);

  const newHabit = (name: string): Promise<void> =>
    ledger
      .create(Model.Habit, {owner: username, keepingHonest: null, name})
      .then(() => {});

  const now = new Date();

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column width={6}>
            <Segment>
              <Header as="h2">
                <Icon name="list" />
                <Header.Content>Habits</Header.Content>
              </Header>
              <Divider />
              <HabitList habits={habits} onAddHabit={newHabit} />
            </Segment>
          </Grid.Column>

          <Grid.Column width={10}>
            <Segment>
              <Header as="h2">
                <Icon name="calendar check outline" />
                <Header.Content>Calendar</Header.Content>
              </Header>
              <Divider />
              <Calendar year={now.getFullYear()} month={now.getMonth() + 1} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MainView;

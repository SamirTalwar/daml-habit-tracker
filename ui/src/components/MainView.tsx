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
import HabitList from "./HabitList";

const MainView: React.FC = () => {
  const ledger = useLedger();
  const username = useParty();
  const habits = useStreamQuery(Model.Habit).contracts;

  const newHabit = (name: string): Promise<void> =>
    ledger
      .create(Model.Habit, {owner: username, keepingHonest: null, name})
      .then(() => {});

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header
              as="h1"
              size="huge"
              color="blue"
              textAlign="center"
              style={{padding: "1ex 0em 0ex 0em"}}
            >
              Habits
            </Header>

            <Segment>
              <Header as="h2">
                <Icon name="list" />
                <Header.Content>Habits</Header.Content>
              </Header>
              <Divider />
              <HabitList
                habits={habits.map(habit => habit.payload)}
                onAddHabit={newHabit}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MainView;

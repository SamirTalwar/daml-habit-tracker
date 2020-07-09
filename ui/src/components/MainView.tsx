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
import {Habits, Recordings, colors} from "./ViewModel";
import {dateAsString} from "../dates";

const MainView: React.FC = () => {
  const ledger = useLedger();
  const username = useParty();

  const habitContracts = useStreamQuery(Model.Habit).contracts;
  const habits = React.useMemo(() => {
    const nextColor = colors();
    const habits: Habits = {};
    for (const {payload} of habitContracts) {
      habits[payload.name] = {
        ...payload,
        color: nextColor(),
      };
    }
    return habits;
  }, [habitContracts]);

  const recordingContracts = useStreamQuery(Model.Recording).contracts;
  const recordings = React.useMemo(() => {
    const recordings: Recordings = {};
    for (const {payload} of recordingContracts) {
      if (!recordings[payload.habit.name]) {
        recordings[payload.habit.name] = {};
      }
      recordings[payload.habit.name][payload.dateCompleted] = true;
    }
    return recordings;
  }, [recordingContracts]);

  console.log(recordings);

  const newHabit = (name: string): Promise<void> =>
    ledger
      .create(Model.Habit, {owner: username, keepingHonest: null, name})
      .then(() => {});

  const recordHabit = (habit: Model.Habit, date: Date): Promise<void> =>
    ledger
      .exerciseByKey(Model.Habit.Habit_Record, habit, {
        dateCompleted: dateAsString(date),
      })
      .then(() => undefined);

  const today = new Date();
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);

  return (
    <Container>
      <Grid centered columns={2}>
        <Grid.Row stretched>
          <Grid.Column width={8}>
            <Segment>
              <Header as="h2">
                <Icon name="list" />
                <Header.Content>Habits</Header.Content>
              </Header>
              <Divider />
              <HabitList
                habits={habits}
                recordings={recordings}
                today={today}
                onAddHabit={newHabit}
                onRecord={recordHabit}
              />
            </Segment>
          </Grid.Column>

          <Grid.Column width={8}>
            <Segment>
              <Header as="h2">
                <Icon name="calendar check outline" />
                <Header.Content>Calendar</Header.Content>
              </Header>
              <Divider />
              <Calendar
                year={today.getFullYear()}
                month={today.getMonth() + 1}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MainView;

// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {Grid} from "semantic-ui-react";
import {Model} from "@daml.js/create-daml-app";
import {useParty, useStreamQuery} from "@daml/react";
import {Habits} from "./ViewModel";

type CalendarEntry = number | undefined;
type Month = number;
type Year = number;

const days = ["M", "Tu", "W", "Th", "F", "Sa", "So"];

type Props = {
  year: Year;
  month: Month;
  habits: Habits;
};

const Calendar: React.FC<Props> = ({year, month, habits}) => {
  // const ledger = useLedger();
  const username = useParty();

  const recordings = useStreamQuery(
    Model.Recording,
    () => ({
      habit: {owner: username},
    }),
    [username, habits],
  ).contracts;
  console.log(recordings);

  const calendar = daysOf(year, month);

  return (
    <Grid centered columns={7}>
      <Grid.Row>
        {days.map(day => (
          <Grid.Column>{day}</Grid.Column>
        ))}
      </Grid.Row>
      {calendar.map(week => (
        <Grid.Row>
          {week.map(day => (
            <Grid.Column>{day}</Grid.Column>
          ))}
        </Grid.Row>
      ))}
    </Grid>
  );
};

const daysOf = (year: Year, month: Month): readonly CalendarEntry[][] => {
  const current = new Date(year, month, 1);
  const end = new Date(year, month + 1, 1);
  const calendar = [];
  let week = [];
  while (current < end) {
    const date = current.getDate();
    const day = current.getDay();
    if (week.length === 0) {
      const emptyCells = day === 0 ? 6 : day - 1;
      for (let i = 0; i < emptyCells; i++) {
        week.push(undefined);
      }
    }
    week.push(date);
    if (day === 0 /* Sunday */) {
      calendar.push(week);
      week = [];
    }
    current.setDate(current.getDate() + 1);
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(undefined);
    }
    calendar.push(week);
  }
  return calendar;
};

export default Calendar;

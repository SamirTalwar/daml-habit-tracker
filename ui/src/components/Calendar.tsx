// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {Table} from "semantic-ui-react";

type CalendarEntry = number | undefined;
type Month = number;
type Year = number;

const days = ["M", "Tu", "W", "Th", "F", "Sa", "So"];

type Props = {
  year: Year;
  month: Month;
};

const Calendar: React.FC<Props> = ({year, month}) => {
  const calendar = daysOf(year, month);

  return (
    <Table columns={7} textAlign="center">
      <Table.Header>
        <Table.Row>
          {days.map(day => (
            <Table.HeaderCell key={day}>{day}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {calendar.map(week => (
          <Table.Row key={week.find(day => day)}>
            {week.map((day, index) => (
              <Table.Cell key={index}>{day}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
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

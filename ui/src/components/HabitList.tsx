// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {Button, Form, Header, Icon, Table} from "semantic-ui-react";
import {Model} from "@daml.js/create-daml-app";
import {Habit, Habits, Recordings} from "./ViewModel";
import {dateAsString} from "../dates";

type Props = {
  habits: Habits;
  recordings: Recordings;
  today: Date;
  onAddHabit: (name: string) => Promise<void>;
  onRecord: (habit: Model.Habit, date: Date) => Promise<void>;
};

const notRecordedClass = "arrow alternate circle right outline";
const recordedClass = "arrow alternate circle right";

/**
 * React component to edit a list of `Party`s.
 */
const HabitList: React.FC<Props> = ({
  habits,
  recordings,
  today,
  onAddHabit,
  onRecord,
}) => {
  const [newHabit, setNewHabit] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addParty = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    try {
      await onAddHabit(newHabit);
      setIsSubmitting(false);
      setNewHabit("");
    } catch (error) {
      console.error(error);
    }
  };

  const yesterday = new Date(today.getTime());
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>Yesterday</Table.HeaderCell>
            <Table.HeaderCell collapsing>Today</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {[...Object.values(habits)]
            .sort((x, y) => x.name.localeCompare(y.name))
            .map(habit => (
              <Table.Row key={habit.name}>
                <Table.Cell>
                  <Record
                    recordings={recordings}
                    habit={habit}
                    date={yesterday}
                    onRecord={onRecord}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Record
                    recordings={recordings}
                    habit={habit}
                    date={today}
                    onRecord={onRecord}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Header>{habit.name}</Header>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <br />
      <Form onSubmit={addParty} loading={isSubmitting}>
        <Form.Input
          fluid
          readOnly={isSubmitting}
          placeholder="Exercise, cook, meditate, learn…"
          value={newHabit}
          onChange={event => setNewHabit(event.currentTarget.value)}
        />
        <Button type="submit">Make it</Button>
      </Form>
    </>
  );
};

const Record = ({
  recordings,
  habit,
  date,
  onRecord,
}: {
  recordings: Recordings;
  habit: Habit;
  date: Date;
  onRecord: (habit: Model.Habit, date: Date) => Promise<void>;
}) =>
  recordings[habit.name] && recordings[habit.name][dateAsString(date)] ? (
    <Icon name={recordedClass} color={habit.color} />
  ) : (
    <Icon
      name={notRecordedClass}
      color={habit.color}
      onClick={() => onRecord(habit, date)}
    />
  );

export default HabitList;

// Copyright (c) 2020 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import {Form, List, Button} from "semantic-ui-react";
import {Model} from "@daml.js/create-daml-app";

type Props = {
  habits: Model.Habit[];
  onAddHabit: (name: string) => Promise<void>;
};

/**
 * React component to edit a list of `Party`s.
 */
const HabitList: React.FC<Props> = ({habits, onAddHabit}) => {
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

  return (
    <List relaxed>
      {[...habits]
        .sort((x, y) => x.name.localeCompare(y.name))
        .map(habit => (
          <List.Item key={habit.name}>
            <List.Icon name="arrow circle right" />
            <List.Content>
              <List.Header>{habit.name}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      <br />
      <Form onSubmit={addParty}>
        <Form.Input
          fluid
          readOnly={isSubmitting}
          loading={isSubmitting}
          placeholder="Exercise, cook, meditate, learn…"
          value={newHabit}
          onChange={event => setNewHabit(event.currentTarget.value)}
        />
        <Button type="submit">Make it</Button>
      </Form>
    </List>
  );
};

export default HabitList;

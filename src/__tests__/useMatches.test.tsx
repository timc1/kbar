/**
 * @jest-environment jsdom
 */

import { useKBar } from "../useKBar";
import { KBarProvider } from "../KBarContextProvider";
import { render, fireEvent, RenderResult } from "@testing-library/react";
import * as React from "react";
import { createAction, Priority } from "../utils";
import { useMatches } from "../useMatches";

jest.mock("../utils", () => {
  return {
    ...jest.requireActual("../utils"),
    // Mock out throttling as we don't need it in our test environment.
    useThrottledValue: (value) => value,
  };
});

function Search() {
  const { search, query } = useKBar((state) => ({
    search: state.searchQuery,
  }));

  return (
    <input
      aria-label="search-input"
      value={search}
      onChange={(e) => query.setSearch(e.target.value)}
    />
  );
}

function Results() {
  const { results } = useMatches();

  return (
    <ul>
      {results.map((result) =>
        typeof result === "string" ? (
          <li key={result}>{result}</li>
        ) : (
          <li key={result.id}>{result.name}</li>
        )
      )}
    </ul>
  );
}

function BasicComponent() {
  const action1 = createAction({ name: "Action 1" });
  const action2 = createAction({ name: "Action 2" });
  const action3 = createAction({ name: "Action 3" });
  const childAction1 = createAction({
    name: "Child Action 1",
    parent: action1.id,
  });

  return (
    <KBarProvider actions={[action1, action2, action3, childAction1]}>
      <Search />
      <Results />
    </KBarProvider>
  );
}

function WithPriorityComponent() {
  const action1 = createAction({ name: "Action 1", priority: Priority.LOW });
  const action2 = createAction({ name: "Action 2", priority: Priority.HIGH });
  const action3 = createAction({ name: "Action 3", priority: Priority.HIGH });
  const action4 = createAction({
    name: "Action 4",
    priority: Priority.HIGH,
    section: {
      name: "Section 1",
      priority: Priority.HIGH,
    },
  });
  const childAction1 = createAction({
    name: "Child Action 1",
    parent: action1.id,
  });

  return (
    <KBarProvider actions={[action1, action2, action3, action4, childAction1]}>
      <Search />
      <Results />
    </KBarProvider>
  );
}

function WithLongNamesComponent() {
  const action1 = createAction({
    name: "Action: This is a long name ending by toto",
  });
  const action2 = createAction({
    name: "Action: This is a long name also ending by toto",
  });
  const action3 = createAction({
    name: "Action: This is a long name ending by titi",
  });

  return (
    <KBarProvider actions={[action1, action2, action3]}>
      <Search />
      <Results />
    </KBarProvider>
  );
}

function MultiWordComponent() {
  const twitter = createAction({
    name: "Twitter",
    keywords: "social contact dm",
  });
  const contact = createAction({
    name: "Contact",
    keywords: "email hello",
  });
  const gettingStarted = createAction({ name: "Getting started" });

  return (
    <KBarProvider actions={[twitter, contact, gettingStarted]}>
      <Search />
      <Results />
    </KBarProvider>
  );
}

const setup = (Component: React.ComponentType) => {
  const utils = render(<Component />);
  const input = utils.getByLabelText("search-input");
  return {
    input,
    ...utils,
  } as Utils;
};

type Utils = RenderResult & { input: HTMLInputElement };

describe("useMatches", () => {
  describe("Basic", () => {
    let utils: Utils;
    beforeEach(() => {
      utils = setup(BasicComponent);
    });

    it("returns root results with an empty search query", () => {
      const results = utils.getAllByText(/Action/i);
      expect(results.length).toEqual(3);
      expect(results[0].textContent).toEqual("Action 1");
      expect(results[1].textContent).toEqual("Action 2");
      expect(results[2].textContent).toEqual("Action 3");
    });

    it("returns nested results when search query is present", () => {
      const { input } = utils;
      fireEvent.change(input, { target: { value: "1" } });
      const results = utils.getAllByText(/Action/i);
      expect(results.length).toEqual(2);
      expect(results[0].textContent).toEqual("Action 1");
      expect(results[1].textContent).toEqual("Child Action 1");
    });
  });

  describe("With priority", () => {
    let utils: Utils;
    beforeEach(() => {
      utils = setup(WithPriorityComponent);
    });

    it("returns a prioritized list", () => {
      const results = utils.getAllByText(/Action/i);
      expect(results.length).toEqual(4);

      expect(results[0].textContent).toEqual("Action 4");
      expect(results[1].textContent).toEqual("Action 2");
      expect(results[2].textContent).toEqual("Action 3");
      expect(results[3].textContent).toEqual("Action 1");

      expect(utils.queryAllByText(/Section 1/i));
    });
  });
  describe("With long names", () => {
    let utils: Utils;
    beforeEach(() => {
      utils = setup(WithLongNamesComponent);
    });

    it("returns result matching the query even if match is on a word far in the name", () => {
      const { input } = utils;
      fireEvent.change(input, { target: { value: "toto" } });
      const results = utils.getAllByText(/Action/i);
      expect(results.length).toEqual(2);
      expect(results[0].textContent).toEqual(
        "Action: This is a long name ending by toto"
      );
      expect(results[1].textContent).toEqual(
        "Action: This is a long name also ending by toto"
      );
    });
  });

  describe("With multi word queries", () => {
    let utils: Utils;
    beforeEach(() => {
      utils = setup(MultiWordComponent);
    });

    const names = () =>
      utils.getAllByRole("listitem").map((el) => el.textContent);

    it("matches a query spanning both the name and the keywords", () => {
      // "social" is a keyword of Twitter, "twitter" is its name; neither field
      // contains both words.
      fireEvent.change(utils.input, { target: { value: "social twitter" } });
      expect(names()).toEqual(["Twitter"]);
    });

    it("matches regardless of the order the words are typed in", () => {
      fireEvent.change(utils.input, { target: { value: "contact email" } });
      expect(names()).toEqual(["Contact"]);
    });

    it("matches when each word is only a prefix", () => {
      fireEvent.change(utils.input, { target: { value: "get sta" } });
      expect(names()).toEqual(["Getting started"]);
    });

    it("narrows rather than widens as words are added", () => {
      fireEvent.change(utils.input, { target: { value: "contact" } });
      // "contact" is Contact's name and one of Twitter's keywords.
      expect(names()).toEqual(expect.arrayContaining(["Contact", "Twitter"]));

      fireEvent.change(utils.input, { target: { value: "contact hello" } });
      expect(names()).toEqual(["Contact"]);
    });

    it("returns nothing when a word matches no action", () => {
      fireEvent.change(utils.input, { target: { value: "contact zzzzz" } });
      expect(utils.queryAllByRole("listitem")).toEqual([]);
    });
  });
});

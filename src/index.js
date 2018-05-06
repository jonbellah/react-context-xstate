import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Machine } from 'xstate';

import Stoplight from './Stoplight';

const initialState = 'red';

const Context = React.createContext({
  currentState: initialState,
  transition: () => {},
});

const Light = () => (
  <Context.Consumer>
    {({ currentState }) => <Stoplight color={currentState} />}
  </Context.Consumer>
);

const ChangeLight = () => (
  <Context.Consumer>
    {({ transition }) => (
      <button
        className="bg-transparent bw0 fw7 f3 pointer"
        onClick={() => transition({ type: 'TIMER' })}
      >
        Next Light &rarr;
      </button>
    )}
  </Context.Consumer>
);

class App extends Component {
  static lightMachine = Machine({
    initial: initialState,
    states: {
      green: { on: { TIMER: 'yellow' } },
      yellow: { on: { TIMER: 'red' } },
      red: { on: { TIMER: 'green' } },
    },
  });

  constructor() {
    super();

    this.state = {
      currentState: App.lightMachine.initialState.value,
      transition: event => this.doTransition(event),
    };
  }

  doTransition(event) {
    const { currentState } = this.state;
    const nextState = App.lightMachine.transition(currentState, event.type)
      .value;

    this.setState({ currentState: nextState });
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        <div className="flex justify-center items-center flex-column pa6">
          <div className="mb5">
            <Light />
          </div>
          <ChangeLight />
        </div>
      </Context.Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

import React from "react";
import "./App.css";

type AppProps = {
  baseHost: string;
};
type AppState = {
  temperature: number;
  humidity: number;
  time: string;
};
class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    temperature: 0,
    humidity: 0,
    time: ""
  };
  componentDidMount() {
    const ws = new WebSocket("ws://" + this.props.baseHost + "/current");
    ws.onmessage = (evt: MessageEvent) => {
      const data: any[] = JSON.parse(evt.data);
      this.setState({ time: data[0], temperature: data[1], humidity: data[2] });
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <CurrentValues temperature={this.state.temperature} humidity={this.state.humidity} time={this.state.time} />
        </header>
      </div>
    );
  }
}


const CurrentValues = ({ temperature, humidity, time }: { temperature: number, humidity: number, time: string }) => {
  return (
    <div>
      <span>{temperature}°C</span><br />
      <span>RH: {humidity}%</span><br />
      <small>{time}</small>
    </div>
  )
}

export default App;

import React from "react";
import "./App.css";
import { ColorGradientNumber, RGB, Level } from "./presentational/ColorGradientText";

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
      <Temperature value={temperature} /><br />
      <Humidity value={humidity} /><br />
      <small>{time}</small>
    </div>
  )
}

const Temperature = ({ value: temperature }: { value: number }) => <ColorGradientNumber levels={[
  new Level(13, new RGB(173, 216, 230)),
  new Level(30, new RGB(255, 0, 0))
]} value={temperature} unit="°C" icon="🌡️" />

const Humidity = ({ value }: { value: number }) => <ColorGradientNumber levels={[
  new Level(55, new RGB(0, 128, 0)),
  new Level(60, new RGB(255, 255, 0)),
  new Level(65, new RGB(255, 0, 0))
]} value={value} unit=" %" icon="💧" />

export default App;

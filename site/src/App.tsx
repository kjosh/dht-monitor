import React from "react";
import ApiClient, { AirQualityReading } from "./api/ApiClient";
import "./App.css";
import { ColorGradientNumber, RGB, Level } from "./presentational/ColorGradientNumber";

type AppProps = {
  baseHost: string;
};

type AppState = {
  current: AirQualityReading;
  historical: AirQualityReading[];
};

const DEFAULT_AIR_QUALITY: AirQualityReading = { humidity: 0, temperature: 0, time: new Date() }
const CUTOFF_TIME_IN_MINUTES = 15;

class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    current: DEFAULT_AIR_QUALITY,
    historical: []
  };

  componentDidMount() {
    const apiClient = new ApiClient(this.props.baseHost, false);
    apiClient.getData().then(historical => this.setState({ historical }));
    apiClient.onMessage((current: AirQualityReading) => {
      this.setState({ current });
      this.updateFavIcon(current.humidity);
      let historical = this.state.historical;
      if (historical.length > 0 && this.state.historical[historical.length - 1].time !== current.time) {
        historical.push(current);
        const cutoff = new Date(new Date().getTime() - (CUTOFF_TIME_IN_MINUTES * 60 * 1000));
        historical = historical.filter(reading => reading.time.getTime() > cutoff.getTime());
        this.setState({ historical });
      }
    });
  }

  updateFavIcon(humidity: number) {
    const favicon: any = document.getElementById("favicon");
    if (favicon) {
      let faviconSuffix = "bad";
      if (humidity <= 56) {
        faviconSuffix = "good";
      } else if (humidity <= 61) {
        faviconSuffix = "medium";
      }
      favicon.href = process.env.PUBLIC_URL + `/favicon-${faviconSuffix}.ico`;
    }
  }

  render() {
    const current = this.state.current;
    return (
      <div className="App">
        <header className="App-header">
          <CurrentAirQuality temperature={current.temperature} humidity={current.humidity} time={current.time} />
        </header>
      </div>
    );
  }
}

const CurrentAirQuality = ({ temperature, humidity, time }: AirQualityReading) => {
  return (
    <div>
      <Temperature value={temperature} /><br />
      <Humidity value={humidity} /><br />
      <small>{time.toISOString()}</small>
    </div>
  )
}

const Temperature = ({ value }: { value: number }) => <ColorGradientNumber levels={[
  new Level(15, new RGB(3, 169, 244)),
  new Level(19, new RGB(225, 225, 225)),
  new Level(24, new RGB(220, 20, 60))
]} value={value} unit="°C" icon="🌡️" />

const Humidity = ({ value }: { value: number }) => <ColorGradientNumber levels={[
  new Level(55, new RGB(0, 128, 0)),
  new Level(60, new RGB(255, 255, 0)),
  new Level(65, new RGB(255, 0, 0))
]} value={value} unit=" %" icon="💧" />

export default App;

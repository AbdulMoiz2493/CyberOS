import { useState } from "react";
import Icon from "../Icons";

const Weather = () => {
  const [unit, setUnit] = useState("C");
  const [location, setLocation] = useState("San Francisco");

  const currentWeather = {
    temp: 22,
    condition: "Partly Cloudy",
    icon: "CloudSun",
    humidity: 65,
    wind: 12,
    feelsLike: 20,
    uv: 5,
    visibility: 10,
    pressure: 1015,
  };

  const hourlyForecast = [
    { time: "Now", temp: 22, icon: "CloudSun" },
    { time: "1PM", temp: 24, icon: "Sun" },
    { time: "2PM", temp: 25, icon: "Sun" },
    { time: "3PM", temp: 25, icon: "Sun" },
    { time: "4PM", temp: 24, icon: "CloudSun" },
    { time: "5PM", temp: 23, icon: "CloudSun" },
    { time: "6PM", temp: 21, icon: "Cloud" },
    { time: "7PM", temp: 19, icon: "Cloud" },
  ];

  const weeklyForecast = [
    { day: "Today", high: 25, low: 18, icon: "CloudSun", condition: "Partly Cloudy" },
    { day: "Tomorrow", high: 27, low: 19, icon: "Sun", condition: "Sunny" },
    { day: "Wednesday", high: 26, low: 18, icon: "Sun", condition: "Sunny" },
    { day: "Thursday", high: 23, low: 17, icon: "CloudRain", condition: "Light Rain" },
    { day: "Friday", high: 21, low: 15, icon: "CloudRain", condition: "Rainy" },
    { day: "Saturday", high: 22, low: 16, icon: "Cloud", condition: "Cloudy" },
    { day: "Sunday", high: 24, low: 17, icon: "CloudSun", condition: "Partly Cloudy" },
  ];

  const convertTemp = (temp) => {
    if (unit === "F") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return temp;
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-blue-900/50 to-os-bg">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="MapPin" size={18} className="text-white/60" />
          <span className="text-white font-medium">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-2 py-1 rounded text-sm transition-colors ${
              unit === "C" ? "bg-white/20 text-white" : "text-white/60"
            }`}
            onClick={() => setUnit("C")}
          >
            °C
          </button>
          <button
            className={`px-2 py-1 rounded text-sm transition-colors ${
              unit === "F" ? "bg-white/20 text-white" : "text-white/60"
            }`}
            onClick={() => setUnit("F")}
          >
            °F
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="px-4 py-8 text-center">
        <Icon name={currentWeather.icon} size={80} className="text-yellow-300 mx-auto mb-4" />
        <div className="text-6xl font-light text-white mb-2">
          {convertTemp(currentWeather.temp)}°
        </div>
        <div className="text-xl text-white/80 mb-4">{currentWeather.condition}</div>
        <div className="text-sm text-white/60">
          Feels like {convertTemp(currentWeather.feelsLike)}°
        </div>
      </div>

      {/* Weather Details */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <Icon name="Droplet" size={20} className="text-blue-400 mx-auto mb-1" />
            <div className="text-sm text-white">{currentWeather.humidity}%</div>
            <div className="text-xs text-white/40">Humidity</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <Icon name="Wind" size={20} className="text-white/60 mx-auto mb-1" />
            <div className="text-sm text-white">{currentWeather.wind} km/h</div>
            <div className="text-xs text-white/40">Wind</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <Icon name="Sun" size={20} className="text-yellow-400 mx-auto mb-1" />
            <div className="text-sm text-white">{currentWeather.uv}</div>
            <div className="text-xs text-white/40">UV Index</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 text-center">
            <Icon name="Eye" size={20} className="text-white/60 mx-auto mb-1" />
            <div className="text-sm text-white">{currentWeather.visibility} km</div>
            <div className="text-xs text-white/40">Visibility</div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-white/60 mb-3">Hourly Forecast</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className={`flex-shrink-0 p-3 rounded-xl text-center ${
                index === 0 ? "bg-white/20" : "bg-white/10"
              }`}
            >
              <div className="text-xs text-white/60 mb-2">{hour.time}</div>
              <Icon name={hour.icon} size={24} className="text-white/80 mx-auto mb-2" />
              <div className="text-sm text-white">{convertTemp(hour.temp)}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Forecast */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-white/60 mb-3">7-Day Forecast</h3>
        <div className="space-y-2">
          {weeklyForecast.map((day, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/10"
            >
              <div className="w-24 text-sm text-white">{day.day}</div>
              <Icon name={day.icon} size={24} className="text-white/80" />
              <div className="flex-1 text-sm text-white/60">{day.condition}</div>
              <div className="text-sm">
                <span className="text-white">{convertTemp(day.high)}°</span>
                <span className="text-white/40 mx-1">/</span>
                <span className="text-white/60">{convertTemp(day.low)}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;

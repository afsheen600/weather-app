import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  CircularProgress,
  Paper,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import {
  WbSunny,
  Cloud,
  Thunderstorm,
  AcUnit,
  Water,
  LocationOn,
  Air,
  WaterDrop,
  Visibility,
  Compress,
  Thermostat,
} from "@mui/icons-material";

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Sys {
  country: string;
}

interface WeatherData {
  name: string;
  weather: Weather[];
  main: Main;
  wind: Wind;
  sys: Sys;
  visibility: number;
}

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchTerm, setSearchTerm] = useState("London");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Consider using environment variables for the API key
  const API_KEY = "12b6b681ca93875626bfbc997f8deef7";

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("City not found. Please try another location.");
      }
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData(searchTerm);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchWeatherData(searchTerm);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconStyle = { fontSize: "4rem" };
    switch (condition) {
      case "Clear":
        return <WbSunny sx={{ ...iconStyle, color: "#FFD700" }} />;
      case "Clouds":
        return <Cloud sx={{ ...iconStyle, color: "#A9A9A9" }} />;
      case "Rain":
      case "Drizzle":
        return <Water sx={{ ...iconStyle, color: "#1E90FF" }} />;
      case "Thunderstorm":
        return <Thunderstorm sx={{ ...iconStyle, color: "#9932CC" }} />;
      case "Snow":
        return <AcUnit sx={{ ...iconStyle, color: "#E0FFFF" }} />;
      default:
        return <WbSunny sx={iconStyle} />;
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          width: "100%",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label="Enter city name"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.8)",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              minWidth: isMobile ? "100%" : 150,
              borderRadius: 2,
              py: 1.5,
              fontWeight: "bold",
            }}
            disabled={loading}
          >
            {loading ? "Searching..." : "Get Weather"}
          </Button>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={60} />
          </Box>
        )}

        {error && (
          <Box my={2} p={2} bgcolor="error.light" borderRadius={2}>
            <Typography color="error.main" align="center">
              {error}
            </Typography>
          </Box>
        )}

        {weatherData && !loading && (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              background: "rgba(255,255,255,0.7)",
            }}
          >
            <CardContent>
              <Stack spacing={3}>
                {/* Location and Main Weather */}
                <Box sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocationOn color="primary" />
                    <Typography variant="h5" sx={{ ml: 1, fontWeight: "bold" }}>
                      {weatherData.name}, {weatherData.sys.country}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    {getWeatherIcon(weatherData.weather[0].main)}
                    <Typography variant="h2" sx={{ ml: 2, fontWeight: "bold" }}>
                      {Math.round(weatherData.main.temp)}°C
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {weatherData.weather[0].description}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Feels like: {Math.round(weatherData.main.feels_like)}°C
                  </Typography>
                </Box>

                <Divider />

                {/* Weather Details */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
                    gap: 2,
                  }}
                >
                  <WeatherDetail
                    icon={<Thermostat />}
                    label="Min/Max"
                    value={`${Math.round(
                      weatherData.main.temp_min
                    )}°/${Math.round(weatherData.main.temp_max)}°`}
                  />
                  <WeatherDetail
                    icon={<WaterDrop />}
                    label="Humidity"
                    value={`${weatherData.main.humidity}%`}
                  />
                  <WeatherDetail
                    icon={<Air />}
                    label="Wind"
                    value={`${weatherData.wind.speed} m/s`}
                  />
                  <WeatherDetail
                    icon={<Compress />}
                    label="Pressure"
                    value={`${weatherData.main.pressure} hPa`}
                  />
                  <WeatherDetail
                    icon={<Visibility />}
                    label="Visibility"
                    value={`${(weatherData.visibility / 1000).toFixed(1)} km`}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

interface WeatherDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const WeatherDetail: React.FC<WeatherDetailProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 1.5,
        backgroundColor: "rgba(255,255,255,0.5)",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        {icon}
        <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: "bold" }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="h6">{value}</Typography>
    </Box>
  );
};

export default WeatherApp;

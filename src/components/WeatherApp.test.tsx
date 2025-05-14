import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import WeatherApp from "./WeatherApp";
import { ThemeProvider, createTheme } from "@mui/material";

// Mock fetch
global.fetch = jest.fn();

const mockWeatherData = {
  name: "London",
  sys: { country: "GB" },
  weather: [{ main: "Clear", description: "clear sky" }],
  main: {
    temp: 20,
    feels_like: 19,
    temp_min: 18,
    temp_max: 22,
    pressure: 1015,
    humidity: 65,
  },
  wind: { speed: 4.12, deg: 300 },
  visibility: 10000,
};

const mockFetch = (success = true) => {
  (fetch as jest.Mock).mockImplementationOnce(() =>
    Promise.resolve({
      ok: success,
      json: () => Promise.resolve(mockWeatherData),
    })
  );
};

const renderWithTheme = (component: React.ReactElement) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("WeatherApp", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    mockFetch();
  });

  it("renders initial search field", () => {
    renderWithTheme(<WeatherApp />);
    expect(screen.getByTestId("city-input")).toBeInTheDocument();
    expect(screen.getByTestId("get-weather-button")).toBeInTheDocument();
  });

  it("shows loading state while fetching data", async () => {
    renderWithTheme(<WeatherApp />);
    expect(
      screen.getByRole("button", { name: /searching\.\.\./i })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/london/i)).toBeInTheDocument();
    });
  });

  it("displays weather data after successful fetch", async () => {
    renderWithTheme(<WeatherApp />);

    setTimeout(() => {
      expect(screen.getByText(/london/i)).toBeInTheDocument();
      expect(screen.getByText(/20°C/)).toBeInTheDocument();
      expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    }, 200);
  });

  it("handles search submission", async () => {
    renderWithTheme(<WeatherApp />);
    const input = screen.getByRole("textbox");
    const button = screen.getByTestId("get-weather-button");

    fireEvent.change(input, { target: { value: "Paris" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("Paris"));
    });
  });

  it("displays error message when city is not found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    renderWithTheme(<WeatherApp />);
    const input = screen.getByTestId("city-input");
    const button = screen.getByTestId("get-weather-button");

    fireEvent.change(input, { target: { value: "NonExistentCity" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/city not found/i)).toBeInTheDocument();
    });
  });
});

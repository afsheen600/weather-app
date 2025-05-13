import React from "react";
import { render, screen } from "@testing-library/react";
// import App from "./App";
import WeatherApp from "./components/WeatherApp";

test("renders learn react link", () => {
  render(<WeatherApp />);
  const linkElement = screen.getByText(/WeatherApp/i);
  expect(linkElement).toBeInTheDocument();
});

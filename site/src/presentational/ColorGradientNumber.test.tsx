import React from 'react';
import { unmountComponentAtNode } from "react-dom";
import { render, screen } from '@testing-library/react';
import { ColorGradientNumber, Level, RGB, convertScale } from './ColorGradientNumber'
import { act } from 'react-dom/test-utils';

let container: HTMLElement;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
});

const levels = [
  new Level(10, new RGB(5, 5, 5)),
  new Level(20, new RGB(15, 15, 15)),
  new Level(30, new RGB(50, 50, 55))
];

it('renders exact lower bound', () => {
  testBounds(10, "rgb(5, 5, 5)");
});

it('renders below lower bound', () => {
  testBounds(5, "rgb(5, 5, 5)");
});

it('renders between middle and upper bound', () => {
  testBounds(25, "rgb(33, 33, 35)");
});

it('renders above upper bound', () => {
  testBounds(100, "rgb(50, 50, 55)");
});

const testBounds = (value: number, expectedRgb: string) => {
  render(<ColorGradientNumber levels={levels} value={value} />);
  const numberElement = screen.getByText(value.toFixed(1));
  expect(numberElement).toBeVisible();
  expect(numberElement.tagName).toBe('SPAN');
  const style = window.getComputedStyle(numberElement);
  expect(style.color).toBe(expectedRgb);
}

it("converts scale", () => {
  expect(convertScale(10, 10, 20, 5, 15)).toBe(5);
})
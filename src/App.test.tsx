import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { ATTRIBUTE_LIST, CLASS_LIST } from "./consts";

describe("App Component", () => {
  test("renders initial state correctly", () => {
    render(<App />);
    expect(screen.getByText("React Coding Exercise")).toBeInTheDocument();

    // Check if all attributes are rendered with initial value
    ATTRIBUTE_LIST.forEach((attr) => {
      expect(screen.getByText(attr)).toBeInTheDocument();
    });
  });

  test("calculates modifier correctly for specific attribute", () => {
    render(<App />);
    const firstAttribute = ATTRIBUTE_LIST[0];

    expect(screen.getByText(firstAttribute)).toHaveTextContent("Strength");

    const increaseButton = screen.getByLabelText(`Increase ${firstAttribute}`);
    fireEvent.click(increaseButton);
    expect(screen.getByText(firstAttribute)).toHaveTextContent("Strength");
  });

  test("displays class requirements when clicked", () => {
    render(<App />);
    const firstClass = Object.keys(CLASS_LIST)[0];
    fireEvent.click(screen.getByText(firstClass));

    expect(screen.getByText(`${firstClass} Requirements`)).toBeInTheDocument();
  });

  test("shows correct class availability based on requirements", () => {
    render(<App />);

    // Initially all classes should be red (requirements not met)
    Object.keys(CLASS_LIST).forEach((className) => {
      const classElement = screen.getByText(className);
      expect(classElement).toHaveStyle({ color: "red" });
    });

    // Increase attributes to meet requirements for first class
    const firstClass = Object.keys(CLASS_LIST)[0];
    const requirements = CLASS_LIST[firstClass as keyof typeof CLASS_LIST];

    // Increase relevant attributes
    Object.entries(requirements).forEach(([attr]) => {
      const increaseButton = screen.getAllByLabelText(`Increase ${attr}`)[0];
      // Click enough times to meet requirement
      for (let i = 0; i < 5; i++) {
        fireEvent.click(increaseButton);
      }
    });

    // Check if class is now available (green)
    expect(screen.getByText(firstClass)).toHaveStyle({ color: "green" });
  });

  test("handles edge cases for attribute values", () => {
    render(<App />);
    const firstAttributeIncrease = screen.getAllByLabelText(/Increase/)[0];
    const firstAttributeDecrease = screen.getAllByLabelText(/Decrease/)[0];

    // Test multiple increases
    for (let i = 0; i < 10; i++) {
      fireEvent.click(firstAttributeIncrease);
    }
    expect(screen.getByText("20")).toBeInTheDocument();

    // Test multiple decreases
    for (let i = 0; i < 15; i++) {
      fireEvent.click(firstAttributeDecrease);
    }
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { ATTRIBUTE_LIST, SKILL_LIST, CLASS_LIST } from "./consts";
import useCharacterAPI from "./useCharacterAPI";

jest.mock("./useCharacterAPI");

describe("App Component", () => {
  beforeEach(() => {
    (useCharacterAPI as jest.Mock).mockReturnValue({
      data: {
        body: {
          attributes: ATTRIBUTE_LIST.map((attr) => ({ name: attr, value: 10 })),
          skills: SKILL_LIST.map((skill) => ({ ...skill, pointsSpent: 0 })),
        },
      },
      isLoading: false,
      error: null,
      saveData: jest.fn(),
    });
  });

  it("should render without crashing", () => {
    render(<App />);
    expect(screen.getByText("React Coding Exercise")).toBeInTheDocument();
  });

  it("should render attribute table with default values", () => {
    render(<App />);
    ATTRIBUTE_LIST.forEach((attributeName) => {
      const valueCell = screen.getByTestId(`attribute-value-${attributeName}`);
      expect(valueCell).toHaveTextContent("10");
    });
  });

  it("should allow increasing and decreasing attribute values", () => {
    render(<App />);

    ATTRIBUTE_LIST.forEach((attributeName) => {
      const increaseButton = screen.getByTestId(`increase-${attributeName}`);
      const decreaseButton = screen.getByTestId(`decrease-${attributeName}`);

      //get value by testid
      const valueCell = screen.getByTestId(`attribute-value-${attributeName}`);

      expect(valueCell).toHaveTextContent("10");

      fireEvent.click(increaseButton);
      expect(valueCell).toHaveTextContent("11");

      fireEvent.click(decreaseButton);
      expect(valueCell).toHaveTextContent("10");
    });
  });

  it("should display the correct class color based on attribute requirements", () => {
    render(<App />);

    Object.entries(CLASS_LIST).forEach(([className, requirements]) => {
      const classElement = screen.getByText(className);
      const meetsRequirements = Object.entries(requirements).every(
        ([name, min]) => {
          const attribute = ATTRIBUTE_LIST.find((attr) => attr === name);
          return attribute && 10 >= min;
        }
      );

      expect(classElement).toHaveStyle(
        `color: ${meetsRequirements ? "green" : "red"}`
      );
    });
  });

  it("should handle skill points correctly", () => {
    render(<App />);

    SKILL_LIST.forEach((skill) => {
      const increaseButton = screen.getByLabelText(
        `Increase points for ${skill.name}`
      );
      const decreaseButton = screen.getByLabelText(
        `Decrease points for ${skill.name}`
      );

      // Find the skill points element by its test ID
      const pointsText = screen.getByTestId(`Points-${skill.name}`);

      expect(pointsText).toHaveTextContent("Points: 0");

      fireEvent.click(increaseButton);
      expect(pointsText).toHaveTextContent("Points: 1");

      fireEvent.click(decreaseButton);
      expect(pointsText).toHaveTextContent("Points: 0");
    });
  });

  it("should save character data when Save button is clicked", async () => {
    const saveDataMock = jest.fn();
    (useCharacterAPI as jest.Mock).mockReturnValue({
      data: {
        body: {
          attributes: ATTRIBUTE_LIST.map((attr) => ({ name: attr, value: 10 })),
          skills: SKILL_LIST.map((skill) => ({ ...skill, pointsSpent: 0 })),
        },
      },
      isLoading: false,
      error: null,
      saveData: saveDataMock,
    });

    render(<App />);
    const saveButton = screen.getByText("Save Character");

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveDataMock).toHaveBeenCalledWith({
        attributes: ATTRIBUTE_LIST.map((attr) => ({ name: attr, value: 10 })),
        skills: SKILL_LIST.map((skill) => ({ ...skill, pointsSpent: 0 })),
      });
    });
  });

  it("should display loading state when isLoading is true", () => {
    (useCharacterAPI as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      saveData: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display error state when error occurs", () => {
    const errorMessage = "Error fetching data";
    (useCharacterAPI as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: errorMessage,
      saveData: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});

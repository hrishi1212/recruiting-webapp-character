import { useState, useCallback } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST } from "./consts";

function App() {
  const [attributes, setAttributes] = useState(
    ATTRIBUTE_LIST.map((attr) => ({ name: attr, value: 10 })) // Default value set to 10
  );
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Helper function to calculate modifier
  const calculateModifier = useCallback((value: number): number => {
    return Math.floor((value - 10) / 2);
  }, []);

  // Helper function to update attribute value
  const updateAttribute = useCallback((name: string, delta: number): void => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.name === name ? { ...attr, value: attr.value + delta } : attr
      )
    );
  }, []);

  // Helper function to check if class requirements are met
  const meetsClassRequirements = useCallback(
    (requirements: Record<string, number>): boolean => {
      return Object.entries(requirements).every(([name, min]) => {
        const attribute = attributes.find((attr) => attr.name === name);
        return attribute && attribute.value >= min;
      });
    },
    [attributes]
  );

  //// Helper function to render class requirements
  const renderAttributes = (
    classAttributes: Record<string, string | number>
  ) => {
    return Object.entries(classAttributes ?? {}).map(([attribute, min]) => (
      <li key={attribute}>
        {attribute}: {min}
      </li>
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <table>
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
              <th>Modifier</th>
              <th>Controls</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute) => (
              <tr key={attribute.name}>
                <td>{attribute.name}</td>
                <td>{attribute.value}</td>
                <td>{calculateModifier(attribute.value)}</td>
                <td>
                  <button
                    aria-label={`Increase ${attribute.name}`}
                    onClick={() => updateAttribute(attribute.name, 1)}
                  >
                    +
                  </button>
                  <button
                    aria-label={`Decrease ${attribute.name}`}
                    onClick={() => updateAttribute(attribute.name, -1)}
                  >
                    -
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Classes</h2>
        <ul>
          {Object.entries(CLASS_LIST).map(([className, requirements]) => (
            <li
              key={className}
              style={{
                color: meetsClassRequirements(requirements) ? "green" : "red",
                cursor: "pointer",
              }}
              onClick={() => setSelectedClass(className)}
            >
              {className}
            </li>
          ))}
        </ul>
        {selectedClass && (
          <div className="class-details">
            <h3>{selectedClass} Requirements</h3>
            <ul>
              {renderAttributes(
                CLASS_LIST[selectedClass as keyof typeof CLASS_LIST]
              )}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;

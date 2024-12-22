import { useCallback, useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST } from "./consts";

function App() {
  const [attributes, setAttributes] = useState(
    ATTRIBUTE_LIST.map((attr) => ({ name: attr, value: 10 })) // Default value set to 10
  );

  // Helper function to calculate modifier
  const calculateModifier = useCallback((value) => {
    return Math.floor((value - 10) / 2);
  }, []);

  const updateAttribute = useCallback((name, delta) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.name === name ? { ...attr, value: attr.value + delta } : attr
      )
    );
  }, []);

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
      </section>
    </div>
  );
}

export default App;

import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, SKILL_LIST, CLASS_LIST } from "./consts";
import useCharacterAPI from "./useCharacterAPI";

function App() {
  const { data, isLoading, error, saveData } = useCharacterAPI();

  // Initialize state for attributes and skills
  const [attributes, setAttributes] = useState(
    ATTRIBUTE_LIST.map((attr) => ({ name: attr, value: 10 })) // Default value set to 10
  );

  // Initialize state for skills
  const [skills, setSkills] = useState(
    SKILL_LIST.map((skill) => ({ ...skill, pointsSpent: 0 })) // Default points spent is 0
  );

  // Initialize state for selected class
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Load data from API when component mounts
  useEffect(() => {
    if (data) {
      setAttributes(data.body.attributes || []);
      setSkills(data.body.skills || []);
    }
  }, [data]);

  // Helper function to calculate modifier for attributes
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

  // Helper function to calculate total skill value (points spent + attribute modifier)
  const calculateSkillValue = (skillName: string): number => {
    const skill = skills.find((s) => s.name === skillName);
    const attribute = attributes.find(
      (attr) => attr.name === skill?.attributeModifier
    );
    if (skill && attribute) {
      const attributeModifier = calculateModifier(attribute.value);
      return skill.pointsSpent + attributeModifier;
    }
    return 0;
  };

  // Helper function to update points spent on a skill
  const updateSkillPoints = (skillName: string, delta: number): void => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.name === skillName
          ? { ...skill, pointsSpent: Math.max(0, skill.pointsSpent + delta) } // Prevent negative points
          : skill
      )
    );
  };

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

  // Helper function to render class requirements
  const renderAttributes = (classAttributes: Record<string, number>) => {
    return Object.entries(classAttributes ?? {}).map(([attribute, min]) => (
      <li key={attribute}>
        {attribute}: {min}
      </li>
    ));
  };

  //function to save attributes and skills
  const handleSave = () => {
    const characterData = {
      attributes,
      skills,
    };
    saveData(characterData);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div className="left-column">
          {/* Attributes Table */}
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
        </div>

        <div className="right-column">
          {/* Classes Section */}
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

          {/* Class Details */}
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

          {/* Skills Table */}
          <h2>Skills</h2>
          {skills.map((skill) => {
            const totalSkillValue = calculateSkillValue(skill.name);
            const attribute = attributes.find(
              (attr) => attr.name === skill.attributeModifier
            );
            const attributeModifier = attribute
              ? calculateModifier(attribute.value)
              : 0;
            const pointsAvailable = 10 + 4 * attributeModifier;

            return (
              <div key={skill.name}>
                <h3>{skill.name}</h3>
                <div>
                  <p>
                    Points: {skill.pointsSpent} (Max: {pointsAvailable}) -{" "}
                    Modifier ({skill.attributeModifier}): {attributeModifier} -{" "}
                    Total: {totalSkillValue}
                  </p>
                  <button
                    aria-label={`Increase points for ${skill.name}`}
                    onClick={() =>
                      skill.pointsSpent < pointsAvailable &&
                      updateSkillPoints(skill.name, 1)
                    }
                  >
                    +
                  </button>
                  <button
                    aria-label={`Decrease points for ${skill.name}`}
                    onClick={() => updateSkillPoints(skill.name, -1)}
                  >
                    -
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <button onClick={handleSave}>Save Character</button>
        </div>
      </section>
    </div>
  );
}

export default App;

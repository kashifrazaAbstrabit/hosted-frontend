import { useEffect, useState } from "react";
import Select from "react-select";
import { SingleValue } from "react-select";
import { AppDispatch, RootState } from "../../types/reduxTypes";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../../redux/projectSlice";

export interface ProjectOption {
  readonly value: number;
  readonly label: string;
  readonly color?: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

const SelectProject = ({
  setSelectedProjectDetails,
}: {
  setSelectedProjectDetails: (value: SingleValue<ProjectOption>) => void;
}) => {
  const { projects } = useSelector((state: RootState) => state.projects);
  const [selectedProject, setSelectedProject] = useState<ProjectOption | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();

  const fetchProject = async () => {
    try {
      await dispatch(fetchProjects());
    } catch (error) {}
  };

  useEffect(() => {
    fetchProject();
  }, [dispatch]);

  const projectOptions: ProjectOption[] =
    projects && projects.length > 0
      ? projects
          .map((item: any) => ({
            value: item.id,
            label: item.name,
          }))
          .filter((item): item is ProjectOption => item !== undefined)
      : [];

  // Add a "Reset Filter" option
  const resetOption: ProjectOption = {
    value: -1,
    label: "Reset",
    color: "red",
  };

  // Combine normal options with reset option
  const optionsWithReset = [...projectOptions, resetOption];

  // Load selected project from localStorage on mount
  useEffect(() => {
    const storedProject = localStorage.getItem("selectedProject");
    if (storedProject) {
      const parsedProject = JSON.parse(storedProject);
      setSelectedProject(parsedProject);
      setSelectedProjectDetails(parsedProject);
    }
  }, [setSelectedProjectDetails]);

  const handleChange = (newValue: SingleValue<ProjectOption>) => {
    if (newValue?.value === -1) {
      resetSelection();
    } else {
      setSelectedProject(newValue);
      setSelectedProjectDetails(newValue);
      localStorage.setItem("selectedProject", JSON.stringify(newValue));
    }
  };

  const resetSelection = () => {
    setSelectedProject(null);
    setSelectedProjectDetails(null);
    localStorage.removeItem("selectedProject");
  };

  return (
    <form>
      <Select
        aria-labelledby="aria-label"
        placeholder="Select a Project..."
        inputId="aria-example-input"
        name="aria-live-color"
        options={optionsWithReset}
        value={selectedProject}
        onChange={handleChange}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "#81FBA5" : "#0B0B0B99",
            padding: "6px",
            outline: "none",
            borderRadius: "12px",
            width: "300px",
            boxShadow: state.isFocused ? "0 0 0 2px #81FBA5" : "none",
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isSelected
              ? "#81FBA5"
              : state.isFocused
              ? "#EEEEEE"
              : "white",
            color: state.isSelected ? "black" : "black",
            ":active": {
              backgroundColor: state.data.value === -1 ? "#FF6B6B" : "#81FBA5", // Highlight reset in red
            },
          }),
        }}
      />
    </form>
  );
};

export default SelectProject;

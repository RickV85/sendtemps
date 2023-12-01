import { TypeSelectProps } from "../../Interfaces/interfaces";

const TypeSelect: React.FC<TypeSelectProps> = ({
  setSelectedLocType,
}) => {
  return (
    <div className="type-select-div">
      <h3>Select location type:</h3>
      <select
        className="type-select"
        onChange={(e) => {
          setSelectedLocType(e.target.value);
        }}
      >
        <option
          value="Current Location"
        >
          Current Location
        </option>
        <option value="Climbing">Climbing</option>
        <option value="Mountain Biking">Mountain Biking</option>
        <option value="Snowboarding">Snowboarding</option>
        <option value="Other Favorites">Other Favorites</option>
      </select>
    </div>
  );
};

export default TypeSelect;

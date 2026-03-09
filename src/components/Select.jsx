// Select.jsx
import './Select.css';

export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [], 
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  ...props 
}) {
  return (
    <div className="select-group">
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        className="select"
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

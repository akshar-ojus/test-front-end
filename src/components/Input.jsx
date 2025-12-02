import './Input.css';

export default function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  error,
  ...props 
}) {
  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

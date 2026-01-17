import './Textarea.css';

export default function Textarea({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  disabled = false,
  rows = 4,
  ...props 
}) {
  return (
    <div className="textarea-group">
      {label && (
        <label className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      <textarea
        className="textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        {...props}
      />
    </div>
  );
}

import './Button.css';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  type = 'button',
  fullWidth = false 
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

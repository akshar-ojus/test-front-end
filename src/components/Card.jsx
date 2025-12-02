import './Card.css';

export default function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div 
      className={`card ${className} ${hover ? 'card-hover' : ''} ${onClick ? 'card-clickable' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

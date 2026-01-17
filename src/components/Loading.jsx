import './Loading.css';

export default function Loading({ size = 'medium', fullPage = false }) {
  const spinner = <div className={`spinner spinner-${size}`}></div>;

  if (fullPage) {
    return (
      <div className="loading-fullpage">
        {spinner}
      </div>
    );
  }

  return spinner;
}

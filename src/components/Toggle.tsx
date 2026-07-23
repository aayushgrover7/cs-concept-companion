import './toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange(next: boolean): void;
  label: string;
}

/** Accessible switch built on a real checkbox. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-label={label}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
    </label>
  );
}

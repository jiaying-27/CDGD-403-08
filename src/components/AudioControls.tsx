type AudioControlsProps = {
  disabled: boolean;
  statusLabel: string;
  onTogglePlayback: () => Promise<void>;
  onRestartPlayback: () => Promise<void>;
};

export default function AudioControls({
  disabled,
  statusLabel,
  onTogglePlayback,
  onRestartPlayback
}: AudioControlsProps) {
  return (
    <section aria-label="Audio controls" className="panel">
      <h2>Control the atmosphere</h2>
      <div className="control-row">
        <button className="control-button" disabled={disabled} onClick={() => void onTogglePlayback()} type="button">
          Pause / Play Sound
        </button>
        <button className="control-button" disabled={disabled} onClick={() => void onRestartPlayback()} type="button">
          Restart Sound
        </button>
      </div>
      <p className="audio-status">{statusLabel}</p>
    </section>
  );
}

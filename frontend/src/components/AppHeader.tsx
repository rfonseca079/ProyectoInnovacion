type AppHeaderProps = {
  teacherName?: string;
  onLogout?: () => void;
};

export function AppHeader({ teacherName, onLogout }: AppHeaderProps) {
  return (
    <header className="topbar">
      <h1>Planificador AI</h1>
      <div className="topbar-actions">
        {teacherName ? <span>{teacherName}</span> : null}
        {onLogout ? (
          <button type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        ) : null}
      </div>
    </header>
  );
}

import { BrandMark } from "./BrandMark";

type AppHeaderProps = {
  teacherName?: string;
  onLogout?: () => void;
};

export function AppHeader({ teacherName, onLogout }: AppHeaderProps) {
  return (
    <header className="topbar">
      <BrandMark />
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

import { Link, useNavigate } from "@tanstack/react-router";
import { actions, useCurrentUser } from "@/lib/store";

export function Header() {
  const user = useCurrentUser();
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
        <Link to="/" className="font-display text-2xl">
          טיקס<span className="text-primary">ה.</span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="rounded-full px-3 py-2 hover:bg-secondary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: true }}>אירועים</Link>
          {user ? (
            <>
              <Link to="/account" className="rounded-full px-3 py-2 hover:bg-secondary" activeProps={{ className: "text-primary" }}>האזור שלי</Link>
              <button className="btn-ghost !py-2 !px-4" onClick={() => { actions.logout(); nav({ to: "/" }); }}>יציאה</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-3 py-2 hover:bg-secondary">התחברות</Link>
              <Link to="/signup" className="btn-primary !py-2 !px-4">הרשמה</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

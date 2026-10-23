import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext, ThemeContext } from "../context/context";

export default function MobileMenu() {
  const { admin } = useContext(AdminContext);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nexus-surface/90 backdrop-blur-md border-t border-nexus-border px-6 py-4 flex justify-around items-center z-50 ">
      <NavLink
        to="/"
        end // Optional: Ensures exact matching for root path "/"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 transition ${
            isActive
              ? "text-nexus-primary font-semibold"
              : "text-nexus-text-muted hover:text-nexus-text-secondary"
          }`
        }
      >
        <svg
          className="w-5 h-5 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </NavLink>

      <NavLink
        to="/search"
        end // Optional: Ensures exact matching for root path "/"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 transition ${
            isActive
              ? "text-nexus-primary font-semibold"
              : "text-nexus-text-muted hover:text-nexus-text-secondary"
          }`
        }
      >
        <svg
          className="w-5 h-5 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </NavLink>
      <NavLink
        to="/inbox"
        end // Optional: Ensures exact matching for root path "/"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 transition ${
            isActive
              ? "text-nexus-primary font-semibold"
              : "text-nexus-text-muted hover:text-nexus-text-secondary"
          }`
        }
      >
        <svg
          className="w-5 h-5 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-1.074-.865 5.25 5.25 0 001.294-2.671A8.243 8.243 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </NavLink>
      <NavLink
        to="/notification"
        end // Optional: Ensures exact matching for root path "/"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 transition ${
            isActive
              ? "text-nexus-primary font-semibold"
              : "text-nexus-text-muted hover:text-nexus-text-secondary"
          }`
        }
      >
        <svg
          className="w-5 h-5 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
        >
          <path
            d="M20.84 4.61C19.77 3.54 18.33 3 16.8 3C15.27 3 13.83 3.54 12.76 4.61L12 5.37L11.24 4.61C10.17 3.54 8.73 3 7.2 3C5.67 3 4.23 3.54 3.16 4.61C0.95 6.82 0.95 10.4 3.16 12.61L12 21L20.84 12.61C23.05 10.4 23.05 6.82 20.84 4.61Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavLink>

      <NavLink
        to={`/user/${admin.Username}`}
        end // Optional: Ensures exact matching for root path "/"
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 transition ${
            isActive
              ? "text-nexus-primary font-semibold"
              : "text-nexus-text-muted hover:text-nexus-text-secondary"
          }`
        }
      >
        <svg
          className="w-5 h-5 fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </NavLink>
    </nav>
  );
}

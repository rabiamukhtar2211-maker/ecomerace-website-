/**
 * Small compatibility layer over react-router-dom so page components can use
 * `<Link to="...">`, `navigate({ to: "..." })` and `useRouterState()`.
 */
import { Link as RRLink, Outlet, useLocation, useNavigate as useRRNavigate, useParams } from "react-router-dom";

export function Link({ to, children, ...rest }) {
  return (
    <RRLink to={to} {...rest}>
      {children}
    </RRLink>
  );
}

export function useNavigate() {
  const navigate = useRRNavigate();
  return (arg) => navigate(typeof arg === "string" ? arg : arg.to);
}

export function useRouterState({ select } = {}) {
  const location = useLocation();
  const state = { location };
  return select ? select(state) : state;
}

export { Outlet, useLocation, useParams };

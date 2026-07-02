import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { isAuthed } from "../services/auth";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      navigate("/login", { replace: true });
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) return null;

  return children;
}

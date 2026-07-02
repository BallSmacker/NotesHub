import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-display text-7xl font-black">404</h1>

        <p className="mt-4 text-xl font-semibold">Page not found</p>

        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <Button asChild className="mt-8 rounded-xl">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

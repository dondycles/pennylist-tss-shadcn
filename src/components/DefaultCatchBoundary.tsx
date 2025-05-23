import {
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "./ui/button";

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <div className="m-auto flex w-fit flex-1 flex-col items-center justify-center gap-4 p-4">
      <div className="bg-muted space-y-2 rounded-3xl p-4">
        <p className="text-destructive text-2xl font-bold">{error.name}</p>
        <p className="whitespace-pre-wrap">{error.message}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => {
            router.invalidate();
          }}
        >
          Try Again
        </Button>
        {isRoot ? (
          <Button asChild variant="secondary">
            <Link to="/">Home</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              Go Back
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

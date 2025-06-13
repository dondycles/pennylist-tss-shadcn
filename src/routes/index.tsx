import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    return { user: context.user };
  },
});

function Home() {
  const { user } = Route.useLoaderData();
  const features = [
    {
      title: "Like A Social Media",

      desc: "List your moneys like posting on your social medias.",
    },

    {
      title: "Customizable",

      desc: "Make them moneys colorful and inspiring.",
    },

    {
      title: "Analytics",

      desc: "Dive into your progress with insightful charts and tables.",
    },

    {
      title: "Safe",

      desc: "Your data is encrypted and guaranteed safe with us.",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-16 p-4 pt-[8dvh]">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold sm:text-6xl">
          Avoid becoming penniless, start using pennylist.
        </h1>
        <p className="text-muted-foreground">
          Designed to be your private financial manager.
        </p>
        {user ? (
          <div className="flex justify-center gap-2">
            <Button type="button" asChild className="mb-2 w-fit">
              <Link to="/list">Go to List</Link>
            </Button>
            <Button asChild type="button" className="w-fit" variant="destructive">
              <Link to="/logout">Sign out</Link>
            </Button>
          </div>
        ) : (
          <Button type="button" asChild className="w-fit">
            <Link to="/login">Log in</Link>
          </Button>
        )}
        <div className="mt-16 space-y-4 text-left">
          {features.map((f, i) => (
            <div className="w-full max-w-lg rounded-3xl border p-4" key={`${i}-f.title`}>
              <p className="text-xl font-bold">{f.title}</p>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

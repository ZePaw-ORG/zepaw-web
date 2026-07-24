import LandingPage from '@/components/structure/LandingPage';

export default function Page() {
  return (
    // overflow-x-clip, not -hidden: `hidden` turns this into a scroll
    // container and silently breaks `position: sticky` for everything
    // inside it (the pinned record in the register). `clip` contains
    // overflow without creating a scroll container.
    <main className="relative z-10 min-h-screen overflow-x-clip">
      <LandingPage />
    </main>
  );
}

import MainNav from './main-nav';
import { ModeToggle } from './mode-toggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex w-full justify-end border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center px-0 md:px-5">
        <MainNav />
        {/* <MobileNav /> */}

        <ModeToggle />
      </div>
    </header>
  );
}

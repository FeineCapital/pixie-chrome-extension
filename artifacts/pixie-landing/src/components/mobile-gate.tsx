import { Button } from "@/components/ui/button";

export function MobileGate() {
  return (
    <div className="flex md:hidden fixed inset-0 z-[9999] bg-background items-center justify-center px-8">
      <div className="text-center flex flex-col items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-foreground" />
          <span className="font-display font-bold text-2xl text-foreground">Pixie</span>
        </div>
        <p className="text-muted-foreground text-base">
          Visit Pixie.app on desktop to download.
        </p>
        <Button className="rounded-full px-8 font-semibold" size="lg">
          Visit Pixie.app
        </Button>
      </div>
    </div>
  );
}

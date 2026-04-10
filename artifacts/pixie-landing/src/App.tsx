import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Showcase } from "@/components/showcase";
import { UseCases } from "@/components/use-cases";
import { CtaFooter } from "@/components/cta-footer";

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <Nav />
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <Features />
        <Showcase />
        <UseCases />
      </main>
      <CtaFooter />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

/**
 * App.tsx — Root application shell.
 *
 * Milestone 1: Renders a minimal, styled placeholder.
 * Routing and layout wrappers will be added in subsequent milestones.
 */
function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          TrackWise
        </h1>
        <p className="text-muted-foreground text-lg">
          Personal Expense Tracker — Foundation Ready
        </p>
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          Milestone 1 ✓
        </span>
      </div>
    </div>
  );
}

export default App;

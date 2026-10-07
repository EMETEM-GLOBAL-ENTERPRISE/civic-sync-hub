import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import ElectionDashboard from "./components/ElectionDashboard";

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
        <Header />
        <main>
          <ElectionDashboard />
        </main>
        <AuthModal />
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} Election Day Portal &mdash; Civic-Tech for Every Voter</p>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;
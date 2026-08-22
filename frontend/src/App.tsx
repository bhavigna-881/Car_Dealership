import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <header className="p-4 border-b">
            <h1 className="text-2xl font-bold text-primary">Car Dealership Inventory System</h1>
          </header>
          <main className="container mx-auto p-4">
            <p>Welcome to the Dashboard</p>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

import "./App.css";
import ShippingContext, { ShippingProvider } from "./context/ShippingContext";
import Navbar from "./components/Navbar";
import BoxForm from "./components/BoxForm";
import BoxTable from "./components/BoxTable";

function App() {
  return (
    <ShippingProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <main className="py-8">
          <ShippingContext.Consumer>
            {({ currentView }) =>
              currentView === "form" ? <BoxForm /> : <BoxTable />
            }
          </ShippingContext.Consumer>
        </main>
      </div>
    </ShippingProvider>
  );
}

export default App;

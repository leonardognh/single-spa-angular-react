import "./index.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { $test, eventTest } from "@fiap/shared-data";

export default function Root() {
  const [mostrarNavbar, setMostrarNavbar] = useState(false);
  function eventTestReact() {
    eventTest(!mostrarNavbar);
  }
  useEffect(() => {
    const subscription = $test.subscribe((value) => {
      console.log("Valor recebido no Nav React:", value);
      setMostrarNavbar(value);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-black">
      {!mostrarNavbar && (
        <button className="bg-white" onClick={eventTestReact}>
          Mostrar NavBar
        </button>
      )}
      {mostrarNavbar && <Navbar />}
    </div>
  );
}

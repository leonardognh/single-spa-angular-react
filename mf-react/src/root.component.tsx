import { useEffect } from "react";
import { $test, eventTest } from "@fiap/shared-data";
export default function Root(props) {
  function eventTestReact() {
    eventTest("react");
  }

  useEffect(() => {
    const subscription = $test.subscribe((value) => {
      console.log("Valor recebido no React:", value);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <section>{props.name} is mounted!</section>
      <button onClick={eventTestReact}>eventTestReact</button>
    </>
  );
}

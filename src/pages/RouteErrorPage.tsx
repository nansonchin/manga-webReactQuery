import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function RouteErrorPage() {
  const error = useRouteError();

  let title = "Something went wrong";
  let detail = "";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail = typeof error.data === "string" ? error.data : "";
  }
  else if(error instanceof Error){
    detail=error.message
  }

    return (
    <section style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
      <h1>{title}</h1>
      {detail && <p>{detail}</p>}
      <Link to="/manga">Back to manga list</Link>
    </section>
  );

}

import { createEffect, onMount } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { isUserLoggedIn } from "./AuthenticationService";

const AuthenticatedLink = (props) => {
  const navigate = useNavigate();
  createEffect(() => {
    if (!isUserLoggedIn()) return navigate("/login", { replace: true });
  });

  return <A {...props} />;
};

export default AuthenticatedLink;

import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { TextInput } from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { getApiError, type ApiErrorDetails } from "../utils/apiError";

interface LoginForm {
  email: string;
  password: string;
}

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function redirectPathFromState(state: unknown) {
  if (!isRecord(state) || !isRecord(state.from)) {
    return "/";
  }

  return typeof state.from.pathname === "string" ? state.from.pathname : "/";
}

function validate(values: LoginForm) {
  const errors: LoginErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
}

export function LoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = redirectPathFromState(location.state);
  const [values, setValues] = useState<LoginForm>({ email: "", password: "" });
  const [clientErrors, setClientErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState<ApiErrorDetails | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, navigate, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setClientErrors(nextErrors);
    setApiError(null);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setSubmitting(true);
    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setApiError(getApiError(error, "Invalid email or password"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
          Welcome back
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950">Login</h1>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {apiError ? (
          <Alert title="Login failed" variant="error">
            {apiError.message}
          </Alert>
        ) : null}

        <TextInput
          autoComplete="email"
          error={clientErrors.email}
          id="email"
          label="Email"
          onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
          placeholder="you@example.com"
          type="email"
          value={values.email}
        />

        <TextInput
          autoComplete="current-password"
          error={clientErrors.password}
          id="password"
          label="Password"
          onChange={(event) =>
            setValues((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Your password"
          type="password"
          value={values.password}
        />

        <Button disabled={submitting || loading} type="submit">
          {submitting ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="border-t border-neutral-200 pt-5 font-sans text-sm text-neutral-600">
        New here?{" "}
        <Link className="font-semibold text-red-800 hover:text-red-950" to="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}

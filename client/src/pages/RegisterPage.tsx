import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Button } from "../components/Button";
import { TextInput } from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { getApiError, type ApiErrorDetails } from "../utils/apiError";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

function validate(values: RegisterForm) {
  const errors: RegisterErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

export function RegisterPage() {
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterForm>({ name: "", email: "", password: "" });
  const [clientErrors, setClientErrors] = useState<RegisterErrors>({});
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
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      navigate("/", { replace: true });
    } catch (error) {
      setApiError(getApiError(error, "Unable to create your account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-8">
      <header className="border-b border-neutral-200 pb-6">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-800">
          Join the paper
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight text-neutral-950">Register</h1>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {apiError ? (
          <Alert title="Registration failed" variant="error">
            {apiError.message}
          </Alert>
        ) : null}

        <TextInput
          autoComplete="name"
          error={clientErrors.name}
          id="name"
          label="Name"
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          placeholder="Your name"
          value={values.name}
        />

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
          autoComplete="new-password"
          error={clientErrors.password}
          id="password"
          label="Password"
          onChange={(event) =>
            setValues((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="At least 6 characters"
          type="password"
          value={values.password}
        />

        <Button disabled={submitting || loading} type="submit">
          {submitting ? "Creating..." : "Create account"}
        </Button>
      </form>

      <p className="border-t border-neutral-200 pt-5 font-sans text-sm text-neutral-600">
        Already have an account?{" "}
        <Link className="font-semibold text-red-800 hover:text-red-950" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

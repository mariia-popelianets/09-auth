"use client";

import css from "./SignUpPage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register, type RegisterRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setError("");

    try {
      const formValues = Object.fromEntries(formData) as RegisterRequest;

      const user = await register(formValues);

      setUser(user);
      router.push("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form
        className={css.form}
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          handleSubmit(formData);
        }}
      >
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

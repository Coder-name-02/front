"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "../auth.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
//password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.ok) {
        alert("Signed in successfully!");
        router.push("/");
        router.refresh();
      } else {
        // setError(result.error || "Failed to sign in. Please check your credentials.");
          setError("Failed to sign in.Wrong Password or Email.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

//google login
const handleGoogleLogin = async () => {
  await signIn("google", { callbackUrl: "/" });
};

  return (
    <div className={styles.authWrapper}>
      <div className="col-md-8 col-lg-5 col-xl-4">
        <div className={styles.authCard}>
          <div className="card-body p-5">
            <h2 className={`text-center ${styles.authTitle}`}>Welcome Back</h2>
            
            {error && (
              <div className="alert alert-danger shadow-sm border-0 rounded-3" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className={styles.formLabel}>Email address</label>
                <input
                  type="email"
                  className={`form-control ${styles.inputField}`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className={styles.formLabel}>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${styles.inputField}`}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <label className="form-check-label small text-muted" htmlFor="showPassword">
                    Show Password
                  </label>
                </div>
              </div>

              {/* <div className="d-flex justify-content-between mb-4 mt-2">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label text-muted small" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-decoration-none small" style={{ color: '#764ba2' }}>
                  Forgot password?
                </a>
              </div> */}
              
              <button 
                type="submit" 
                className={`w-100 ${styles.btnPrimary}`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className={styles.divider}>OR CONTINUE WITH</div>

            <button
              type="button"
              className={`w-100 ${styles.btnGoogle}`}
              onClick={handleGoogleLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Login with Google
            </button>

            <div className="text-center mt-4">
              <p className="mb-0 text-muted small">
                Don't have an account?{' '}
                <Link href="/signup" className="fw-semibold text-decoration-none" style={{ color: '#764ba2' }}>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

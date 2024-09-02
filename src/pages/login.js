import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // const response = await axios.post('/api/login', { email, password });
      // const { token } = response.data;

      // Store token in sessionStorage or localStorage
      sessionStorage.setItem('accessToken', 'tokenbabi');
      sessionStorage.setItem('email', email);

      // Redirect to dashboard on successful login
      router.push("/");
    } catch (error) {
      setError(error.response?.data?.error || "An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Login
          </button>

          {error && <p className={styles.error}>{error}</p>} {/* Display error message */}
        </form>
      </div>
    </div>
  );
}

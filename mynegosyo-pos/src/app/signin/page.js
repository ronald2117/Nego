'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSignIn}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700">Sign in to your account</h2>
        <p className="text-center text-gray-500 mb-6">Enter your credentials below</p>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="email">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@email.com"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label className="block mb-2 text-gray-700 font-medium" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Your password"
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition shadow cursor-pointer"
        >
          Sign In
        </button>
        <p className="text-center text-sm mt-5 text-gray-600">
          Don&apos;t have an account?{' '}
          <a className="text-blue-600 underline font-medium" href="/signup">
            Create one
          </a>
        </p>
      </form>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700">Create your account</h2>
        <p className="text-center text-gray-500 mb-6">Sign up to get started</p>
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
          className="text-gray-700 w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
          placeholder="Create a password"
          className="text-gray-700 w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition shadow"
        >
          Sign Up
        </button>
        <p className="text-center text-sm mt-5 text-gray-600">
          Already have an account?{' '}
          <a className="text-blue-600 underline font-medium" href="/signin">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

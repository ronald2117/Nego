'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [storePassword, setStorePassword] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading]);

  const handleCreateStore = async () => {
    if (!storeName || !storePassword) return alert('Fill in all fields');

    const storeRef = doc(db, 'stores', storeName);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) return alert('Store name already exists');

    const hashedPassword = await bcrypt.hash(storePassword, 10);

    await setDoc(storeRef, {
      name: storeName,
      password: hashedPassword,
      createdBy: user.uid,
      members: [
        {
          userId: user.uid,
          email: user.email,
          role: 'admin',
        },
      ],
    });

    alert('Store created!');
    setStoreName('');
    setStorePassword('');
  };

  const handleJoinStore = async () => {
    if (!joinName || !joinPassword) return alert('Fill in all fields');

    const storeRef = doc(db, 'stores', joinName);
    const storeSnap = await getDoc(storeRef);

    if (!storeSnap.exists()) return alert('Store not found');

    const storeData = storeSnap.data();
    const isValid = await bcrypt.compare(joinPassword, storeData.password);

    if (!isValid) return alert('Incorrect password');

    const member = {
      userId: user.uid,
      email: user.email,
      role: 'pending', // will need approval
    };

    await updateDoc(storeRef, {
      members: arrayUnion(member),
    });

    alert('Request to join sent!');
    setJoinName('');
    setJoinPassword('');
  };

  if (loading || !user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Welcome, {user.email}</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">📦 Create a Store</h2>
          <input
            type="text"
            placeholder="Store name"
            className="w-full p-2 border mb-2 rounded"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Store password"
            className="w-full p-2 border mb-2 rounded"
            value={storePassword}
            onChange={(e) => setStorePassword(e.target.value)}
          />
          <button
            onClick={handleCreateStore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Store
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">➕ Join a Store</h2>
          <input
            type="text"
            placeholder="Store name"
            className="w-full p-2 border mb-2 rounded"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Store password"
            className="w-full p-2 border mb-2 rounded"
            value={joinPassword}
            onChange={(e) => setJoinPassword(e.target.value)}
          />
          <button
            onClick={handleJoinStore}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Request to Join
          </button>
        </div>

        <button
          onClick={logout}
          className="text-red-600 underline hover:text-red-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

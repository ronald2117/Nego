'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
} from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [storeName, setStoreName] = useState('');
  const [storePassword, setStorePassword] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [myStores, setMyStores] = useState([]);

  // Fetch user's stores
  useEffect(() => {
    if (!loading && user) {
      const fetchStores = async () => {
        const q = query(collection(db, 'stores'));
        const querySnapshot = await getDocs(q);
        const userStores = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const match = data.members.find((m) => m.userId === user.uid);
          if (match) {
            userStores.push({
              id: doc.id,
              name: data.name,
              role: match.role,
            });
          }
        });

        setMyStores(userStores);
      };

      fetchStores();
    }
  }, [loading, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading]);

  const handleCreateStore = async () => {
    if (!storeName || !storePassword) return alert('Please fill in all fields.');

    const storeRef = doc(db, 'stores', storeName);
    const storeSnap = await getDoc(storeRef);
    if (storeSnap.exists()) return alert('Store name already exists.');

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
    if (!joinName || !joinPassword) return alert('Please fill in all fields.');

    const storeRef = doc(db, 'stores', joinName);
    const storeSnap = await getDoc(storeRef);

    if (!storeSnap.exists()) return alert('Store not found.');

    const storeData = storeSnap.data();
    const isValid = await bcrypt.compare(joinPassword, storeData.password);
    if (!isValid) return alert('Incorrect password.');

    const member = {
      userId: user.uid,
      email: user.email,
      role: 'pending',
    };

    await updateDoc(storeRef, {
      members: arrayUnion(member),
    });

    alert('Request to join sent!');
    setJoinName('');
    setJoinPassword('');
  };

  const confirmLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  if (loading || !user) return <p className="text-center mt-10 text-gray-700">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">📊 Dashboard</h1>
        <h2 className="text-xl text-gray-700 text-center mb-10">
          Welcome, <span className="font-semibold text-gray-900">{user.email}</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Store */}
          <div className="bg-blue-50 rounded-2xl p-6 shadow border border-blue-100 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">📦 Create a Store</h2>
            <input
              type="text"
              placeholder="Store name"
              className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Store password"
              className="w-full p-3 mb-5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={storePassword}
              onChange={(e) => setStorePassword(e.target.value)}
            />
            <button
              onClick={handleCreateStore}
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow"
            >
              Create Store
            </button>
          </div>

          {/* Join Store */}
          <div className="bg-green-50 rounded-2xl p-6 shadow border border-green-100 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">➕ Join a Store</h2>
            <input
              type="text"
              placeholder="Store name"
              className="w-full p-3 mb-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Store password"
              className="w-full p-3 mb-5 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={joinPassword}
              onChange={(e) => setJoinPassword(e.target.value)}
            />
            <button
              onClick={handleJoinStore}
              className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow"
            >
              Request to Join
            </button>
          </div>
        </div>

        {/* My Stores */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">🏬 My Stores</h2>
          {myStores.length === 0 ? (
            <p className="text-sm text-gray-500">You are not part of any store yet.</p>
          ) : (
            <ul className="space-y-3">
              {myStores.map((store) => (
                <li
                  key={store.id}
                  className="bg-white border p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{store.name}</p>
                    <p className="text-sm text-gray-500">Role: {store.role}</p>
                  </div>
                  {store.role !== 'pending' ? (
                    <a
                      href={`/store/${store.id}`}
                      className="text-blue-600 underline text-sm hover:text-blue-800"
                    >
                      Open
                    </a>
                  ) : (
                    <span className="text-yellow-600 text-sm italic">Pending approval</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logout */}
        <div className="mt-12 text-center">
          <button
            onClick={confirmLogout}
            className="text-red-600 underline font-medium hover:text-red-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

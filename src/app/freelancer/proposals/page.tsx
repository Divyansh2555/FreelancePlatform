"use client";

import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

interface Proposal {
  id: number;
  project_id: number;
  freelancer_id: number;
  cover_letter: string;
  bid_amount: string;
  estimated_days: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ProposalsPage() {
  const [activeTab, setActiveTab] = useState("create");

  const [form, setForm] = useState({
    project_id: "",
    cover_letter: "",
    bid_amount: "",
    estimated_days: "",
  });

  const [myProposals, setMyProposals] = useState<Proposal[]>([]);
  const [clientProposals, setClientProposals] = useState<Proposal[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  // API Headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  // Create Proposal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/proposals/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          project_id: Number(form.project_id),
          cover_letter: form.cover_letter,
          bid_amount: Number(form.bid_amount),
          estimated_days: Number(form.estimated_days),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || "Failed to submit proposal"
        );
      }

      setMessage("Proposal submitted successfully!");

      setForm({
        project_id: "",
        cover_letter: "",
        bid_amount: "",
        estimated_days: "",
      });

      fetchMyProposals();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch My Proposals
  const fetchMyProposals = async () => {
    setFetching(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/proposals/my`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch proposals");
      }

      setMyProposals(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  // Fetch Client Proposals
  const fetchClientProposals = async () => {
    setFetching(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/proposals/client`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch client proposals");
      }

      setClientProposals(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my") {
      fetchMyProposals();
    } else if (activeTab === "client") {
      fetchClientProposals();
    }
  }, [activeTab]);

  // Proposal Card
  const ProposalCard = ({ item }: { item: Proposal }) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Proposal #{item.id}
          </h3>
          <p className="text-sm text-gray-500">
            Project ID: {item.project_id}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            item.status === "accepted"
              ? "bg-green-100 text-green-700"
              : item.status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">Bid Amount</p>
          <p className="text-lg font-bold text-indigo-600">
            ₹{Number(item.bid_amount).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">Estimated Days</p>
          <p className="text-lg font-bold text-gray-800">
            {item.estimated_days} Days
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          Cover Letter
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {item.cover_letter}
        </p>
      </div>

      <div className="border-t mt-4 pt-3 flex justify-between text-xs text-gray-400">
        <span>Freelancer ID: {item.freelancer_id}</span>
        <span>
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Proposal Management
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage your project proposals.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">

          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "create"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-600 border hover:bg-gray-100"
            }`}
          >
            + Create Proposal
          </button>

          <button
            onClick={() => setActiveTab("my")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "my"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-600 border hover:bg-gray-100"
            }`}
          >
            My Proposals
          </button>

          <button
            onClick={() => setActiveTab("client")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "client"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white text-gray-600 border hover:bg-gray-100"
            }`}
          >
            Client Proposals
          </button>

        </div>

        {/* Messages */}
        {message && (
          <div className="mb-5 p-4 bg-green-100 text-green-700 rounded-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Create Proposal */}
        {activeTab === "create" && (
          <div className="max-w-3xl bg-white rounded-2xl shadow-sm border p-6 md:p-8">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Submit Your Proposal
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Project ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project ID
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter project ID"
                  value={form.project_id}
                  onChange={(e) =>
                    setForm({ ...form, project_id: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cover Letter
                </label>

                <textarea
                  required
                  rows={5}
                  placeholder="Write your proposal..."
                  value={form.cover_letter}
                  onChange={(e) =>
                    setForm({ ...form, cover_letter: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Bid Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bid Amount (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter your bid amount"
                  value={form.bid_amount}
                  onChange={(e) =>
                    setForm({ ...form, bid_amount: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Estimated Days */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Days
                </label>

                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter estimated days"
                  value={form.estimated_days}
                  onChange={(e) =>
                    setForm({ ...form, estimated_days: e.target.value })
                  }
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-xl transition"
              >
                {loading ? "Submitting..." : "Submit Proposal"}
              </button>

            </form>
          </div>
        )}

        {/* My Proposals */}
        {activeTab === "my" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                My Proposals ({myProposals.length})
              </h2>

              <button
                onClick={fetchMyProposals}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Refresh
              </button>
            </div>

            {fetching ? (
              <p className="text-center py-12 text-gray-500">
                Loading proposals...
              </p>
            ) : myProposals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border">
                <p className="text-gray-500">No proposals found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myProposals.map((item) => (
                  <ProposalCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Client Proposals */}
        {activeTab === "client" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Received Proposals ({clientProposals.length})
              </h2>

              <button
                onClick={fetchClientProposals}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Refresh
              </button>
            </div>

            {fetching ? (
              <p className="text-center py-12 text-gray-500">
                Loading client proposals...
              </p>
            ) : clientProposals.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border">
                <p className="text-gray-500">
                  No client proposals found.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {clientProposals.map((item) => (
                  <ProposalCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
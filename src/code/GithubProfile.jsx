import { useState } from "react";

export default function GitHubProfile() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${query.trim()}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found!");
        }
        throw new Error("Failed to fetch data!");
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-center  text-3xl font-semibold mb-8">
          GitHub User Search
        </h1>

        <div className="flex justify-center items-center gap-2 mb-4">
          <input
            placeholder="Enter username..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="border border-gray-300 py-2 px-4 rounded-lg bg-white focus:outline-0"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white py-2 px-3 rounded-lg"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-red-500 bg-red-200 font-medium px-4 py-2 rounded-lg">
              {error}
            </p>
          </div>
        )}

        {user && (
          <div className="flex justify-center">
            <div className="bg-white p-6 w-80 rounded-lg shadow-lg border-gray-100">
              <div className="flex flex-col items-center mb-5">
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-24 h-24 rounded-full broder-2 border-gray-200 "
                />
                <h2 className="text-xl font-semibold mt-4 text-gray-800">
                  {user.name || user.login}
                </h2>
                <p className="text-sm text-gray-600">@{user.login}</p>
                {user.bio && (
                  <p className="text-gray-700 text-center text-sm mt-2">
                    {user.bio}
                  </p>
                )}
                <div className="flex gap-4 mt-3 text-sm text-gray-600">
                  <span>
                    <strong>{user.public_repos}</strong> repos
                  </span>
                  <span>
                    <strong>{user.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{user.following}</strong> following
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

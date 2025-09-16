import { useState } from "react";

export default function GitHubProfile() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);

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

      const reposResponse = await fetch(
        `https://api.github.com/users/${query.trim()}/repos?per_page=5&sort=created`
      );
      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepos(reposData);
      }
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-center text-3xl font-semibold mb-8">
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
          className="border border-gray-300 py-2 px-4 rounded-lg bg-white focus:outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-3 rounded-lg transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">
              Searching for user...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-center">
          <p className="text-red-500 bg-red-100 font-medium px-4 py-2 rounded-lg">
            {error}
          </p>
        </div>
      )}

      {user && (
        <div className="flex justify-center">
          <div className="bg-white p-6 w-[900px] mt-10 rounded-lg shadow-lg border border-gray-200">
            <div className="">
              <div className="flex justify-between items-start -mt-16 ">
                <div className="flex-shrink-0">
                  <img
                    src={user.avatar_url}
                    alt={`${user.login}'s avatar`}
                    className="w-24 h-24 rounded-xl border-2 border-white"
                  />
                  <h2 className="text-xl font-semibold mt-4 text-gray-800">
                    {user.name || user.login}
                  </h2>
                  <p className="text-sm text-gray-600">@{user.login}</p>
                  {user.bio && (
                    <p className="text-gray-700 text-sm mt-2">{user.bio}</p>
                  )}{" "}
                </div>

                <div className="flex gap-6 mt-16 text-sm text-gray-600">
                  <span className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                    <strong>{user.public_repos}</strong> repos
                  </span>
                  <span className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                    <strong>{user.followers}</strong> followers
                  </span>
                  <span className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-300">
                    <strong>{user.following}</strong> following
                  </span>
                </div>
              </div>
              <div className="h-[1px] w-100% bg-gray-300 mt-6"></div>

              {repos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Repos:
                  </h3>
                  <ul className="space-y-3 grid grid-cols-2 gap-4">
                    {repos.map((repo) => (
                      <li
                        key={repo.id}
                        className="bg-gray-200 rounded-sm py-4 px-3"
                      >
                        <a
                          href={repo.html_url}
                          className="text-md font-semibold uppercase text-gray-700"
                        >
                          {repo.name}
                        </a>
                        {repo.description && (
                          <p className="text-gray-500 text-sm">
                            {repo.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {user.html_url && (
                <div className="mt-6">
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";

export const useGitHubRepo = (repoLink) => {
  const [data, setData] = useState({
    loading: true,
    repoData: null,
    contributors: null,
    commits: null,
    error: null,
  });

  useEffect(() => {
    if (!repoLink) return;

    const fetchData = async () => {
      setData(prev => ({ ...prev, loading: true }));

      try {
        const [owner, repo] = repoLink.replace("https://github.com/", "").split("/");

        // Repo details (stars, forks, watchers)
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const repoData = await repoRes.json();

        // Contributors
        const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
        const contributors = await contribRes.json();

        // Commits (first page, for full count handle pagination)
        const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`);
        const commits = await commitsRes.json();

        setData({
          loading: false,
          repoData,
          contributors,
          commits,
          error: null,
        });
      } catch (err) {
        setData({
          loading: false,
          repoData: null,
          contributors: null,
          commits: null,
          error: err,
        });
      }
    };

    fetchData();
  }, [repoLink]);

  return data;
};

import { useState, useEffect } from "react";

export const useGitHubRepo = (repoLink) => {
  const [data, setData] = useState({
    loading: true,
    repoData: null,
    contributors: [],
    commits: null,
    error: null,
  });

  useEffect(() => {
    if (!repoLink) return;

    const fetchData = async () => {
      setData(prev => ({ ...prev, loading: true }));

      try {
        const [owner, repo] = repoLink.replace("https://github.com/", "").split("/");

        // Repo details
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        const repoData = await repoRes.json();

        // Contributors (map only needed fields)
        const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`);
        const contribRaw = await contribRes.json();
        const contributors = contribRaw.map(c => ({
          name: c.login,
          url: c.html_url,
          avatar: c.avatar_url,
        }));

        // Commits
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
          contributors: [],
          commits: null,
          error: err,
        });
      }
    };

    fetchData();
  }, [repoLink]);

  return data;
};

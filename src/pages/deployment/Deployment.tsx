import { useState } from "react";
import axios from "axios";

const Deployment = ({}: {}) => {
  const [projectName, setProjectName] = useState<string>("");
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string>("");

  const handleDeploy = async () => {
    setLoading(true);
    setDeploymentUrl("");

    try {
      const vercelToken = import.meta.env.VITE_APP_VERCEL_API_TOKEN;

      const response = await axios.post(
        `https://api.vercel.com/v13/deployments`,
        {
          name: projectName,
          gitSource: {
            type: "github",
            repoUrl,
            ref: "main",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setDeploymentUrl(response.data.url);
    } catch (error) {
      alert("Deployment failed! Check console for details.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-36">
      <h2 className="text-xl font-semibold mb-4">Deploy to Vercel</h2>
      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="GitHub Repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleDeploy}
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Deploying..." : "Deploy to Vercel"}
      </button>

      {deploymentUrl && (
        <p className="mt-4">
          ✅ Deployment Success:{" "}
          <a
            href={`https://${deploymentUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {deploymentUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default Deployment;

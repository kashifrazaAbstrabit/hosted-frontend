import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogleDrive } from "react-icons/fa6";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const GoogleDriveCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authCode = searchParams.get("code");
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (authCode) {
      exchangeCodeForToken(authCode);
    }
  }, [authCode]);

  const exchangeCodeForToken = async (authCode: any) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/documents/google/drive/callback?code=${authCode}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setStatus("success");
        setTimeout(() => navigate("/documents"), 2000);
        toast.success(response?.data?.data?.message);
      }
 
    } catch (error: any) {
  
      setStatus("error");
      setTimeout(() => navigate("/settings"), 3000);
    }
  };

  return (
    <div className="w-[calc(100%-288px)] h-[calc(100vh-80px)] bg-gray-100 left-72 top-20 ml-72">
      <div className="flex flex-col items-center  justify-center pt-40">
        <div className="bg-white shadow-lg rounded-lg p-6 -pt-40 flex flex-col items-center w-96">
          <FaGoogleDrive className="text-4xl text-blue-600 mb-4" />
          {status === "loading" && (
            <>
              <Loader2 className="animate-spin text-gray-500 w-12 h-12" />
              <p className="mt-4 text-gray-600">
                Connecting to Google Drive...
              </p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="text-green-500 w-12 h-12" />
              <p className="mt-4 text-green-600">
                Google Drive Connected Successfully!
              </p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="text-red-500 w-12 h-12" />
              <p className="mt-4 text-red-600">
                Failed to connect. Redirecting...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveCallback;

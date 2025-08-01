import React, { useState } from 'react';
import {FileUploadBox}from '../components';
import pdfToText from 'react-pdftotext';
import { processResumeWithAI } from '../utils/aiLogic';
import { toast } from "react-toastify";

const AIGenerateProfile = ({ onAIGenerate, trigger }) => {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Call this from your Profile.jsx button
  React.useEffect(() => {
    if (trigger) setShowFileUpload(true);
  }, [trigger]);

  const handlePdfFile = async (file) => {
    setIsProcessing(true);
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        const text = await pdfToText(file);
        const result = await processResumeWithAI(text, geminiApiKey, formData.email);
        if (onAIGenerate) onAIGenerate(result.userData, result.skills);
        setShowFileUpload(false);
        toast.success("Resume processed successfully!");
        break;
      } catch (error) {
        retryCount++;
        if (retryCount > maxRetries) {
          toast.error("Failed to process resume. Please try again.");
          setShowFileUpload(false);
        }
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (!showFileUpload) return null;

  return (
    <div className="file-upload-overlay">
      <div className="file-upload-modal">
        {isProcessing ? (
          <div className="processing-overlay">
            <p>Processing your resume...</p>
          </div>
        ) : (
          <FileUploadBox
            onClose={() => setShowFileUpload(false)}
            onFileSelect={handlePdfFile}
          />
        )}
      </div>
    </div>
  );
};

export default AIGenerateProfile;
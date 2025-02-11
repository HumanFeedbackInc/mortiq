// components/pdf-viewer.tsx
"use client";

import { useEffect, useState } from "react";
import { getPdfUrl, getAllListingFilesFromFolder } from "@/app/actions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  Button,
  DropdownMenu,
} from "@heroui/react";

export default function PDFViewer({ filePath }: { filePath: string }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [files, setFiles] = useState<Array<{
    fileName: string;
    signedUrl: string;
  }> | null>(null);
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        console.log("filePath", filePath);
        const response = await getAllListingFilesFromFolder(filePath || "");

        if (response.success) {
          const signedUrls = response.signedUrls;

          if (
            !signedUrls ||
            signedUrls.length === 0 ||
            signedUrls[0] === null
          ) {
            throw new Error("Failed to fetch PDF");
          }

          // Set the first URL as the default PDF to display
          setPdfUrl(signedUrls[0].signedUrl);

          // Format the files data for the dropdown

          setFiles(signedUrls);
        } else {
          throw new Error(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
    };

    fetchPdfUrl();
  }, [fileName]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  //   if (!pdfUrl) {
  //     return <div>Loading PDF...</div>
  //   }

  return (
    <div className="w-full h-screen rounded-lg flex flex-col justify-center items-center ">
      <Dropdown>
        <DropdownTrigger>
          <Button className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-sm transition-all duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Select Document</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) => {
            const selectedFile = files?.find((file) => file.fileName === key);
            if (selectedFile) {
              setPdfUrl(selectedFile.signedUrl);
              setFileName(selectedFile.fileName);
            }
          }}
        >
          {files?.map((file) => (
            <DropdownItem key={file.fileName} value={file.fileName}>
              {file.fileName}
            </DropdownItem>
          )) || []}
        </DropdownMenu>
      </Dropdown>

      {pdfUrl && (
        <embed
          src={pdfUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="min-h-[600px] rounded-lg my-8"
        />
      )}
      <p className="text-sm text-gray-500 mt-2">
        Can&apos;t view PDF?
        <a
          href={fileName || ""}
          download
          className="text-blue-600 hover:underline"
        >
          Download instead
        </a>
      </p>
    </div>
  );
}

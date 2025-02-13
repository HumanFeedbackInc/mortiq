// components/pdf-viewer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllListingFilesFromFolder } from "@/app/actions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  Button,
  DropdownMenu,
} from "@heroui/react";
// import { Document, Page, pdfjs } from "react-pdf";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import Draggable from "react-draggable";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer({ filePath }: { filePath: string }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [files, setFiles] = useState<
    Array<{ fileName: string; signedUrl: string }>
  >([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(window.innerWidth * 0.9);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = React.useRef(null);

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
          setFileName(signedUrls[0].fileName);
          setFiles(signedUrls);
        } else {
          throw new Error(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
    };

    fetchPdfUrl();
  }, [filePath]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  // const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  //   setNumPages(numPages);
  // }
  function nextPage() {
    if (pageNumber < numPages) {
      setPageNumber((v) => ++v);
    }
  }
  function prevPage() {
    if (pageNumber > 1) {
      setPageNumber((v) => --v);
    }
  }

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3)); // Max zoom 3x
    // @ts-ignore
    setWidth(null); // Remove width constraint when zooming
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Min zoom 0.5x
    // @ts-ignore
    setWidth(null);
  };

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  const fitToWidth = () => {
    setScale(1);
    setWidth(window.innerWidth * 0.9);
    resetPosition();
  };

  return (
    <div className="w-full  p-4 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" color="primary" className="w-full">
              <div className="flex items-center justify-center gap-2">
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
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => {
              const selectedFile = files.find((file) => file.fileName === key);
              if (selectedFile) {
                setPdfUrl(selectedFile.signedUrl);
                setFileName(selectedFile.fileName);
              }
            }}
          >
            {files.map((file) => (
              <DropdownItem key={file.fileName} value={file.fileName}>
                {file.fileName}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      {pdfUrl && (
        <div className="w-full h-full flex-grow mt-8">
          <div className="flex justify-center gap-2 mb-4">
            <Button
              variant="faded"
              onPress={prevPage}
              disabled={pageNumber <= 1}
              className="px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              variant="faded"
              onPress={zoomOut}
              className="px-4 py-2 rounded"
              title="Zoom Out"
            >
              -
            </Button>
            <Button
              variant="faded"
              onPress={fitToWidth}
              className="px-4 py-2 rounded"
              title="Fit to Width"
            >
              Fit
            </Button>
            <Button
              variant="faded"
              onPress={zoomIn}
              className="px-4 py-2 rounded"
              title="Zoom In"
            >
              +
            </Button>
            <Button
              variant="faded"
              onPress={nextPage}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </Button>
          </div>
          <div className="overflow-hidden relative flex justify-center">
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex justify-center"
            >
              <Draggable
                nodeRef={nodeRef}
                position={position}
                onDrag={handleDrag}
                disabled={width !== null}
                // bounds={null}
              >
                <div ref={nodeRef}>
                  <Page
                    pageNumber={pageNumber}
                    width={width}
                    scale={width ? undefined : scale}
                    className="max-w-full cursor-move"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              </Draggable>
            </Document>
          </div>
          <p className="text-center mt-2">
            Page {pageNumber} of {numPages}
          </p>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-2">
        Can't view PDF?{" "}
        <a
          href={pdfUrl || ""}
          download
          className="text-blue-600 hover:underline"
        >
          Download instead
        </a>
      </p>
    </div>
  );
}

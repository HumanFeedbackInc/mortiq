"use client";

import { useEffect, useState } from "react";
import PDFViewer from "@/components/pdf-viewer";
import { DashboardUserData } from "../page";

export default function DocumentsSetting({
  dashboardUserData,
}: {
  dashboardUserData: DashboardUserData;
}) {
  const userId =
    dashboardUserData.userData?.userId ||
    dashboardUserData.user.data.user?.id ||
    "";

  const privateDocumentPath = `users/${userId}/private`;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Your Documents</h3>
        <p className="text-small text-default-500">
          View and manage your private documents.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <PDFViewer filePath={privateDocumentPath} />
      </div>
    </div>
  );
}

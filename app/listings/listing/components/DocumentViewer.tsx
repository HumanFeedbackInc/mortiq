"use client";
import React, { useState } from "react";
import { Document, Outline, Page } from "react-pdf";

const samplePDF =
  "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/sign/secureFiles/Falconer%20Dr%20Commitment%20Package.docx?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzZWN1cmVGaWxlcy9GYWxjb25lciBEciBDb21taXRtZW50IFBhY2thZ2UuZG9jeCIsImlhdCI6MTczODU1NzU3NiwiZXhwIjoxNzQxMTQ5NTc2fQ.6xy6IbGKi5XpmFHuketebtD5_uNpqp96LFLncIV1yZo";

export default function Test() {
  const [pageNumber, setPageNumber] = useState(1);

  function onItemClick({ pageNumber: itemPageNumber }: { pageNumber: number }) {
    setPageNumber(itemPageNumber);
  }

  return (
    <Document file={samplePDF}>
      <Outline onItemClick={onItemClick} />
      <Page pageNumber={pageNumber || 1} />
    </Document>
  );
}

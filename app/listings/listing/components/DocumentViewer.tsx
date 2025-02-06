// "use client"

// // import { Document } from 'react-pdf'
// // import { pdfjs } from 'react-pdf';

// // Configure PDF.js worker
// import { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
// //   'pdfjs-dist/build/pdf.worker.min.mjs',
// //   import.meta.url,
// // ).toString();

// // export default function DocumentViewer() {
// //     return <Document file={{url: "https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/sign/secureFiles/Falconer%20Dr%20Commitment%20Package.docx?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzZWN1cmVGaWxlcy9GYWxjb25lciBEciBDb21taXRtZW50IFBhY2thZ2UuZG9jeCIsImlhdCI6MTczODU1NzU3NiwiZXhwIjoxNzQxMTQ5NTc2fQ.6xy6IbGKi5XpmFHuketebtD5_uNpqp96LFLncIV1yZo"}}/>
// // }

// export default function DocumentViewer() {
//   const [numPages, setNumPages] = useState<number>();
//   const [pageNumber, setPageNumber] = useState<number>(1);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//     setNumPages(numPages);
//   }

//   return (
//     <div>
//       <Document file="https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/sign/secureFiles/Falconer%20Dr%20Commitment%20Package.docx?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzZWN1cmVGaWxlcy9GYWxjb25lciBEciBDb21taXRtZW50IFBhY2thZ2UuZG9jeCIsImlhdCI6MTczODU1NzU3NiwiZXhwIjoxNzQxMTQ5NTc2fQ.6xy6IbGKi5XpmFHuketebtD5_uNpqp96LFLncIV1yZo" onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>
//     </div>
//   );
// }
"use client"
import React, { useState } from 'react';
import { Document, Outline, Page } from 'react-pdf';

const samplePDF = 'https://tvwojwmrfzfxpelinlal.supabase.co/storage/v1/object/sign/secureFiles/Falconer%20Dr%20Commitment%20Package.docx?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzZWN1cmVGaWxlcy9GYWxjb25lciBEciBDb21taXRtZW50IFBhY2thZ2UuZG9jeCIsImlhdCI6MTczODU1NzU3NiwiZXhwIjoxNzQxMTQ5NTc2fQ.6xy6IbGKi5XpmFHuketebtD5_uNpqp96LFLncIV1yZo';

export default function Test() {
  const [pageNumber, setPageNumber] = useState(1);

  function onItemClick({ pageNumber: itemPageNumber }) {
    setPageNumber(itemPageNumber);
  }

  return (
    <Document file={samplePDF}>
      <Outline onItemClick={onItemClick} />
      <Page pageNumber={pageNumber || 1} />
    </Document>
  );
}
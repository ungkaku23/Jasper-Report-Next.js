import { Worker } from '@react-pdf-viewer/core';

export default function Layout({ children }) {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js">
      <main>{children}</main>
    </Worker>
  )
}
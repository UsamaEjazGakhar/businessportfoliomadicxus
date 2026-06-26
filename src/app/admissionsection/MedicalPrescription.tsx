"use client";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSession } from "next-auth/react";

interface PrescriptionTemplate {
  id: string;
  doctorName: string;
  doctorQualifications: string;
  pmdcRegNumber: string;
  uidAmb: string;
  timings: string;
}

interface PrescriptionSubmission {
  doctorName: string;
  doctorQualifications: string;
  pmdcRegNumber: string;
  uidAmb: string;
  timings: string;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  date?: string;
  rxContent?: string;
  adviceContent?: string;
  signature?: string;
}

interface MedicalPrescriptionProps {
  onGoBack?: () => void;
}

type SignatureMode = "draw" | "type";
type DrawingTool = "pen" | "eraser";

export default function MedicalPrescription({ onGoBack }: MedicalPrescriptionProps) {
  const { data: session } = useSession();
  const [template, setTemplate] = useState<PrescriptionTemplate | null>(null);
  const [formData, setFormData] = useState<PrescriptionSubmission>({
    doctorName: "",
    doctorQualifications: "MBBS, &MP",
    pmdcRegNumber: "798414-01-M",
    uidAmb: "UID/AMB 2026",
    timings: "05:00 pm to 09:00 pm",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [signatureMode, setSignatureMode] = useState<SignatureMode>("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [drawingTool, setDrawingTool] = useState<DrawingTool>("pen");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(2);

  useEffect(() => {
    if (session?.user?.name) {
      setFormData((prev) => ({ ...prev, doctorName: session.user.name || "" }));
    }
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB");
    setFormData((prev) => ({ ...prev, date: dateStr }));
    async function fetchTemplate() {
      try {
        const res = await fetch("/api/prescription-templates");
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          const tpl = json.data[0];
          setTemplate(tpl);
          setFormData((prev) => ({ ...prev, ...tpl }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchTemplate();
  }, [session]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, []);

  // Update canvas context when tool/color/size changes
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = drawingTool === "pen" ? penColor : "white";
        ctx.lineWidth = drawingTool === "eraser" ? penSize * 5 : penSize;
      }
    }
  }, [drawingTool, penColor, penSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    setLastX(x);
    setLastY(y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    setTypedSignature("");
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const clearAllFields = () => {
    // Reset form data
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB");
    setFormData({
      doctorName: session?.user?.name || "",
      doctorQualifications: "MBBS, &MP",
      pmdcRegNumber: "798414-01-M",
      uidAmb: "UID/AMB 2026",
      timings: "05:00 pm to 09:00 pm",
      date: dateStr,
    });
    // Clear signature
    clearSignature();
  };

  const getSignatureImage = () => {
    if (signatureMode === "draw" && canvasRef.current) {
      return canvasRef.current.toDataURL("image/png");
    } else if (signatureMode === "type" && typedSignature) {
      // Create a canvas for typed signature to convert to image
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 300;
      tempCanvas.height = 100;
      const ctx = tempCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.font = "40px cursive";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typedSignature, tempCanvas.width / 2, tempCanvas.height / 2);
        return tempCanvas.toDataURL("image/png");
      }
      return `data:text/plain;charset=utf-8,${encodeURIComponent(typedSignature)}`;
    }
    return undefined;
  };

  const handleDownloadPDF = async () => {
    if (!formRef.current) return;

    // Temporary fix for html2canvas to capture input values
    const inputs = formRef.current.querySelectorAll('input, textarea');
    const replacements: { element: HTMLElement; replacement: HTMLElement }[] = [];

    inputs.forEach(el => {
      const input = el as HTMLInputElement | HTMLTextAreaElement;
      const tagName = input.tagName.toLowerCase();
      let replacement: HTMLElement;

      if (tagName === 'textarea') {
        replacement = document.createElement('div');
        replacement.textContent = input.value;
        replacement.style.width = input.style.width || '100%';
        replacement.style.minHeight = input.style.minHeight || '120px';
        replacement.style.border = input.style.border || '';
        replacement.style.padding = input.style.padding || '';
        replacement.style.marginTop = input.style.marginTop || '';
        replacement.style.fontSize = input.style.fontSize || '';
        replacement.style.fontFamily = input.style.fontFamily || '';
        replacement.style.whiteSpace = 'pre-wrap';
        replacement.style.boxSizing = 'border-box';
      } else {
        replacement = document.createElement('span');
        replacement.textContent = input.value;
        // Copy input styles
        replacement.style.fontSize = input.style.fontSize || '';
        replacement.style.fontWeight = input.style.fontWeight || '';
        replacement.style.padding = input.style.padding || '';
        replacement.style.display = 'inline';
        replacement.style.width = input.style.width || '';
        replacement.style.textAlign = input.style.textAlign || '';
      }

      // Replace the input with the span/div
      input.parentNode?.replaceChild(replacement, input);
      replacements.push({ element: input, replacement });
    });

    try {
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 0;

      // Only add one page, no extra pages
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      pdf.save(`prescription-${formData.patientName || "unnamed"}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      // Put the inputs back
      replacements.forEach(({ element, replacement }) => {
        replacement.parentNode?.replaceChild(element, replacement);
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const signature = getSignatureImage();
      const res = await fetch("/api/prescription-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, signature }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Clear fields after successful submission
        clearAllFields();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "0" }}>
      {onGoBack && (
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button
            onClick={onGoBack}
            style={{
              padding: "10px 20px",
              background: "#64748B",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Go Back
          </button>
          <button
            onClick={clearAllFields}
            style={{
              padding: "10px 20px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Clear Fields
          </button>
        </div>
      )}
      
      <div
        ref={formRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          backgroundColor: "#fff",
          padding: "16mm 20mm",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px",
          color: "#000",
          marginBottom: "20px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%", height: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "4px",
            }}>
              <div style={{ textAlign: "center" }}>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  style={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    border: "none",
                    borderBottom: "1px dashed #aaa",
                    width: "200px",
                    textAlign: "center",
                    padding: "2px",
                  }}
                />
                <br />
                <input
                  type="text"
                  name="doctorQualifications"
                  value={formData.doctorQualifications}
                  onChange={handleInputChange}
                  style={{
                    fontSize: "11px",
                    border: "none",
                    borderBottom: "1px dashed #aaa",
                    width: "180px",
                    textAlign: "center",
                    padding: "2px",
                  }}
                />
                <br />
                PMDC Reg. No.: <input
                  type="text"
                  name="pmdcRegNumber"
                  value={formData.pmdcRegNumber}
                  onChange={handleInputChange}
                  style={{
                    fontSize: "11px",
                    border: "none",
                    borderBottom: "1px dashed #aaa",
                    width: "120px",
                    padding: "2px",
                  }}
                />
                <br />
                <input
                  type="text"
                  name="uidAmb"
                  value={formData.uidAmb}
                  onChange={handleInputChange}
                  style={{
                    fontSize: "11px",
                    border: "none",
                    borderBottom: "1px dashed #aaa",
                    width: "120px",
                    padding: "2px",
                  }}
                />
                <br />
                Timings: <input
                  type="text"
                  name="timings"
                  value={formData.timings}
                  onChange={handleInputChange}
                  style={{
                    fontSize: "11px",
                    border: "none",
                    borderBottom: "1px dashed #aaa",
                    width: "140px",
                    padding: "2px",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #000", marginBottom: "8px" }}></div>

          <div style={{ marginBottom: "8px" }}>
            Date: <input
              type="text"
              name="date"
              value={formData.date || ""}
              onChange={handleInputChange}
              style={{
                border: "none",
                borderBottom: "1px solid #000",
                width: "120px",
                padding: "2px",
              }}
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
            <div style={{ marginBottom: "4px" }}>
              Patient Name: <input
                type="text"
                name="patientName"
                value={formData.patientName || ""}
                onChange={handleInputChange}
                style={{
                  border: "none",
                  borderBottom: "1px solid #000",
                  width: "200px",
                  padding: "2px",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                Age: <input
                  type="text"
                  name="patientAge"
                  value={formData.patientAge || ""}
                  onChange={handleInputChange}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #000",
                    width: "60px",
                    padding: "2px",
                  }}
                />
              </div>
              <div>
                Gender: <input
                  type="text"
                  name="patientGender"
                  value={formData.patientGender || ""}
                  onChange={handleInputChange}
                  style={{
                    border: "none",
                    borderBottom: "1px solid #000",
                    width: "80px",
                    padding: "2px",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "8px", minHeight: "150px" }}>
            <strong>R<sub>x</sub></strong>
            <textarea
              name="rxContent"
              value={formData.rxContent || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                minHeight: "120px",
                border: "1px dashed #aaa",
                padding: "8px",
                marginTop: "4px",
                fontSize: "11px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <strong>Advice:</strong>
            <textarea
              name="adviceContent"
              value={formData.adviceContent || ""}
              onChange={handleInputChange}
              style={{
                width: "100%",
                minHeight: "80px",
                border: "1px dashed #aaa",
                padding: "8px",
                marginTop: "4px",
                fontSize: "11px",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ marginTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "10px", color: "#555" }}>Signature</span>
              <div style={{ marginTop: "4px", width: "120px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {signatureMode === "draw" && canvasRef.current && (
                  <img
                    src={canvasRef.current.toDataURL("image/png")}
                    alt="Signature"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                )}
                {signatureMode === "type" && typedSignature && (
                  <span style={{ fontFamily: "cursive", fontSize: "24px" }}>{typedSignature}</span>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "10px", color: "#555" }}>Doctor</span>
              <div style={{ fontSize: "13px", fontWeight: "bold" }}>{formData.doctorName}</div>
            </div>
          </div>
        </form>
      </div>

      <div style={{
        maxWidth: "210mm",
        margin: "0 auto 20px",
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
      }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" }}>Signature</h3>
        
        {/* Mode Selector */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={() => setSignatureMode("draw")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              background: signatureMode === "draw" ? "#0f4c81" : "#e2e8f0",
              color: signatureMode === "draw" ? "#fff" : "#0f172a",
            }}
          >
            Draw Signature
          </button>
          <button
            onClick={() => setSignatureMode("type")}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              background: signatureMode === "type" ? "#0f4c81" : "#e2e8f0",
              color: signatureMode === "type" ? "#fff" : "#0f172a",
            }}
          >
            Type Signature
          </button>
          <button
            onClick={clearSignature}
            style={{
              padding: "8px 16px",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              background: "#fff",
              color: "#ef4444",
            }}
          >
            Clear / Retry
          </button>
        </div>

        {signatureMode === "draw" && (
          <div style={{ marginBottom: "16px" }}>
            {/* Drawing Tools */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>Tool:</span>
              <button
                onClick={() => setDrawingTool("pen")}
                style={{
                  padding: "6px 12px",
                  border: drawingTool === "pen" ? "2px solid #0f4c81" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: drawingTool === "pen" ? "#0f4c81" : "#fff",
                  color: drawingTool === "pen" ? "#fff" : "#0f172a",
                }}
              >
                Pen
              </button>
              <button
                onClick={() => setDrawingTool("eraser")}
                style={{
                  padding: "6px 12px",
                  border: drawingTool === "eraser" ? "2px solid #0f4c81" : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: drawingTool === "eraser" ? "#0f4c81" : "#fff",
                  color: drawingTool === "eraser" ? "#fff" : "#0f172a",
                }}
              >
                Eraser
              </button>
              
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginLeft: "16px" }}>Color:</span>
              <input
                type="color"
                value={penColor}
                onChange={(e) => setPenColor(e.target.value)}
                disabled={drawingTool === "eraser"}
                style={{
                  width: "40px",
                  height: "32px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  cursor: drawingTool === "eraser" ? "not-allowed" : "pointer",
                  opacity: drawingTool === "eraser" ? 0.5 : 1,
                }}
              />

              <span style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", marginLeft: "16px" }}>Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={penSize}
                onChange={(e) => setPenSize(Number(e.target.value))}
                style={{ width: "100px" }}
              />
              <span style={{ fontSize: "14px", color: "#64748b" }}>{penSize}px</span>
            </div>

            <canvas
              ref={canvasRef}
              width={300}
              height={100}
              style={{
                border: "1px dashed #aaa",
                borderRadius: "8px",
                cursor: drawingTool === "pen" ? "crosshair" : "cell",
                touchAction: "none",
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>
        )}

        {signatureMode === "type" && (
          <div style={{ marginBottom: "16px" }}>
            <input
              type="text"
              placeholder="Type your signature here"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontSize: "24px",
                fontFamily: "cursive",
              }}
            />
          </div>
        )}
      </div>

      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: submitSuccess ? "#22c55e" : "#0F4C81",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s",
          }}
        >
          {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted!" : "Submit Prescription"}
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: "#64748B",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s",
          }}
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}

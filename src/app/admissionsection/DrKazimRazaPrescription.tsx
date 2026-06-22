'use client';
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
}

interface DrKazimRazaPrescriptionProps {
  onGoBack?: () => void;
}

export default function DrKazimRazaPrescription({ onGoBack }: DrKazimRazaPrescriptionProps) {
  const [template, setTemplate] = useState<PrescriptionTemplate | null>(null);
  const [formData, setFormData] = useState<PrescriptionSubmission>({
    doctorName: "Dr. Kazim Raza",
    doctorQualifications: "MBBS, &MP",
    pmdcRegNumber: "798414-01-M",
    uidAmb: "UID/AMB 2026",
    timings: "05:00 pm to 09:00 pm",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!formRef.current) return;
    
    try {
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`prescription-${formData.patientName || 'unnamed'}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch('/api/prescription-templates');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          const tpl = json.data[0];
          setTemplate(tpl);
          setFormData(prev => ({ ...prev, ...tpl }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchTemplate();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/prescription-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      padding: '20px',
    }}>
      {onGoBack && (
        <div style={{ maxWidth: '210mm', margin: '0 auto 20px' }}>
          <button
            onClick={onGoBack}
            style={{
              backgroundColor: '#64748B',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
          >
            ← Go Back
          </button>
        </div>
      )}
      <div ref={formRef} style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#fff',
        padding: '16mm 20mm',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: '#000',
        marginBottom: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '4px',
            }}>
              <div style={{
                position: 'relative',
                width: '32px',
                height: '32px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  border: '2px solid #888',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '18px', color: '#333', fontWeight: 'bold' }}>+</span>
                </div>
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#555',
                  border: '2px solid #888',
                }}></div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '13px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderBottom: '1px dashed #aaa',
                    width: '200px',
                    textAlign: 'center',
                    padding: '2px',
                  }}
                />
                <br />
                <input
                  type="text"
                  name="doctorQualifications"
                  value={formData.doctorQualifications}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '11px',
                    border: 'none',
                    borderBottom: '1px dashed #aaa',
                    width: '180px',
                    textAlign: 'center',
                    padding: '2px',
                  }}
                />
                <br />
                PMDC Reg. No.: <input
                  type="text"
                  name="pmdcRegNumber"
                  value={formData.pmdcRegNumber}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '11px',
                    border: 'none',
                    borderBottom: '1px dashed #aaa',
                    width: '120px',
                    padding: '2px',
                  }}
                />
                <br />
                <input
                  type="text"
                  name="uidAmb"
                  value={formData.uidAmb}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '11px',
                    border: 'none',
                    borderBottom: '1px dashed #aaa',
                    width: '120px',
                    padding: '2px',
                  }}
                />
                <br />
                Timings: <input
                  type="text"
                  name="timings"
                  value={formData.timings}
                  onChange={handleInputChange}
                  style={{
                    fontSize: '11px',
                    border: 'none',
                    borderBottom: '1px dashed #aaa',
                    width: '140px',
                    padding: '2px',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #000', marginBottom: '8px' }}></div>

          <div style={{ marginBottom: '8px' }}>
            Date: <input
              type="text"
              name="date"
              value={formData.date || ""}
              onChange={handleInputChange}
              style={{
                border: 'none',
                borderBottom: '1px solid #000',
                width: '120px',
                padding: '2px',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ marginBottom: '4px' }}>
              Patient Name: <input
                type="text"
                name="patientName"
                value={formData.patientName || ""}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #000',
                  width: '200px',
                  padding: '2px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                Age: <input
                  type="text"
                  name="patientAge"
                  value={formData.patientAge || ""}
                  onChange={handleInputChange}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid #000',
                    width: '60px',
                    padding: '2px',
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
                    border: 'none',
                    borderBottom: '1px solid #000',
                    width: '80px',
                    padding: '2px',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '8px', minHeight: '150px' }}>
            <strong>R<sub>x</sub></strong>
            <textarea
              name="rxContent"
              value={formData.rxContent || ""}
              onChange={handleInputChange}
              style={{
                width: '100%',
                minHeight: '120px',
                border: '1px dashed #aaa',
                padding: '8px',
                marginTop: '4px',
                fontSize: '11px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <strong>Advice:</strong>
            <textarea
              name="adviceContent"
              value={formData.adviceContent || ""}
              onChange={handleInputChange}
              style={{
                width: '100%',
                minHeight: '80px',
                border: '1px dashed #aaa',
                padding: '8px',
                marginTop: '4px',
                fontSize: '11px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ borderTop: '1px solid #000', width: '120px', marginBottom: '2px' }}></div>
              <span style={{ fontSize: '10px', color: '#555' }}>Signature</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ borderTop: '1px solid #000', width: '120px', marginBottom: '2px' }}></div>
              <span style={{ fontSize: '10px', color: '#555' }}>Dr. Kazim Raza</span>
            </div>
          </div>
        </form>
      </div>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: submitSuccess ? '#22c55e' : '#0F4C81',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
        >
          {isSubmitting ? 'Submitting...' : submitSuccess ? 'Submitted!' : 'Submit Prescription'}
        </button>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#64748B',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
}

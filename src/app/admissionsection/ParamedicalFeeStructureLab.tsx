"use client";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ParamedicalFeeStructureLabType {
  id: string;
  part1AdmissionFee: string;
  part1MonthlyFee: string;
  part1TotalFee: string;
  part2MonthlyFee: string;
  part2TotalFee: string;
  note: string;
  examFeeNote: string;
  admissionCriteria: string;
  ageLimit: string;
  scholarship: string;
}

interface ParamedicalFeeStructureLabProps {
  onGoBack?: () => void;
}

export default function ParamedicalFeeStructureLab({ onGoBack }: ParamedicalFeeStructureLabProps) {
  const [feeStructure, setFeeStructure] = useState<ParamedicalFeeStructureLabType | null>(null);
  const [formData, setFormData] = useState<any>({
    applicantName: "",
    applicantContact: "",
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

      pdf.save(`paramedical-lab-fee-structure-${formData.applicantName || 'unnamed'}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  useEffect(() => {
    async function fetchFeeStructure() {
      try {
        const res = await fetch('/api/paramedical-fee-structure-lab');
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setFeeStructure(json.data[0]);
        } else {
          setFeeStructure({
            id: 'default',
            part1AdmissionFee: '30000.00',
            part1MonthlyFee: '5000.00',
            part1TotalFee: '90000.00',
            part2MonthlyFee: '5000.00',
            part2TotalFee: '60000.00',
            note: 'All Fee are "Non Refundable"',
            examFeeNote: 'Examination Fee will be paid according\nto (Punjab Medical Faculty) / Federal\nBoard',
            admissionCriteria: 'Matric with Science & Computer Science\n40% iverall',
            ageLimit: 'No Age Limit',
            scholarship: 'First 10 students will get 10% discount on Admission'
          });
        }
      } catch (e) {
        console.error(e);
        setFeeStructure({
          id: 'default',
          part1AdmissionFee: '30000.00',
          part1MonthlyFee: '5000.00',
          part1TotalFee: '90000.00',
          part2MonthlyFee: '5000.00',
          part2TotalFee: '60000.00',
          note: 'All Fee are "Non Refundable"',
          examFeeNote: 'Examination Fee will be paid according\nto (Punjab Medical Faculty) / Federal\nBoard',
          admissionCriteria: 'Matric with Science & Computer Science\n40% iverall',
          ageLimit: 'No Age Limit',
          scholarship: 'First 10 students will get 10% discount on Admission'
        });
      }
    }
    fetchFeeStructure();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...feeStructure,
        ...formData,
      };
      const res = await fetch('/api/paramedical-fee-structure-lab-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
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

  if (!feeStructure) return null;

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: '#e0e0e0', border: '2px solid #888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '18px', color: '#333', fontWeight: 'bold' }}>+</span>
                </div>
                <div style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  backgroundColor: '#555', border: '2px solid #888'
                }}></div>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Care Institute of Health Sciences Satellite Town,</div>
                <div style={{ fontSize: '11px' }}>Rawalpindi. Conact No. 0333-1165573</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Admission Fee Structure</div>
            <div style={{ fontSize: '11px' }}>(Para-medical Trainings  (02 Years Program))</div>
            <div style={{
              display: 'inline-block', backgroundColor: '#b0b0b0', padding: '1px 16px',
              fontWeight: 'bold', marginTop: '4px', fontSize: '10px'
            }}>(Part 01)</div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
              <label style={{ fontWeight: 'bold', minWidth: '100px' }}>Applicant Name:</label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #000',
                  flex: 1,
                  fontSize: '11px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ fontWeight: 'bold', minWidth: '100px' }}>Contact:</label>
              <input
                type="text"
                name="applicantContact"
                value={formData.applicantContact}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  borderBottom: '1px solid #000',
                  flex: 1,
                  fontSize: '11px',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid #555' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'left', width: '35%', fontWeight: 'bold' }}>Program & Duration</th>
                <th style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'left', width: '35%', fontWeight: 'bold' }}>Particulars</th>
                <th style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'right', fontWeight: 'bold' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3} style={{ border: '1px solid #555', padding: '5px 8px', verticalAlign: 'middle', lineHeight: '1.8' }}>
                  Lab Assistant<br />Phlebotomist<br />DEO<br />Lab Bio-Safety<br />Bio-Security<br />Strelization<br />MSDS Trainings
                </td>
                <td style={{ border: '1px solid #555', padding: '5px 8px' }}>Admission Fee</td>
                <td style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'right' }}>{feeStructure.part1AdmissionFee}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #555', padding: '5px 8px' }}>Monthly Fee<br />*12 months</td>
                <td style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'right' }}>{feeStructure.part1MonthlyFee}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #555', padding: '5px 8px', fontWeight: 'bold' }}>Total:</td>
                <td style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'right', fontWeight: 'bold' }}>{feeStructure.part1TotalFee}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ height: '12px' }}></div>

          <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid #555' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'left', width: '35%', fontWeight: 'bold' }}>Program & Duration</th>
                <th style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'left', width: '35%', fontWeight: 'bold' }}>Particulars</th>
                <th style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'left', fontWeight: 'bold' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={2} style={{ border: '1px solid #555', padding: '5px 8px', verticalAlign: 'middle', backgroundColor: '#b0b0b0', fontWeight: 'bold' }}>Part 02</td>
                <td style={{ border: '1px solid #555', padding: '5px 8px' }}>Monthly Fee<br />*12 month</td>
                <td style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'right' }}>{feeStructure.part2MonthlyFee}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #555', padding: '5px 8px', fontWeight: 'bold' }}>Total:</td>
                <td style={{ border: '1px solid #555', padding: '5px 8px', textAlign: 'right', fontWeight: 'bold' }}>{feeStructure.part2TotalFee}</td>
              </tr>
            </tbody>
          </table>

          <div style={{
            backgroundColor: '#b0b0b0', color: '#000', padding: '4px 8px',
            fontWeight: 'bold', fontSize: '10px', borderBottom: '1px solid #555'
          }}>
            Note: &nbsp;&nbsp;&nbsp; {feeStructure.note}
          </div>

          <div style={{ padding: '8px', borderBottom: '1px solid #555', fontSize: '11px' }}>
            {feeStructure.examFeeNote.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>

          <div style={{ padding: '8px 8px 10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
              <span style={{ backgroundColor: '#b0b0b0', padding: '1px 6px', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '10px' }}>Admission Criteria</span>
              <span>{feeStructure.admissionCriteria.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <span style={{ minWidth: '70px' }}>Age Limit</span>
              <span>{feeStructure.ageLimit}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ backgroundColor: '#b0b0b0', padding: '1px 6px', fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '10px' }}>Scholorship</span>
              <span>{feeStructure.scholarship}</span>
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
          {isSubmitting ? 'Submitting...' : submitSuccess ? 'Submitted!' : 'Submit Fee Structure'}
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
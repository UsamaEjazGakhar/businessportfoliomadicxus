'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PrescriptionViewProps {
  data: {
    doctorName?: string;
    doctorQualifications?: string;
    pmdcRegNumber?: string;
    uidAmb?: string;
    timings?: string;
    patientName?: string;
    patientAge?: string;
    patientGender?: string;
    date?: string;
    visitNumber?: string;
    contactCnic?: string;
    address?: string;
    sonDaughterWifeOf?: string;
    weight?: string;
    vco?: string;
    bp?: string;
    pulse?: string;
    temp?: string;
    spo2?: string;
    bsr?: string;
    presentingComplaint?: string;
    abdomen?: string;
    resp?: string;
    cvs?: string;
    cns?: string;
    otherFindings?: string;
    htn?: string;
    dm?: string;
    hepatitis?: string;
    kd?: string;
    allergy?: string;
    addiction?: string;
    prevMed?: string;
    rxContent?: string;
    adviceContent?: string;
    signature?: string;
  };
  readOnly?: boolean;
}

export default function PrescriptionView({ data: initialData, readOnly = false }: PrescriptionViewProps) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [signatureImage, setSignatureImage] = useState(initialData.signature || "");
  
  // Form state
  const [formData, setFormData] = useState({
    doctorName: initialData.doctorName || "Dr. Kazim Raza",
    doctorQualifications: initialData.doctorQualifications || "MBBS RAMP",
    pmdcRegNumber: initialData.pmdcRegNumber || "7984414-01-M",
    uidAmb: initialData.uidAmb || "",
    timings: initialData.timings || "05:00 pm to 09:00 pm",
    patientName: initialData.patientName || "",
    patientAge: initialData.patientAge || "",
    patientGender: initialData.patientGender || "",
    date: initialData.date || new Date().toISOString().split('T')[0],
    visitNumber: initialData.visitNumber || "",
    contactCnic: initialData.contactCnic || "",
    address: initialData.address || "",
    sonDaughterWifeOf: initialData.sonDaughterWifeOf || "",
    weight: initialData.weight || "",
    vco: initialData.vco || "",
    bp: initialData.bp || "",
    pulse: initialData.pulse || "",
    temp: initialData.temp || "",
    spo2: initialData.spo2 || "",
    bsr: initialData.bsr || "",
    presentingComplaint: initialData.presentingComplaint || "",
    abdomen: initialData.abdomen || "",
    resp: initialData.resp || "",
    cvs: initialData.cvs || "",
    cns: initialData.cns || "",
    otherFindings: initialData.otherFindings || "",
    htn: initialData.htn || "",
    dm: initialData.dm || "",
    hepatitis: initialData.hepatitis || "",
    kd: initialData.kd || "",
    allergy: initialData.allergy || "",
    addiction: initialData.addiction || "",
    prevMed: initialData.prevMed || "",
    rxContent: initialData.rxContent || "",
    adviceContent: initialData.adviceContent || "",
    signature: initialData.signature || ""
  });

  useEffect(() => {
    if (!readOnly) {
      const saved = localStorage.getItem("prescriptionForm");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({ ...prev, ...parsed }));
          if (parsed.signature) {
            setSignatureImage(parsed.signature);
          }
        } catch (e) {
          console.error(e);
        }
      }
      // Keyboard shortcut Ctrl+S to save form data
      const handler = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault();
          saveForm();
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [readOnly]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (signatureImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = signatureImage;
    }
  }, [signatureImage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (!readOnly) {
      // Auto-save to localStorage on change
      localStorage.setItem("prescriptionForm", JSON.stringify({ ...formData, [id]: value }));
    }
  };

  const saveForm = async () => {
    if (readOnly) return;
    try {
      setShowSuccess(true);
      const res = await fetch('/api/prescription-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        localStorage.removeItem("prescriptionForm");
        router.replace('/consultant?view=prescriptions');
      } else {
        alert('Error: ' + (result.message || 'Failed to save'));
        setShowSuccess(false);
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving');
      setShowSuccess(false);
    }
  };

  const clearForm = () => {
    if (readOnly) return;
    if (confirm("Clear all fields?")) {
      const resetData = {
        doctorName: "Dr. Kazim Raza",
        doctorQualifications: "MBBS RAMP",
        pmdcRegNumber: "7984414-01-M",
        uidAmb: "",
        timings: "05:00 pm to 09:00 pm",
        patientName: "",
        patientAge: "",
        patientGender: "",
        date: new Date().toISOString().split('T')[0],
        visitNumber: "",
        contactCnic: "",
        address: "",
        sonDaughterWifeOf: "",
        weight: "",
        vco: "",
        bp: "",
        pulse: "",
        temp: "",
        spo2: "",
        bsr: "",
        presentingComplaint: "",
        abdomen: "",
        resp: "",
        cvs: "",
        cns: "",
        otherFindings: "",
        htn: "",
        dm: "",
        hepatitis: "",
        kd: "",
        allergy: "",
        addiction: "",
        prevMed: "",
        rxContent: "",
        adviceContent: "",
        signature: ""
      };
      setFormData(resetData);
      localStorage.setItem("prescriptionForm", JSON.stringify(resetData));
      setSignatureImage("");
      clearCanvas();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageUrl = canvas.toDataURL();
    setSignatureImage(imageUrl);
    setFormData(prev => ({ ...prev, signature: imageUrl }));
    if (!readOnly) {
      localStorage.setItem("prescriptionForm", JSON.stringify({ ...formData, signature: imageUrl }));
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = isEraser ? 20 : 2;
    ctx.strokeStyle = isEraser ? 'white' : 'black';

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const printForm = () => {
    // Use the form data to render the prescription for printing (better approach)
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Prescription</title>
        <style>
          * {margin:0;padding:0;box-sizing:border-box;}
          html, body {font-family:Arial, sans-serif;line-height:1;background:white;height:100%;width:100%;}
          .container {
            width:100%;
            max-width:8.5in;
            margin:0 auto;
            background:#fff;
            padding:0.4in;
            display:flex;
            flex-direction:column;
          }
          .header {margin-bottom:5px;}
          .doctor-name {font-size:12px;font-weight:bold;margin-bottom:1px;}
          .doctor-qualifications {font-size:9px;line-height:1;margin-bottom:3px;}
          .timings {font-size:9px;margin-bottom:4px;}
          .divider {border-top:1px solid #000;margin-bottom:4px;}
          .main-content {display:flex;gap:8px;}
          .left-column {flex:1;border-right:1px solid #333;padding-right:8px;font-size:9px;display:flex;flex-direction:column;}
          .right-column {flex:1;font-size:9px;display:flex;flex-direction:column;}
          .form-group {margin-bottom:2px;display:flex;align-items:center;gap:2px;}
          .form-group-full {margin-bottom:2px;}
          .label {font-weight:bold;min-width:60px;font-size:9px;}
          .label-short {font-weight:bold;min-width:35px;font-size:9px;}
          .field-value {border:none;border-bottom:1px solid #000;font-size:9px;padding:1px;flex:1;display:inline-block;min-height:12px;}
          .vco-box{border:1px solid #000;width:50px;height:20px;margin-top:1px;}
          .section-title{font-weight:bold;margin-top:4px;margin-bottom:1px;font-size:9px;}
          .vital-item{display:flex;gap:2px;margin-bottom:0px;}
          .vital-item .field-value{flex:1;min-width:50px;}
          .rx-area{border:1px solid #000;padding:4px;margin-top:4px;min-height:180px;display:flex;flex-direction:column;}
          .rx-label{font-weight:bold;font-size:9px;margin-bottom:2px;}
          .rx-input{width:100%;min-height:150px;border:none;font-size:9px;display:block;white-space:pre-wrap;}
          .investigation-section{border-top:1px solid #000;padding-top:4px;margin-top:4px;min-height:180px;display:flex;flex-direction:column;}
          .investigation-title{font-weight:bold;margin-bottom:2px;font-size:9px;}
          .investigation-content{width:100%;min-height:150px;border:1px solid #000;padding:1px;font-size:9px;display:block;white-space:pre-wrap;}
          .history-item{margin-bottom:0px;display:flex;align-items:center;gap:2px;}
          .history-label{font-weight:bold;min-width:50px;font-size:9px;}
          .history-value{flex:1;border:none;border-bottom:1px solid #000;font-size:9px;padding:1px;}
          .rx-title{font-size:12px;font-weight:bold;text-align:center;margin-bottom:4px;}
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            html, body {
              height: 100%;
              width: 100%;
              margin:0;
              padding:0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="doctor-name"><span class="field-value">${formData.doctorName}</span></div>
            <div class="doctor-qualifications">
              <span class="field-value">${formData.doctorQualifications}</span><br/>
              PMDC Reg: <span class="field-value">${formData.pmdcRegNumber}</span>
            </div>
            <div class="timings">Timings: ${formData.timings}</div>
          </div>
          <div class="divider"></div>
          <div class="main-content">
            <div class="left-column">
              <div class="form-group">
                <span class="label">UID/AMB #:</span>
                <span class="field-value">${formData.uidAmb}</span>
              </div>
              <div class="form-group">
                <span class="label-short">Time:</span>
                <span class="field-value">${formData.timings}</span>
                <span class="label-short">Date:</span>
                <span class="field-value">${formData.date}</span>
              </div>
              <div class="form-group">
                <span class="label">Visit #:</span>
                <span class="field-value">${formData.visitNumber}</span>
              </div>
              <div class="form-group">
                <span class="label">Contact/CNIC:</span>
                <span class="field-value">${formData.contactCnic}</span>
              </div>
              <div class="form-group-full">
                <span class="label">Address:</span>
              </div>
              <div class="form-group-full">
                <span class="field-value" style="width:100%;">${formData.address}</span>
              </div>
              <div class="form-group">
                <span class="label">Name:</span>
                <span class="field-value">${formData.patientName}</span>
              </div>
              <div class="form-group">
                <span class="label-short">S/O D/O W/O:</span>
                <span class="field-value">${formData.sonDaughterWifeOf}</span>
              </div>
              <div class="form-group">
                <span class="label">Age/Gender:</span>
                <span class="field-value">${formData.patientAge}</span>
                <span class="label-short">Weight:</span>
                <span class="field-value">${formData.weight}</span>
              </div>
              <div class="form-group-full">
                <span class="label">VCO:</span>
              </div>
              <div class="vco-box">
                <span class="field-value" style="border:none;">${formData.vco}</span>
              </div>
              <div class="section-title">Vitals:</div>
              <div class="vital-item">
                <span class="label-short">BP:</span>
                <span class="field-value">${formData.bp}</span>
              </div>
              <div class="vital-item">
                <span class="label-short">Pulse:</span>
                <span class="field-value">${formData.pulse}</span>
              </div>
              <div class="vital-item">
                <span class="label-short">Temp:</span>
                <span class="field-value">${formData.temp}</span>
              </div>
              <div class="vital-item">
                <span class="label-short">SpO2:</span>
                <span class="field-value">${formData.spO2}</span>
              </div>
              <div class="vital-item">
                <span class="label-short">BSR:</span>
                <span class="field-value">${formData.bsr}</span>
              </div>
              <div class="section-title">Presenting Complaint:</div>
              <div class="field-value" style="border:1px solid #000;padding:2px;min-height:20px;">${formData.presentingComplaint}</div>
              <div class="section-title">Findings:</div>
              <div class="history-item">
                <span class="history-label">Abdomen:</span>
                <span class="history-value">${formData.abdomen}</span>
              </div>
              <div class="history-item">
                <span class="history-label">Resp:</span>
                <span class="history-value">${formData.resp}</span>
              </div>
              <div class="history-item">
                <span class="history-label">CVS:</span>
                <span class="history-value">${formData.cvs}</span>
              </div>
              <div class="history-item">
                <span class="history-label">CNS:</span>
                <span class="history-value">${formData.cns}</span>
              </div>
              <div class="history-item">
                <span class="history-label">Others:</span>
                <span class="history-value">${formData.otherFindings}</span>
              </div>
              <div class="section-title">History:</div>
              <div class="history-item">
                <span class="history-label">HTN</span>
                <span class="history-value">${formData.htn}</span>
              </div>
              <div class="history-item">
                <span class="history-label">DM</span>
                <span class="history-value">${formData.dm}</span>
              </div>
              <div class="history-item">
                <span class="history-label">Hepatitis</span>
                <span class="history-value">${formData.hepatitis}</span>
              </div>
              <div class="history-item">
                <span class="history-label">K/D</span>
                <span class="history-value">${formData.kd}</span>
              </div>
              <div class="history-item">
                <span class="history-label">Allergy</span>
                <span class="history-value">${formData.allergy}</span>
              </div>
              <div class="history-item">
                <span class="history-label">Addiction</span>
                <span class="history-value">${formData.addiction}</span>
              </div>
              <div class="history-item">
                <span class="history-label">Prev. Med.</span>
                <span class="history-value">${formData.prevMed}</span>
              </div>
            </div>
            <div class="right-column">
              <div class="rx-title">Rx</div>
              <div class="rx-area">
                <div class="rx-label">PRESCRIPTION:</div>
                <div class="rx-input">${formData.rxContent}</div>
              </div>
              <div class="investigation-section">
                <div class="investigation-title">INVESTIGATION:</div>
                <div class="investigation-content">${formData.adviceContent}</div>
              </div>
              <div class="signature-section" style="margin-top: 8px">
                <div class="section-title">Signature:</div>
                ${formData.signature ? `<img src="${formData.signature}" style="max-width: 300px; max-height: 80px; border: 1px solid #000" />` : `<div style="width: 300px; height: 80px; border: 1px solid #000"></div>`}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      // Wait for content to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      window.print();
    }
  };

  return (
    <div className="prescription-wrapper">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="doctor-name">
            <input 
              id="doctorName" 
              type="text" 
              value={formData.doctorName}
              onChange={handleChange}
              readOnly={readOnly}
              style={{ width: '100%' }}
            />
          </div>
          <div className="doctor-qualifications">
            <input 
              id="doctorQualifications" 
              type="text" 
              value={formData.doctorQualifications}
              onChange={handleChange}
              readOnly={readOnly}
              style={{ width: '100%' }}
            /><br />
            PMDC Reg: <input 
              id="pmdcRegNumber" 
              type="text" 
              value={formData.pmdcRegNumber}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
          <div className="timings">
            Timings: {formData.timings}
          </div>
        </div>
        <div className="divider" />
        {/* Main Content */}
        <div className="main-content">
          {/* Left Column */}
          <div className="left-column">
            <div className="form-group">
              <span className="label">UID/AMB #:</span>
              <input 
                id="uidAmb" 
                type="text" 
                value={formData.uidAmb}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group">
              <span className="label-short">Time:</span>
              <input 
                id="timings" 
                type="text" 
                value={formData.timings.split(' to ')[0]}
                onChange={handleChange}
                readOnly={readOnly}
              />
              <span className="label-short">Date:</span>
              <input 
                id="date"
                type="date" 
                value={formData.date}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group">
              <span className="label">Visit #:</span>
              <input 
                id="visitNumber"
                type="text"
                value={formData.visitNumber}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group">
              <span className="label">Contact/CNIC:</span>
              <input 
                id="contactCnic"
                type="text"
                value={formData.contactCnic}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group-full">
              <span className="label">Address:</span>
            </div>
            <div className="form-group-full">
              <input 
                id="address"
                type="text" 
                style={{ width: "100%" }}
                value={formData.address}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group">
              <span className="label">Name:</span>
              <input 
                id="patientName" 
                type="text" 
                value={formData.patientName}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group">
              <span className="label-short">S/O D/O W/O:</span>
              <input 
                id="sonDaughterWifeOf"
                type="text"
                value={formData.sonDaughterWifeOf}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="form-group">
              <span className="label">Age/Gender:</span>
              <input 
                id="patientAge" 
                type="text" 
                value={formData.patientAge}
                onChange={handleChange}
                readOnly={readOnly}
              />
              <span className="label-short">Weight:</span>
              <input 
                id="weight"
                type="text"
                value={formData.weight}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            {/* VCO placeholder */}
            <div className="form-group-full">
              <span className="label">VCO:</span>
            </div>
            <div className="vco-box">
              <input 
                id="vco"
                type="text"
                style={{ width: '100%', height: '100%', border: 'none' }}
                value={formData.vco}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            {/* Vitals */}
            <div className="section-title">Vitals:</div>
            <div className="vital-item">
              <span className="label-short">BP:</span>
              <input 
                id="bp"
                type="text"
                value={formData.bp}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="vital-item">
              <span className="label-short">Pulse:</span>
              <input 
                id="pulse"
                type="text"
                value={formData.pulse}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="vital-item">
              <span className="label-short">Temp:</span>
              <input 
                id="temp"
                type="text"
                value={formData.temp}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="vital-item">
              <span className="label-short">SpO2:</span>
              <input 
                id="spo2"
                type="text"
                value={formData.spo2}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="vital-item">
              <span className="label-short">BSR:</span>
              <input 
                id="bsr"
                type="text"
                value={formData.bsr}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            {/* Presenting Complaint */}
            <div className="section-title">Presenting Complaint:</div>
            <textarea 
              id="presentingComplaint"
              placeholder="Write presenting complaint here..."
              value={formData.presentingComplaint}
              onChange={handleChange}
              readOnly={readOnly}
            />
            {/* Findings */}
            <div className="section-title">Findings:</div>
            <div className="history-item">
              <span className="history-label">Abdomen:</span>
              <input 
                id="abdomen"
                type="text" className="history-input"
                value={formData.abdomen}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">Resp:</span>
              <input 
                id="resp"
                type="text" className="history-input"
                value={formData.resp}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">CVS:</span>
              <input 
                id="cvs"
                type="text" className="history-input"
                value={formData.cvs}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">CNS:</span>
              <input 
                id="cns"
                type="text" className="history-input"
                value={formData.cns}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">Others:</span>
              <input 
                id="otherFindings"
                type="text" className="history-input"
                value={formData.otherFindings}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            {/* History */}
            <div className="section-title">History:</div>
            <div className="history-item">
              <span className="history-label">HTN</span>
              <input 
                id="htn"
                type="text" className="history-input"
                value={formData.htn}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">DM</span>
              <input 
                id="dm"
                type="text" className="history-input"
                value={formData.dm}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">Hepatitis</span>
              <input 
                id="hepatitis"
                type="text" className="history-input"
                value={formData.hepatitis}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">K/D</span>
              <input 
                id="kd"
                type="text" className="history-input"
                value={formData.kd}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">Allergy</span>
              <input 
                id="allergy"
                type="text" className="history-input"
                value={formData.allergy}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">Addiction</span>
              <input 
                id="addiction"
                type="text" className="history-input"
                value={formData.addiction}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="history-item">
              <span className="history-label">Prev. Med.</span>
              <input 
                id="prevMed"
                type="text" className="history-input"
                value={formData.prevMed}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <div className="rx-title">Rx</div>
            <div className="rx-area">
              <div className="rx-label">PRESCRIPTION:</div>
              <textarea 
                id="rxContent"
                className="rx-input"
                value={formData.rxContent}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="investigation-section">
              <div className="investigation-title">INVESTIGATION:</div>
              <textarea 
                id="adviceContent"
                className="investigation-content"
                value={formData.adviceContent}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </div>
            <div className="signature-section" style={{ marginTop: '8px' }}>
              <div className="section-title">Signature:</div>
              {!readOnly && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                  <button
                    onClick={() => setIsEraser(false)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      backgroundColor: isEraser ? '#e2e8f0' : '#0f4c81',
                      color: isEraser ? '#0f172a' : 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Draw
                  </button>
                  <button
                    onClick={() => setIsEraser(true)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      backgroundColor: isEraser ? '#ef4444' : '#e2e8f0',
                      color: isEraser ? 'white' : '#0f172a',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Eraser
                  </button>
                  <button
                    onClick={clearCanvas}
                    style={{
                      padding: '4px 8px',
                      fontSize: '10px',
                      backgroundColor: '#e2e8f0',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={300}
                height={80}
                style={{
                  border: '1px solid #000',
                  backgroundColor: 'white',
                  cursor: isEraser ? 'crosshair' : 'default',
                  width: '100%',
                  maxWidth: '300px'
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="prescription-action-buttons" style={{marginTop: '4px', display: 'flex', gap: '8px'}}>
              {!readOnly && (
                <button onClick={saveForm} style={{flex: 1, padding: '6px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px'}}>
                  Save Prescription
                </button>
              )}
              <button onClick={printForm} style={{flex: 1, padding: '6px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px'}}>
                Print / Download
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden control buttons (non-print) */}
      <div className="button-group" style={{ display: 'none' }}>
        <button onClick={printForm}>Print Form</button>
        {!readOnly && (
          <>
            <button onClick={saveForm}>Save Prescription</button>
            <button onClick={saveForm}>Save Form</button>
            <button onClick={() => window.location.reload()}>Load Form</button>
            <button onClick={clearForm}>Clear Form</button>
          </>
        )}
      </div>
      <style jsx>{`
        * {margin:0;padding:0;box-sizing:border-box;}
        .prescription-wrapper {font-family:Arial, sans-serif;line-height:1;background:#f5f5f5;}
        .container {max-width:8.5in;margin:5px auto;background:#fff;padding:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);border:1px solid #ddd;display:flex;flex-direction:column;}
        .header {margin-bottom:5px;}
        .doctor-name {font-size:12px;font-weight:bold;margin-bottom:1px;}
        .doctor-qualifications {font-size:9px;line-height:1;margin-bottom:3px;}
        .timings {font-size:9px;margin-bottom:4px;}
        .divider {border-top:1px solid #000;margin-bottom:4px;}
        .main-content {display:flex;gap:8px;flex:1;}
        .left-column {flex:1;border-right:1px solid #333;padding-right:8px;font-size:9px;}
        .right-column {flex:1;font-size:9px;}
        .form-group {margin-bottom:2px;display:flex;align-items:center;gap:2px;}
        .form-group-full {margin-bottom:2px;}
        .label {font-weight:bold;min-width:60px;font-size:9px;}
        .label-short {font-weight:bold;min-width:35px;font-size:9px;}
        input[type="text"],input[type="date"],textarea{border:none;border-bottom:1px solid #000;font-size:9px;padding:1px;flex:1;}
        input[type="text"]:focus,textarea:focus{outline:none;background:#fffacd;}
        input[readonly],textarea[readonly]{background: #f0f0f0;}
        textarea{resize:none;min-height:30px;border:1px solid #000;padding:1px;}
        #presentingComplaint{min-height:20px;width:100%;}
        .vco-box{border:1px solid #000;width:50px;height:20px;margin-top:1px;}
        .section-title{font-weight:bold;margin-top:4px;margin-bottom:1px;font-size:9px;}
        .vital-item{display:flex;gap:2px;margin-bottom:0px;}
        .vital-item input{flex:1;min-width:50px;}
        .rx-area{border:1px solid #000;padding:4px;margin-top:4px;min-height:180px;}
        .rx-label{font-weight:bold;font-size:9px;margin-bottom:2px;}
        .rx-input{width:100%;min-height:150px;border:none;font-size:9px;resize:none;}
        .rx-input:focus{outline:none;background:#fffacd;}
        .investigation-section{border-top:1px solid #000;padding-top:4px;margin-top:4px;min-height:180px;}
        .investigation-title{font-weight:bold;margin-bottom:2px;font-size:9px;}
        .investigation-content{width:100%;min-height:150px;border:1px solid #000;padding:1px;font-size:9px;resize:none;}
        .history-item{margin-bottom:0px;display:flex;align-items:center;gap:2px;}
        .history-label{font-weight:bold;min-width:50px;font-size:9px;}
        .history-input{flex:1;border:none;border-bottom:1px solid #000;font-size:9px;padding:1px;}
        .history-input:focus{outline:none;background:#fffacd;}
        @media print{
          .prescription-wrapper{background:white !important;max-height:none !important;overflow:visible !important;}
          body{background:white;margin:0 !important;padding:0 !important;}
          .container{
            box-shadow:none;
            margin:0;
            padding:0.5in;
            height:auto;
            max-width:100% !important;
            width:100% !important;
          }
          input,textarea,.history-input,.rx-input,.investigation-content{background:white !important;}
          .prescription-action-buttons{display:none !important;}
        }
        .button-group{display:flex;gap:8px;margin-top:8px;justify-content:center;}
        button{padding:5px 8px;font-size:10px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;}
        button:hover{background:#45a049;}
        .rx-title{font-size:12px;font-weight:bold;text-align:center;margin-bottom:4px;}
        .prescription-wrapper{max-height:95vh;overflow-y:auto;font-family:Arial, sans-serif;line-height:1;background:#f5f5f5;}
        .prescription-wrapper .container {
          max-width:8.5in;
          margin:10px auto;
          background:#fff;
          padding:0.4in;
          display:flex;
          flex-direction:column;
          box-shadow:0 0 10px rgba(0,0,0,0.1);
          border:1px solid #ddd;
        }
      `}</style>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            background: '#fff',
            padding: '20px 40px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            fontSize: '18px',
            fontWeight: 600,
            color: '#0f4c81',
          }}>
            Saving Prescription...
          </div>
        </div>
      )}
    </div>
  );
}

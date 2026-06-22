'use client';
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface Qualification {
  degreeProgram: string;
  scienceOrArts?: string;
  totalMarks?: string;
  marksObtained?: string;
  percentage?: string;
  physicsMarks?: string;
  chemistryMarks?: string;
  biologyMarks?: string;
  scienceTotal?: string;
  sciencePercentage?: string;
}

interface AdmissionFormTemplate {
  id: string;
  instituteName: string;
  instituteAddress: string;
  instituteContact: string;
}

interface AdmissionFormSubmission {
  instituteName: string;
  instituteAddress: string;
  instituteContact: string;
  applicantName?: string;
  fatherName?: string;
  dateOfBirth?: string;
  cnicBFormNumber?: string;
  domicileDistrict?: string;
  permanentAddress?: string;
  postalAddress?: string;
  mobileNumber?: string;
  photoUrl?: string;
  applicantSignatureUrl?: string;
  guardianSignatureUrl?: string;
  admissionGranted?: boolean;
  admissionDenied?: boolean;
  qualifications: Qualification[];
}

interface AdmissionFormProps {
  onGoBack?: () => void;
}

const DEFAULT_FORM_DATA: AdmissionFormSubmission = {
  instituteName: "Care Institute of Health Sciences",
  instituteAddress: "Plot 71-C, Satellite Town, Block-A, Rawalpindi",
  instituteContact: "0333-1165573",
  qualifications: [
    { degreeProgram: "SSC (Matric)" },
    { degreeProgram: "FSc" },
  ],
};

export default function AdmissionForm({ onGoBack }: AdmissionFormProps) {
  const [template, setTemplate] = useState<AdmissionFormTemplate | null>(null);
  const [formData, setFormData] = useState<AdmissionFormSubmission>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
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

      pdf.save(`admission-form-${formData.applicantName || 'unnamed'}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch('/api/admission-forms');
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQualificationChange = (index: number, field: keyof Qualification, value: string) => {
    setFormData(prev => {
      const updatedQuals = [...prev.qualifications];
      updatedQuals[index] = { ...updatedQuals[index], [field]: value };
      return { ...prev, qualifications: updatedQuals };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData(prev => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Don't send photoUrl to API to avoid length errors
      const { photoUrl, ...dataWithoutPhoto } = formData;
      const res = await fetch('/api/admission-form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithoutPhoto),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        // Reset form
        setFormData(DEFAULT_FORM_DATA);
        setPhotoPreview(null);
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
      <div style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#fff',
        padding: '12mm 18mm',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#000',
        marginBottom: '20px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', height: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  borderBottom: '1px dashed #aaa',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}
              />
            </div>
            <div style={{ fontSize: '10px' }}>
              <input
                type="text"
                name="instituteAddress"
                value={formData.instituteAddress}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  borderBottom: '1px dashed #aaa',
                  fontSize: '10px',
                  textAlign: 'center',
                  width: '90%',
                }}
              />
            </div>
            <div style={{ fontSize: '10px' }}>
              Contact No. <input
                type="text"
                name="instituteContact"
                value={formData.instituteContact}
                onChange={handleInputChange}
                style={{
                  border: 'none',
                  borderBottom: '1px dashed #aaa',
                  fontSize: '10px',
                  width: '120px',
                }}
              />
            </div>
          </div>

          {/* Admission Form title + Category row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>Admission Form</div>
              <div style={{ fontSize: '10px', marginBottom: '2px' }}>Category / Course applied</div>
              {['a)', 'b)', 'c)'].map((lbl, i) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '4px' }}>
                  <span style={{ minWidth: '16px' }}>{lbl}</span>
                  <input
                    type="text"
                    name={`category${i}`}
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #000',
                      width: '160px',
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Photo box */}
            <div style={{
              width: '80px',
              height: '90px',
              border: '1px solid #555',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: '9px',
              color: '#555',
              padding: '4px',
              position: 'relative',
            }}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Applicant photo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <>
                  Past one passport size photograph without attestation
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer',
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Name fields */}
          {[
            { label: 'Name of Applicant:', name: 'applicantName', sub: '(in block letter)' },
            { label: "Father's Name:", name: 'fatherName', sub: '(in block letter)' },
          ].map(({ label, name, sub }) => (
            <div key={name} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{label}</div>
                  <div style={{ color: '#555', fontSize: '9px' }}>{sub}</div>
                </div>
                <input
                  type="text"
                  name={name}
                  value={(formData as any)[name] || ""}
                  onChange={handleInputChange}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid #000',
                    flex: 1,
                    marginBottom: '2px',
                  }}
                />
              </div>
            </div>
          ))}

          {/* Date of Birth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', minWidth: '90px' }}>Date of Birth:</span>
            <input
              type="text"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
              onChange={handleInputChange}
              placeholder="DD-MM-YYYY"
              style={{
                border: '1px solid #555',
                width: '200px',
                padding: '4px',
              }}
            />
          </div>

          {/* CNIC */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ fontWeight: 'bold', minWidth: '90px' }}>
              CNIC/B.Form<br />Number (NADRA)
            </div>
            <input
              type="text"
              name="cnicBFormNumber"
              value={formData.cnicBFormNumber || ""}
              onChange={handleInputChange}
              placeholder="XXXXX-XXXXXXX-X"
              style={{
                border: '1px solid #555',
                width: '250px',
                padding: '4px',
              }}
            />
          </div>

          {/* Domicile */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '6px' }}>
            <span style={{ fontWeight: 'bold', minWidth: '120px' }}>Domicile District:</span>
            <input
              type="text"
              name="domicileDistrict"
              value={formData.domicileDistrict || ""}
              onChange={handleInputChange}
              style={{
                border: 'none',
                borderBottom: '1px solid #000',
                flex: 1,
              }}
            />
          </div>

          {/* Permanent Home Address */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Permanent Home<br />Address:</div>
            <textarea
              name="permanentAddress"
              value={formData.permanentAddress || ""}
              onChange={handleInputChange}
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #000',
                marginBottom: '4px',
                fontSize: '10px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Postal Address */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Postal Address:</div>
            <textarea
              name="postalAddress"
              value={formData.postalAddress || ""}
              onChange={handleInputChange}
              style={{
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #000',
                marginBottom: '4px',
                fontSize: '10px',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Mobile Number */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', minWidth: '110px' }}>Mobile Number:</span>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber || ""}
              onChange={handleInputChange}
              placeholder="03XXXXXXXXX"
              style={{
                border: '1px solid #555',
                width: '150px',
                padding: '4px',
              }}
            />
          </div>

          {/* Qualification heading */}
          <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px', fontSize: '11px' }}>Qualification</div>

          {/* Qualification Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', fontSize: '9px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Degree / Program</th>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Science/Arts</th>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Total Marks</th>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Marks Obtained</th>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Percentage</th>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Marks in Science Subjects</th>
                <th style={{ border: '1px solid #555', padding: '4px', textAlign: 'left' }}>Aggregate percentage in science subject</th>
              </tr>
            </thead>
            <tbody>
              {formData.qualifications.map((qual, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #555', padding: '4px', verticalAlign: 'top' }}>
                    <input
                      type="text"
                      value={qual.degreeProgram}
                      onChange={(e) => handleQualificationChange(idx, 'degreeProgram', e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9px',
                        width: '100%',
                      }}
                    />
                  </td>
                  <td style={{ border: '1px solid #555', padding: '4px' }}>
                    <input
                      type="text"
                      value={qual.scienceOrArts || ""}
                      onChange={(e) => handleQualificationChange(idx, 'scienceOrArts', e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9px',
                        width: '100%',
                      }}
                    />
                  </td>
                  <td style={{ border: '1px solid #555', padding: '4px' }}>
                    <input
                      type="text"
                      value={qual.totalMarks || ""}
                      onChange={(e) => handleQualificationChange(idx, 'totalMarks', e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9px',
                        width: '100%',
                      }}
                    />
                  </td>
                  <td style={{ border: '1px solid #555', padding: '4px' }}>
                    <input
                      type="text"
                      value={qual.marksObtained || ""}
                      onChange={(e) => handleQualificationChange(idx, 'marksObtained', e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9px',
                        width: '100%',
                      }}
                    />
                  </td>
                  <td style={{ border: '1px solid #555', padding: '4px' }}>
                    <input
                      type="text"
                      value={qual.percentage || ""}
                      onChange={(e) => handleQualificationChange(idx, 'percentage', e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9px',
                        width: '100%',
                      }}
                    />
                  </td>
                  <td style={{ border: '1px solid #555', padding: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bbb', paddingBottom: '2px', marginBottom: '2px' }}>
                      <span>Physics</span>
                      <input
                        type="text"
                        value={qual.physicsMarks || ""}
                        onChange={(e) => handleQualificationChange(idx, 'physicsMarks', e.target.value)}
                        style={{
                          border: 'none',
                          fontSize: '9px',
                          width: '40px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bbb', paddingBottom: '2px', marginBottom: '2px' }}>
                      <span>Chemistry</span>
                      <input
                        type="text"
                        value={qual.chemistryMarks || ""}
                        onChange={(e) => handleQualificationChange(idx, 'chemistryMarks', e.target.value)}
                        style={{
                          border: 'none',
                          fontSize: '9px',
                          width: '40px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #bbb', paddingBottom: '2px', marginBottom: '2px' }}>
                      <span>Biology</span>
                      <input
                        type="text"
                        value={qual.biologyMarks || ""}
                        onChange={(e) => handleQualificationChange(idx, 'biologyMarks', e.target.value)}
                        style={{
                          border: 'none',
                          fontSize: '9px',
                          width: '40px',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total</span>
                      <input
                        type="text"
                        value={qual.scienceTotal || ""}
                        onChange={(e) => handleQualificationChange(idx, 'scienceTotal', e.target.value)}
                        style={{
                          border: 'none',
                          fontSize: '9px',
                          width: '40px',
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ border: '1px solid #555', padding: '4px' }}>
                    <input
                      type="text"
                      value={qual.sciencePercentage || ""}
                      onChange={(e) => handleQualificationChange(idx, 'sciencePercentage', e.target.value)}
                      style={{
                        border: 'none',
                        fontSize: '9px',
                        width: '100%',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature row */}
          <div style={{ display: 'flex', gap: '30px', marginBottom: '10px', fontSize: '10px' }}>
            <div style={{ flex: 1 }}>
              <span>Signature of Applicant:</span>
              <div style={{ borderBottom: '1px solid #000', marginTop: '2px' }}></div>
            </div>
            <div style={{ flex: 1 }}>
              <span>Signature of Parents/Guardian:</span>
              <div style={{ borderBottom: '1px solid #000', marginTop: '2px' }}></div>
            </div>
          </div>

          {/* Checklist */}
          <div style={{ marginBottom: '10px', fontSize: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Documents/Checklist (14 sets of following documents)</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                {['SSC/Matric Marks Sheet', 'SSC/Matric Certificate', 'Domicile'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <input type="checkbox" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: 1 }}>
                {['CNIC/B. Form (Student)', 'CNIC (Father / Student)', 'Pictures'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <input type="checkbox" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* For Office Use Only */}
          <div style={{ border: '1px solid #555', padding: '6px 10px', marginBottom: '8px', fontSize: '10px' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '6px' }}>For Office Use Only</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Admission Granted</span>
                <input
                  type="checkbox"
                  name="admissionGranted"
                  checked={formData.admissionGranted || false}
                  onChange={handleInputChange}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Admission Denied</span>
                <input
                  type="checkbox"
                  name="admissionDenied"
                  checked={formData.admissionDenied || false}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ borderTop: '1px solid #555', paddingTop: '6px', fontSize: '10px' }}>
            Fees Once paid are not returnable/refundable or transferable
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
          {isSubmitting ? 'Submitting...' : submitSuccess ? 'Submitted!' : 'Submit Admission Form'}
        </button>
      </div>
    </div>
  );
}

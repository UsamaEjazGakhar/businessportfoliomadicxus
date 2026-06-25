import React from "react";

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
    rxContent?: string;
    adviceContent?: string;
    signature?: string;
  };
}

export default function PrescriptionView({ data }: PrescriptionViewProps) {
  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#fff",
        padding: "16mm 20mm",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        color: "#000",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "4px",
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "13px",
                fontWeight: "bold",
                padding: "2px",
              }}>
                {data.doctorName || ""}
              </div>
              <br />
              <div style={{
                fontSize: "11px",
                padding: "2px",
              }}>
                {data.doctorQualifications || ""}
              </div>
              <br />
              PMDC Reg. No.: <span style={{
                fontSize: "11px",
                padding: "2px",
              }}>
                {data.pmdcRegNumber || ""}
              </span>
              <br />
              <div style={{
                fontSize: "11px",
                padding: "2px",
              }}>
                {data.uidAmb || ""}
              </div>
              <br />
              Timings: <span style={{
                fontSize: "11px",
                padding: "2px",
              }}>
                {data.timings || ""}
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #000", marginBottom: "8px" }}></div>

        <div style={{ marginBottom: "8px" }}>
          Date: <span style={{
            padding: "2px",
          }}>
            {data.date || ""}
          </span>
        </div>

        <div style={{ marginBottom: "8px" }}>
          <div style={{ marginBottom: "4px" }}>
            Patient Name: <span style={{
              padding: "2px",
            }}>
              {data.patientName || ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              Age: <span style={{
                padding: "2px",
              }}>
                {data.patientAge || ""}
              </span>
            </div>
            <div>
              Gender: <span style={{
                padding: "2px",
              }}>
                {data.patientGender || ""}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "8px", minHeight: "150px" }}>
          <strong>R<sub>x</sub></strong>
          <div style={{
            width: "100%",
            minHeight: "120px",
            border: "1px solid #000",
            padding: "8px",
            marginTop: "4px",
            fontSize: "11px",
            fontFamily: "inherit",
            whiteSpace: "pre-wrap",
          }}>
            {data.rxContent || ""}
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <strong>Advice:</strong>
          <div style={{
            width: "100%",
            minHeight: "80px",
            border: "1px solid #000",
            padding: "8px",
            marginTop: "4px",
            fontSize: "11px",
            fontFamily: "inherit",
            whiteSpace: "pre-wrap",
          }}>
            {data.adviceContent || ""}
          </div>
        </div>

        <div style={{ marginTop: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "10px", color: "#555" }}>Signature</span>
            <div style={{ marginTop: "4px", width: "120px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {data.signature && (
                <img
                  src={data.signature}
                  alt="Signature"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "10px", color: "#555" }}>Doctor</span>
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>{data.doctorName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

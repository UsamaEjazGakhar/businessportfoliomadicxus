'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/app/admin/layout';
import PrescriptionView from '@/components/PrescriptionView';

interface Consultant {
  id: string;
  name: string;
  email: string;
  location?: string | null;
}

interface PrescriptionSubmission {
  id: string;
  doctorName: string;
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
  createdAt: string;
  isDeleted: boolean;
}

export default function ConsultantPrescriptionsPage() {
  const { consultantId } = useParams();
  const router = useRouter();
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [prescriptions, setPrescriptions] = useState<PrescriptionSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionSubmission | null>(null);
  const [viewDeleted, setViewDeleted] = useState(false);
  const { showToast, confirmDelete } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/consultant-prescriptions?consultantId=${consultantId}&deleted=${viewDeleted}`);
        const data = await res.json();
        if (data.success) {
          if (data.data.length > 0 && data.data[0].consultant) {
            setConsultant(data.data[0].consultant);
          }
          setPrescriptions(data.data);
          if (data.data.length > 0) {
            setSelectedPrescription(data.data[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (consultantId) {
      fetchData();
    }
  }, [consultantId, viewDeleted]);

  const handleDelete = async (id: string, isDeleted: boolean) => {
    confirmDelete(`Are you sure you want to ${isDeleted ? "restore" : "delete"} this prescription?`, async () => {
      try {
        const res = await fetch(`/api/prescription-submissions/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ restore: isDeleted }),
        });
        if (res.ok) {
          showToast(`Prescription ${isDeleted ? "restored" : "deleted"} successfully!`, "success");
          // Refetch data
          const refetchRes = await fetch(`/api/consultant-prescriptions?consultantId=${consultantId}&deleted=${viewDeleted}`);
          const refetchData = await refetchRes.json();
          if (refetchData.success) {
            setPrescriptions(refetchData.data);
            if (refetchData.data.length > 0) {
              setSelectedPrescription(refetchData.data[0]);
            } else {
              setSelectedPrescription(null);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div style={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => router.push('/admin/consultants')}
            style={{
              padding: "8px 16px",
              background: "#E2E8F0",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            ← Back to Consultants
          </button>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", letterSpacing: "-1px", marginBottom: "4px" }}>
              {consultant?.name}'s Prescriptions
            </h1>
            <p style={{ fontSize: "14px", color: "#94A3B8" }}>
              {prescriptions.length} prescriptions total
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setViewDeleted(false)}
            style={{
              padding: "10px 16px",
              background: !viewDeleted ? "linear-gradient(135deg,#0F4C81,#14B8A6)" : "#fff",
              color: !viewDeleted ? "#fff" : "#0F172A",
              border: !viewDeleted ? "none" : "1px solid #E2E8F0",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Active
          </button>
          <button
            onClick={() => setViewDeleted(true)}
            style={{
              padding: "10px 16px",
              background: viewDeleted ? "linear-gradient(135deg,#0F4C81,#14B8A6)" : "#fff",
              color: viewDeleted ? "#fff" : "#0F172A",
              border: viewDeleted ? "none" : "1px solid #E2E8F0",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Deleted
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px", minHeight: 0 }}>
        {/* Master Sidebar (List) */}
        <div style={{
          background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
          overflowY: "auto", display: "flex", flexDirection: "column"
        }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9", fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>
            Prescriptions ({prescriptions.length})
          </div>
          <div style={{ flex: 1 }}>
            {prescriptions.map((prescription) => {
              const isActive = selectedPrescription?.id === prescription.id;
              return (
                <div
                  key={prescription.id}
                  onClick={() => setSelectedPrescription(prescription)}
                  style={{
                    padding: "16px", borderBottom: "1px solid #F1F5F9", cursor: "pointer",
                    background: isActive ? "rgba(15,76,129,.05)" : "transparent",
                    borderLeft: isActive ? "4px solid #0F4C81" : "4px solid transparent",
                    transition: "all .15s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>
                      {prescription.patientName || "Unnamed Patient"}
                    </span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", marginBottom: "4px" }}>
                    {prescription.date || "No Date"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
            {prescriptions.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
                No {viewDeleted ? "deleted" : ""} prescriptions yet
              </div>
            )}
          </div>
        </div>

        {/* Details Frame */}
        {selectedPrescription ? (
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
            padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            overflowY: "auto"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>
                    Prescription
                  </h2>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>
                    For: <strong style={{ color: "#0F172A" }}>{selectedPrescription.patientName || "Unnamed Patient"}</strong>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                    Created: {new Date(selectedPrescription.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(selectedPrescription.id, viewDeleted)}
                    style={{
                      background: viewDeleted ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                      color: viewDeleted ? "#22c55e" : "#EF4444",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    {viewDeleted ? "Restore" : "Delete"}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <PrescriptionView data={selectedPrescription} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8"
          }}>
            Select a prescription to view details
          </div>
        )}
      </div>
    </div>
  );
}

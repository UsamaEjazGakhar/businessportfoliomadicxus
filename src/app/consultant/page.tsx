"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Role } from "@prisma/client";
import MedicalPrescription from "@/app/admissionsection/MedicalPrescription";
import PrescriptionView from "@/components/PrescriptionView";

interface User {
  id: string;
  name: string;
  email: string;
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
  createdAt: string;
  isDeleted: boolean;
  submittedToAdmin: boolean;
  submittedAt?: string;
  consultant?: User;
}

export default function ConsultantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"dashboard" | "prescription" | "prescriptions" | "view-prescription">("dashboard");

  const updateView = (newView: "dashboard" | "prescription" | "prescriptions" | "view-prescription") => {
    setView(newView);
    const params = new URLSearchParams(searchParams);
    if (newView === "dashboard") {
      params.delete("view");
    } else {
      params.set("view", newView);
    }
    router.replace(`/consultant?${params.toString()}`);
  };
  const [prescriptions, setPrescriptions] = useState<PrescriptionSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionSubmission | null>(null);
  const [viewDeleted, setViewDeleted] = useState(false);

  useEffect(() => {
      const viewParam = searchParams.get("view");
      // Sync URL param with view state more directly to avoid double routing
      if (viewParam && viewParam !== view) {
        setView(viewParam as "dashboard" | "prescription" | "prescriptions" | "view-prescription");
      } else if (!viewParam && view !== "dashboard") {
        setView("dashboard");
      }
    }, [searchParams]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session.user as any).role !== Role.CONSULTANT) {
      router.push("/admin");
    }
  }, [status, session, router]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/consultant-prescriptions?deleted=${viewDeleted}`);
      const data = await res.json();
      if (data.success) {
        setPrescriptions(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [viewDeleted]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalPrescriptionId, setModalPrescriptionId] = useState<string | null>(null);
  const [modalIsRestore, setModalIsRestore] = useState(false);
  const [modalIsPermanent, setModalIsPermanent] = useState(false);

  const openDeleteModal = (id: string, isDeleted: boolean) => {
    setModalPrescriptionId(id);
    setModalIsRestore(isDeleted);
    setModalIsPermanent(false);
    setShowDeleteModal(true);
  };

  const openPermanentDeleteModal = (id: string) => {
    setModalPrescriptionId(id);
    setModalIsRestore(false);
    setModalIsPermanent(true);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setModalPrescriptionId(null);
  };

  const confirmDelete = () => {
    console.log("confirmDelete called! modalPrescriptionId:", modalPrescriptionId);
    console.log("modalIsRestore:", modalIsRestore);
    if (modalPrescriptionId) {
      fetch(`/api/prescription-submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: modalPrescriptionId, restore: modalIsRestore }),
      }).then(res => {
        console.log("API response status:", res.status);
        if (res.ok) {
          fetchPrescriptions();
        }
      }).catch(err => {
        console.error("Error calling delete/restore API:", err);
      });
    }
    closeDeleteModal();
  };

  // Permanent delete handler for deleted prescriptions
  const confirmPermanentDelete = () => {
    console.log("confirmPermanentDelete called! modalPrescriptionId:", modalPrescriptionId);
    if (modalPrescriptionId) {
      fetch(`/api/prescription-submissions`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: modalPrescriptionId, permanent: true }),
      })
        .then(res => {
          console.log("Permanent delete response status:", res.status);
          if (res.ok) {
            fetchPrescriptions();
          }
        })
        .catch(err => {
          console.error("Error calling permanent delete API:", err);
        });
    }
    closeDeleteModal();
  };

  const handleDeletePrescription = (id: string, isDeleted: boolean) => {
    console.log("handleDeletePrescription called with id:", id, "isDeleted:", isDeleted);
    openDeleteModal(id, isDeleted);
  };

  // Permanent delete for already deleted prescriptions
  const handlePermanentDelete = (id: string) => {
    fetch(`/api/prescription-submissions`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, permanent: true }),
    })
      .then(res => {
        if (res.ok) {
          fetchPrescriptions();
        }
      })
      .catch(err => {
        console.error("Error calling permanent delete API:", err);
      });
  };

  const handleSubmitToAdmin = async (id: string) => {
    try {
      const res = await fetch(`/api/prescription-submissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, action: "submitToAdmin" }),
      });
      if (res.ok) {
        fetchPrescriptions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPrescription = (prescription: PrescriptionSubmission) => {
    openViewModal(prescription);
  };

  const [showViewModal, setShowViewModal] = useState(false);

  const openViewModal = (prescription: PrescriptionSubmission) => {
    setSelectedPrescription(prescription);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedPrescription(null);
  };

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ fontSize: "16px", color: "#64748b" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "0" }}>
      {view === "dashboard" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>
                Consultant Dashboard
              </h1>
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                Manage your prescriptions and patient records
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => updateView("prescriptions")}
                style={{
                  padding: "10px 20px",
                  background: "#fff",
                  color: "#0f4c81",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                View Prescriptions
              </button>
              <button
                  type="button"
                  onClick={() => {
                    console.log('New Prescription clicked');
                    // Directly replace URL param to avoid state sync issues
                    const params = new URLSearchParams(window.location.search);
                    params.set('view', 'prescription');
                    router.replace(`/consultant?${params.toString()}`);
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg,#0f4c81,#14b8a6)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  + New Prescription
                </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#0f4c81", marginBottom: "4px" }}>
                {prescriptions.filter(p => !p.isDeleted).length}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Total Prescriptions</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#14b8a6", marginBottom: "4px" }}>
                {prescriptions.filter(p => !p.isDeleted && new Date(p.createdAt).toDateString() === new Date().toDateString()).length}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Today's Prescriptions</div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#f59e0b", marginBottom: "4px" }}>
                {prescriptions.filter(p => p.isDeleted).length}
              </div>
              <div style={{ fontSize: "14px", color: "#64748b" }}>Deleted Prescriptions</div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "20px" }}>Recent Prescriptions</h2>
            {prescriptions.filter(p => !p.isDeleted).slice(0, 5).length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>No prescriptions yet</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Patient</th>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Date</th>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Created At</th>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.filter(p => !p.isDeleted).slice(0, 5).map(prescription => (
                      <tr key={prescription.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px 0", fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>{prescription.patientName || "N/A"}</td>
                        <td style={{ padding: "12px 0", fontSize: "13px", color: "#475569" }}>{prescription.date || "N/A"}</td>
                        <td style={{ padding: "12px 0", fontSize: "13px", color: "#475569" }}>{new Date(prescription.createdAt).toLocaleString()}</td>
                        <td style={{ padding: "12px 0" }}>
                          <button
                            onClick={() => openViewModal(prescription)}
                            style={{
                              padding: "6px 12px",
                              background: "rgba(15,76,129,0.1)",
                              color: "#0f4c81",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                              marginRight: "8px",
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeletePrescription(prescription.id, false)}
                            style={{
                              padding: "6px 12px",
                              background: "rgba(239,68,68,0.1)",
                              color: "#ef4444",
                              border: "none",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
{view === "prescription" && (
  <div style={{ padding: "32px" }}>
    <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", marginBottom: "16px" }}>
      New Prescription
    </h2>
    {/* Render the prescription form with placeholder data */}
    <PrescriptionView data={{
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
      signature: "",
    }} />
  </div>
)}

      {view === "prescriptions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={() => updateView("dashboard")}
                style={{
                  padding: "8px 16px",
                  background: "#e2e8f0",
                  color: "#0f172a",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <div>
                <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", marginBottom: "8px" }}>
                  My Prescriptions
                </h1>
                <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                  {prescriptions.length} prescriptions total
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setViewDeleted(false)}
                style={{
                  padding: "10px 20px",
                  background: !viewDeleted ? "linear-gradient(135deg,#0f4c81,#14b8a6)" : "#fff",
                  color: !viewDeleted ? "#fff" : "#0f172a",
                  border: !viewDeleted ? "none" : "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Active
              </button>
              <button
                onClick={() => setViewDeleted(true)}
                style={{
                  padding: "10px 20px",
                  background: viewDeleted ? "linear-gradient(135deg,#0f4c81,#14b8a6)" : "#fff",
                  color: viewDeleted ? "#fff" : "#0f172a",
                  border: viewDeleted ? "none" : "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Deleted
              </button>
              <button
                onClick={() => updateView("prescription")}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg,#14b8a6,#0f4c81)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                + New Prescription
              </button>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px" }}>
            {loading ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>Loading...</p>
            ) : prescriptions.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px 0" }}>
                No {viewDeleted ? "deleted" : ""} prescriptions yet
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Patient</th>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Date</th>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Created At</th>
                      <th style={{ textAlign: "left", padding: "12px 0", fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map(prescription => (
              <tr key={prescription.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 0", fontSize: "14px", fontWeight: 500, color: "#0f172a" }}>
                  {prescription.patientName || "N/A"}
                  {prescription.submittedToAdmin && (
                    <span style={{ marginLeft: "8px", fontSize: "11px", color: "#22c55e", fontWeight: "600" }}>
                      (Submitted)
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 0", fontSize: "13px", color: "#475569" }}>{prescription.date || "N/A"}</td>
                <td style={{ padding: "12px 0", fontSize: "13px", color: "#475569" }}>{new Date(prescription.createdAt).toLocaleString()}</td>
                <td style={{ padding: "12px 0" }}>
                  <button
                    onClick={() => openViewModal(prescription)}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(15,76,129,0.1)",
                      color: "#0f4c81",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadPrescription(prescription)}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(101,163,13,0.1)",
                      color: "#65a30d",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Download
                  </button>
                  {!viewDeleted && !prescription.submittedToAdmin && (
                    <button
                      onClick={() => handleSubmitToAdmin(prescription.id)}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(59,130,246,0.1)",
                        color: "#3b82f6",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginRight: "8px",
                      }}
                    >
                      Submit to Admin
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePrescription(prescription.id, prescription.isDeleted)}
                    style={{
                      padding: "6px 12px",
                      background: viewDeleted ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: viewDeleted ? "#22c55e" : "#ef4444",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {viewDeleted ? "Restore" : "Delete"}
                  </button>
                  {viewDeleted && (
                    <button
                      onClick={() => openPermanentDeleteModal(prescription.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#991b1b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginLeft: "4px",
                      }}
                    >
                      Permanently Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
                  </tbody>
{/* Modal moved outside table */}
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prescription View Modal */}
      {showViewModal && selectedPrescription && (
        <div className="prescription-modal-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div className="prescription-modal" style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            maxWidth: "800px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}>
            <div className="prescription-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a" }}>Prescription Details</h2>
              <button onClick={() => setShowViewModal(false)} style={{
                background: "#e2e8f0",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
              }}>✕</button>
            </div>
            <PrescriptionView data={selectedPrescription} readOnly={true} />
          </div>
        </div>
      )}
      

{/* Delete Confirmation Modal */}
{showDeleteModal && (
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
      padding: '20px 30px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      maxWidth: '400px',
    }}>
      <h3 style={{ margin: 0, marginBottom: '12px', color: '#0f172a' }}>
        {modalIsRestore ? 'Restore Prescription?' : modalIsPermanent ? 'Permanently Delete Prescription?' : 'Delete Prescription?'}
      </h3>
      <p style={{ margin: 0, marginBottom: '16px', color: '#475569' }}>
        {modalIsRestore ? 'Are you sure you want to restore this prescription?' : modalIsPermanent ? 'Are you sure you want to permanently delete this prescription? This action cannot be undone.' : 'Are you sure you want to delete this prescription?'}
      </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={closeDeleteModal} style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
          {modalIsRestore && (
            <button onClick={confirmDelete} style={{ padding: '6px 12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Restore</button>
          )}
          {!modalIsRestore && !modalIsPermanent && (
            <button onClick={confirmDelete} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
          )}
          {modalIsPermanent && (
            <button onClick={confirmPermanentDelete} style={{ padding: '6px 12px', background: '#991b1b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Permanently Delete</button>
          )}
        </div>
    </div>
  </div>
)}

    </div>
  );
}

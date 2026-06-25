'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/admin/layout';
import { ApprovalStatus } from '@prisma/client';

interface Consultant {
  id: string;
  name: string;
  email: string;
  location?: string | null;
  approvalStatus: ApprovalStatus;
  isDeleted: boolean;
  _count?: { prescriptionSubmissions?: number };
}

export default function AdminConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [view, setView] = useState<'active' | 'deleted'>('active');
  const router = useRouter();
  const { showToast, confirmDelete } = useToast();

  const fetchConsultants = async () => {
    try {
      const res = await fetch(`/api/consultants?deleted=${view === 'deleted'}`);
      const data = await res.json();
      if (data.success) {
        setConsultants(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, [view]);

  const handleUpdateStatus = async (id: string, status: ApprovalStatus) => {
    try {
      const res = await fetch('/api/consultants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approvalStatus: status }),
      });
      if (res.ok) {
        showToast(`Consultant ${status === ApprovalStatus.APPROVED ? 'approved' : status === ApprovalStatus.RESTRICTED ? 'restricted' : 'pending'} successfully!`, 'success');
        fetchConsultants();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (consultant: Consultant, permanent = false) => {
    const message = permanent 
      ? `Are you sure you want to PERMANENTLY delete this consultant and ALL their data? This cannot be undone!`
      : `Are you sure you want to ${consultant.isDeleted ? 'restore' : 'delete'} this consultant?`;
      
    confirmDelete(
      message,
      async () => {
        try {
          const res = await fetch('/api/consultants', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: consultant.id, 
              restore: consultant.isDeleted,
              permanent 
            }),
          });
          if (res.ok) {
            showToast(`Consultant ${permanent ? 'permanently deleted' : consultant.isDeleted ? 'restored' : 'deleted'} successfully!`, 'success');
            fetchConsultants();
          }
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case ApprovalStatus.APPROVED: return '#22c55e';
      case ApprovalStatus.PENDING: return '#F59E0B';
      case ApprovalStatus.RESTRICTED: return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{
            fontSize: '28px', fontWeight: 800, color: '#0F172A',
            letterSpacing: '-1px', marginBottom: '8px',
          }}>Consultants Records</h1>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>
            Manage consultants, approve new users, and track prescriptions
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setView('active')}
            style={{
              padding: '10px 20px',
              background: view === 'active' ? 'linear-gradient(135deg,#0F4C81,#14B8A6)' : '#fff',
              color: view === 'active' ? '#fff' : '#0F172A',
              border: view === 'active' ? 'none' : '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Active Consultants
          </button>
          <button
            onClick={() => setView('deleted')}
            style={{
              padding: '10px 20px',
              background: view === 'deleted' ? 'linear-gradient(135deg,#0F4C81,#14B8A6)' : '#fff',
              color: view === 'deleted' ? '#fff' : '#0F172A',
              border: view === 'deleted' ? 'none' : '1px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Deleted Consultants
          </button>
        </div>
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '24px',
      }}>
        {consultants.length === 0 ? (
          <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px 0' }}>
            {view === 'active' ? 'No active consultants yet' : 'No deleted consultants yet'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Prescriptions</th>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultants.map((consultant) => (
                  <tr key={consultant.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{consultant.name}</td>
                    <td style={{ padding: '12px 0', fontSize: '13px', color: '#475569' }}>{consultant.email}</td>
                    <td style={{ padding: '12px 0', fontSize: '13px', color: '#475569' }}>{consultant.location || 'N/A'}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 600,
                        padding: '4px 12px', borderRadius: '100px',
                        background: `${getStatusColor(consultant.approvalStatus)}20`,
                        color: getStatusColor(consultant.approvalStatus),
                        textTransform: 'capitalize',
                      }}>
                        {consultant.approvalStatus}
                      </span>
                    </td>
                    <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: 600, color: '#0F4C81' }}>{consultant._count?.prescriptionSubmissions || 0}</td>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => router.push(`/admin/consultants/${consultant.id}`)}
                          style={{
                            padding: '6px 12px',
                            background: 'rgba(15,76,129,0.1)',
                            color: '#0F4C81',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          View Prescriptions
                        </button>

                        {view === 'active' && (
                          <>
                            {consultant.approvalStatus !== ApprovalStatus.APPROVED && (
                              <button
                                onClick={() => handleUpdateStatus(consultant.id, ApprovalStatus.APPROVED)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(34,197,94,0.1)',
                                  color: '#22c55e',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Approve
                              </button>
                            )}
                            {consultant.approvalStatus !== ApprovalStatus.RESTRICTED && (
                              <button
                                onClick={() => handleUpdateStatus(consultant.id, ApprovalStatus.RESTRICTED)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(245,158,11,0.1)',
                                  color: '#F59E0B',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Restrict
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(consultant)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(239,68,68,0.1)',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </>
                        )}

                        {view === 'deleted' && (
                          <>
                            <button
                              onClick={() => handleDelete(consultant)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(34,197,94,0.1)',
                                color: '#22c55e',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => handleDelete(consultant, true)}
                              style={{
                                padding: '6px 12px',
                                background: 'rgba(185,28,28,0.1)',
                                color: '#b91c1c',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              Permanently Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

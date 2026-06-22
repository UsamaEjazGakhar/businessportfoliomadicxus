"use client";

import { useState } from "react";
import Hero from "@/components/main/hero";
import Stats from "@/components/main/stats";
import Divisions from "@/components/main/divisions";
import AboutBand from "@/components/main/about-band";
import Navbar from "@/components/main/navbar";
import Team from "@/components/main/team";
import ITServices from "@/components/main/it-services";
import TrustSection from "@/components/main/trust-section";
import CtaSection from "@/components/main/cta-section";
import Footer from "@/components/main/footer";

import AdmissionForm from "./admissionsection/AdmissionForm";
import DrKazimRazaPrescription from "./admissionsection/DrKazimRazaPrescription";
import NursingFeeStructure from "./admissionsection/NursingFeeStructure";
import ParamedicalFeeStructureLab from "./admissionsection/ParamedicalFeeStructureLab";
import ParamedicalFeeStructureMLT from "./admissionsection/ParamedicalFeeStructureMLT";

type ViewState = 'main' | 'forms-list' | 'admission' | 'prescription' | 'nursing-fee' | 'paramedical-lab-fee' | 'paramedical-mlt-fee';

export default function HomePage() {
  const [view, setView] = useState<ViewState>('main');

  const forms = [
    { id: 'admission' as const, label: 'Admission Form', component: AdmissionForm },
    { id: 'prescription' as const, label: 'Dr Kazim Raza Prescription', component: DrKazimRazaPrescription },
    { id: 'nursing-fee' as const, label: 'Nursing Fee Structure', component: NursingFeeStructure },
    { id: 'paramedical-lab-fee' as const, label: 'Paramedical Lab Fee Structure', component: ParamedicalFeeStructureLab },
    { id: 'paramedical-mlt-fee' as const, label: 'Paramedical MLT Fee Structure', component: ParamedicalFeeStructureMLT },
  ];

  const activeForm = forms.find(f => f.id === view);

  return (
    <>
      <Navbar />
      
      {view === 'main' ? (
        <>
          <Hero />
          <Stats />
          <Divisions />
          <AboutBand />
          <Team />
          <ITServices />
          <TrustSection />
          <CtaSection />
          <div style={{ padding: '40px 20px', backgroundColor: '#f3f4f6', textAlign: 'center' }}>
            <button
              onClick={() => setView('forms-list')}
              style={{
                padding: '16px 40px',
                backgroundColor: '#0F4C81',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(15,76,129,0.3)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(15,76,129,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(15,76,129,0.3)';
              }}
            >
              Click to Check Admissions
            </button>
          </div>
          <Footer />
        </>
      ) : view === 'forms-list' ? (
        <div style={{ padding: '20px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setView('main')}
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
                ← Go Back to Home
              </button>
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '32px', color: '#1f2937' }}>Admission & Forms</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {forms.map(form => (
                <button
                  key={form.id}
                  onClick={() => setView(form.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    backgroundColor: '#fff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#0F4C81';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  {form.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : activeForm ? (
        <activeForm.component onGoBack={() => setView('forms-list')} />
      ) : null}
    </>
  );
}

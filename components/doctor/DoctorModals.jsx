import React from "react";

export const AddAvailabilityModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'white', borderRadius: '16px', width: '450px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0', paddingBottom: '15px', borderBottom: '1px solid #bae6fd' }}>Add Availability</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>New Date</label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="DD / MM / YY" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #7dd3fc', fontSize: '14px', outline: 'none', color: '#334155' }} />
            <svg style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Start Time</label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="--:-- --" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #7dd3fc', fontSize: '14px', outline: 'none', color: '#334155' }} />
            <svg style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>End Time</label>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="--:-- --" style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #7dd3fc', fontSize: '14px', outline: 'none', color: '#334155' }} />
            <svg style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button style={{ flex: 1, padding: '12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Save Changes</button>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export const PatientDetailsModal = ({ onClose, patient }) => {
  if (!patient) return null;
  
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: 'white', borderRadius: '16px', width: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', position: 'relative' }}>
        
        <div style={{ padding: '25px 30px', borderBottom: '1px solid #bae6fd', flexShrink: 0, position: 'relative' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Patient Details</h2>
          <button onClick={onClose} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div style={{ padding: '30px', overflowY: 'auto' }}>
          <div style={{ border: '1px solid #7dd3fc', borderRadius: '16px', padding: '20px', marginBottom: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Name</div>
              <div style={{ fontSize: '13px', color: '#334155' }}>{patient.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Age</div>
              <div style={{ fontSize: '13px', color: '#334155' }}>{patient.age}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Gender</div>
              <div style={{ fontSize: '13px', color: '#334155' }}>{patient.gender}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Phone</div>
              <div style={{ fontSize: '13px', color: '#334155' }}>{patient.phone}</div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '13px', color: '#334155' }}>{patient.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Blood Group</div>
              <div style={{ fontSize: '13px', color: '#334155' }}>{patient.bloodGroup}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Feedback History (2)</h3>
            <button style={{ padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Feedback
            </button>
          </div>

          <div style={{ border: '1px solid #7dd3fc', borderRadius: '16px', padding: '20px', marginBottom: '15px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '20px', background: 'white', padding: '0 10px', fontSize: '12px', color: '#0ea5e9', fontWeight: '500' }}>2026-04-25</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Diagnosis:</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', background: '#bae6fd', padding: '4px 12px', borderRadius: '12px', color: '#0369a1' }}>Visit #2</span>
            </div>
            <div style={{ fontSize: '13px', color: '#334155', marginBottom: '15px' }}>Hypertension</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '5px' }}>Remarks</div>
            <div style={{ fontSize: '13px', color: '#334155', marginBottom: '15px', lineHeight: '1.5' }}>Patient complained of occasional chest discomfort. ECG performed, results normal.</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '5px' }}>Prescription:</div>
            <div style={{ fontSize: '13px', color: '#334155' }}>Amlodipine 5mg - Once daily, Aspirin 75mg - Once daily</div>
          </div>

          <div style={{ border: '1px solid #7dd3fc', borderRadius: '16px', padding: '20px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-10px', left: '20px', background: 'white', padding: '0 10px', fontSize: '12px', color: '#0ea5e9', fontWeight: '500' }}>2026-03-25</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Diagnosis:</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b', background: '#bae6fd', padding: '4px 12px', borderRadius: '12px', color: '#0369a1' }}>Visit #1</span>
            </div>
            <div style={{ fontSize: '13px', color: '#334155', marginBottom: '15px' }}>Hypertension</div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', marginBottom: '5px' }}>Remarks</div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>Initial diagnosis.</div>
          </div>

        </div>
      </div>
    </div>
  );
};

import { DobVerificationResult, MemberApplication, LeaderApplication } from '../types';
import { 
  verifyDobAlgorithm, 
  checkFieldAvailability, 
  submitMemberApplication, 
  submitLeaderApplication 
} from './onboardingService';

// Verify DOB
export async function apiVerifyDob(year: number, month: number, day: number): Promise<DobVerificationResult> {
  try {
    const res = await fetch('/api/signup/verify-dob', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, month, day }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API unavailable, using localized verification engine:', err);
  }
  // Localized calculation fallback
  return verifyDobAlgorithm(year, month, day);
}

// Check Availability
export async function apiCheckAvailability(field: string, value: string): Promise<{ available: boolean; message?: string }> {
  try {
    const res = await fetch('/api/signup/check-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }
  return checkFieldAvailability(field, value);
}

// Submit Member Application
export async function apiSubmitMemberApplication(data: any): Promise<{ success: boolean; applicationId: string; status: string; message: string }> {
  try {
    const res = await fetch('/api/signup/member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      // Also sync to local storage for persistence across reloads
      submitMemberApplication(data);
      return json;
    }
  } catch (err) {
    console.warn('API POST fallback:', err);
  }

  const saved = submitMemberApplication(data);
  return {
    success: true,
    applicationId: saved.applicationId,
    status: 'Pending Verification',
    message: 'Thank you for registering! Please wait for a call from the Arabiyya Rover Council regarding your membership.',
  };
}

// Submit Leader Application
export async function apiSubmitLeaderApplication(data: any): Promise<{ success: boolean; applicationId: string; status: string; message: string }> {
  try {
    const res = await fetch('/api/signup/leader', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      submitLeaderApplication(data);
      return json;
    }
  } catch (err) {
    console.warn('API leader fallback:', err);
  }

  const saved = submitLeaderApplication(data);
  return {
    success: true,
    applicationId: saved.applicationId,
    status: 'Pending Verification',
    message: 'Thank you for submitting your Leader Candidate profile. The Group Scout Leader and Arabiyya Council will contact you for an executive discussion.',
  };
}

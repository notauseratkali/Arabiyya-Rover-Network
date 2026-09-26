import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth, isFirebaseConfigured } from '../firebase';
import { RoverMember, RoverCrew, ActivityLog } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
    }
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Check Firestore connection
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      message: 'Firebase configuration is incomplete. Please provide API Key and Project ID.'
    };
  }

  try {
    const testRef = doc(db, 'system', 'connection_test');
    await getDoc(testRef);
    return { success: true, message: 'Connected to Firestore successfully.' };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.GET, 'system/connection_test');
    return {
      success: false,
      message: error?.message || 'Unable to connect to Firestore.'
    };
  }
}

// Sync Member Document
export async function saveMemberToFirestore(member: RoverMember): Promise<void> {
  if (!db) return;
  const path = `members/${member.id}`;
  try {
    const docRef = doc(db, 'members', member.id);
    await setDoc(docRef, member, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Fetch all members from Firestore
export async function fetchMembersFromFirestore(): Promise<RoverMember[]> {
  if (!db) return [];
  const path = 'members';
  try {
    const snap = await getDocs(collection(db, path));
    const list: RoverMember[] = [];
    snap.forEach(d => {
      list.push(d.data() as RoverMember);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Sync Crews to Firestore
export async function saveCrewToFirestore(crew: RoverCrew): Promise<void> {
  if (!db) return;
  const path = `crews/${crew.id}`;
  try {
    const docRef = doc(db, 'crews', crew.id);
    await setDoc(docRef, crew, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Fetch all crews from Firestore
export async function fetchCrewsFromFirestore(): Promise<RoverCrew[]> {
  if (!db) return [];
  const path = 'crews';
  try {
    const snap = await getDocs(collection(db, path));
    const list: RoverCrew[] = [];
    snap.forEach(d => {
      list.push(d.data() as RoverCrew);
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

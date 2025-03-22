import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { FormState } from '../context/FormContext';

export const initializeUser = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // First check if we already have a user
    if (auth.currentUser) {
      console.log('User already authenticated:', auth.currentUser.uid);
      resolve();
      return;
    }

    // If no user, try to sign in anonymously
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User authenticated:', user.uid);
        unsubscribe();
        resolve();
      }
    });

    signInAnonymously(auth).catch((error) => {
      console.error("Auth error:", error);
      unsubscribe();
      reject(error);
    });
  });
};

export const saveFormData = async (formData: FormState): Promise<void> => {
  if (!auth.currentUser) {
    console.log('No user found, attempting to initialize...');
    await initializeUser();
  }

  if (!auth.currentUser) {
    console.error('Still no user after initialization');
    return;
  }

  try {
    console.log('Saving form data for user:', auth.currentUser.uid);
    const docRef = doc(db, 'forms', auth.currentUser.uid);
    await setDoc(docRef, formData);
    console.log('Form data saved successfully');
  } catch (error) {
    console.error("Error saving form data:", error);
    throw error;
  }
};

export const loadFormData = async (): Promise<FormState | null> => {
  if (!auth.currentUser) {
    console.log('No user found when loading, attempting to initialize...');
    await initializeUser();
  }

  if (!auth.currentUser) {
    console.error('Still no user after initialization when loading');
    return null;
  }

  try {
    console.log('Loading form data for user:', auth.currentUser.uid);
    const docRef = doc(db, 'forms', auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Found saved form data');
      return docSnap.data() as FormState;
    } else {
      console.log('No saved form data found');
      return null;
    }
  } catch (error) {
    console.error("Error loading form data:", error);
    throw error;
  }
}; 
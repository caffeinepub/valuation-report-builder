import { useCallback, useState } from "react";

const STORAGE_KEY = "valuation_signature_settings";

interface SignatureSettings {
  signatureImage: string | null;
  stampImage: string | null;
}

function loadSettings(): SignatureSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { signatureImage: null, stampImage: null };
}

function saveSettings(settings: SignatureSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSignatureSettings() {
  const [settings, setSettings] = useState<SignatureSettings>(loadSettings);

  const setSignatureImage = useCallback((image: string) => {
    setSettings((prev) => {
      const next = { ...prev, signatureImage: image };
      saveSettings(next);
      return next;
    });
  }, []);

  const setStampImage = useCallback((image: string) => {
    setSettings((prev) => {
      const next = { ...prev, stampImage: image };
      saveSettings(next);
      return next;
    });
  }, []);

  const clearSignatureImage = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, signatureImage: null };
      saveSettings(next);
      return next;
    });
  }, []);

  const clearStampImage = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, stampImage: null };
      saveSettings(next);
      return next;
    });
  }, []);

  return {
    signatureImage: settings.signatureImage,
    stampImage: settings.stampImage,
    setSignatureImage,
    setStampImage,
    clearSignatureImage,
    clearStampImage,
  };
}

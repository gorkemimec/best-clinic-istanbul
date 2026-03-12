import { useEffect, useState } from 'react';

// IP-based geo lookup to detect if the visitor is from Turkey (TR)
// Uses ipapi.co (CORS supported, 1000 req/day free)
export function useIsTurkeyVisitor() {
  const [isTurkeyVisitor, setIsTurkeyVisitor] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkCountry() {
      try {
        // Primary: ipapi.co (CORS destekli)
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('ipapi failed');
        const data = await response.json();
        if (!cancelled && data && typeof data.country_code === 'string') {
          setIsTurkeyVisitor(data.country_code.toUpperCase() === 'TR');
        }
      } catch {
        try {
          // Fallback: ip-api.com (sadece HTTP, CORS destekli)
          const res = await fetch('http://ip-api.com/json/?fields=countryCode');
          if (!res.ok) return;
          const data = await res.json();
          if (!cancelled && data && data.countryCode) {
            setIsTurkeyVisitor(data.countryCode.toUpperCase() === 'TR');
          }
        } catch {
          // Hata durumunda: TR olmayan olarak kabul et
        }
      }
    }

    checkCountry();

    return () => {
      cancelled = true;
    };
  }, []);

  return isTurkeyVisitor;
}

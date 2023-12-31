import { auth } from "config/firebase-config";
import { useState, useEffect } from "react";

function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const authSubscription = auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
      setAuthLoading(false);
    });

    return () => {
      authSubscription();
    };
  }, []);

  return [user, authLoading];
}

export default useAuth;

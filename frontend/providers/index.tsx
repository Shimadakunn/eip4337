'use client';

import { saveUser } from '@/lib/factory';
import { getUser } from '@/lib/factory/getUser';
import { WebAuthn } from '@/lib/web-authn/service/web-authn';
import { fetch } from '@/utils';
import { MoonPayProvider } from '@moonpay/moonpay-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Address, Hex, zeroAddress } from 'viem';

export type Me = {
  account: Address;
  keyId: Hex;
  pubKey: {
    x: Hex;
    y: Hex;
  };
};

export type Balances = {
  balance: string;
  stakedBalance: string;
};

function useMeHook() {
  const [isLoading, setIsLoading] = useState(false);
  const [me, setMe] = useState<Me | null>();
  const [isMounted, setIsMounted] = useState(false);
  const [balances, setBalances] = useState<Balances>({ balance: '0', stakedBalance: '0' });

  function disconnect() {
    localStorage.removeItem('kuma.me');
    setBalances({ balance: '0', stakedBalance: '0' });
    setMe(null);
  }

  async function create(username: string) {
    setIsLoading(true);

    try {
      const credential = await WebAuthn.create({ username });
      if (!credential) {
        return;
      }
      const user = await saveUser({
        id: credential.rawId,
        pubKey: credential.pubKey,
      });

      const me = {
        keyId: user!.id as Hex,
        pubKey: user!.pubKey,
        account: user!.account,
      };

      if (me === undefined) {
        console.log('error while saving user');
        return;
      }

      // Save user data to Firebase
      // const db = firestore;
      // await setDoc(doc(db, "users", me.account.toLowerCase()), {
      //   username,
      //   createdAt: Date.now(),
      //   pubKey: user!.pubKey,
      // });

      localStorage.setItem('kuma.me', JSON.stringify(me));
      setMe(me);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function get() {
    setIsLoading(true);
    try {
      const credential = await WebAuthn.get();
      if (!credential) {
        return;
      }
      const user = await getUser(credential.rawId);

      if (user?.account === undefined || user?.account === zeroAddress) {
        throw new Error('user not found');
      }

      const me = {
        keyId: user.id as Hex,
        pubKey: user.pubKey,
        account: user.account,
      };

      localStorage.setItem('kuma.me', JSON.stringify(me));
      setMe(me);
    } catch (e) {
      disconnect();
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const updateBalances = async (account: Address) => {
    const newBalances = await fetch(account);
    setBalances(newBalances);
  };

  useEffect(() => {
    const me = localStorage.getItem('kuma.me');
    if (me) {
      try {
        const parsedMe = JSON.parse(me);
        setMe(parsedMe);
        updateBalances(parsedMe.account);
      } catch (e) {
        console.log('error while parsing me', e);
      }
    }
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   if (me?.account) {
  //     updateBalances(me.account);
  //   }
  //   const interval = setInterval(() => {
  //     if (me?.account) {
  //       updateBalances(me.account);
  //     }
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [me?.account]);

  return {
    isLoading,
    isMounted,
    me,
    balances,
    create,
    get,
    disconnect,
    updateBalances,
  };
}

type UseMeHook = ReturnType<typeof useMeHook>;
const MeContext = createContext<UseMeHook | null>(null);

export const useMe = (): UseMeHook => {
  const context = useContext(MeContext);
  if (!context) {
    throw new Error('useMeHook must be used within a MeProvider');
  }
  return context;
};

export function MeProvider({ children }: { children: React.ReactNode }) {
  const hook = useMeHook();

  return (
    <MeContext.Provider value={hook}>
      <MoonPayProvider apiKey="pk_test_lhO0wUX5sQ5aKsEIIj7P3j7z15jwPPzL" debug>
        {children}
      </MoonPayProvider>
    </MeContext.Provider>
  );
}

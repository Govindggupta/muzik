"use client";

import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function AppBar() {
  const session = useSession();

  return (
    <div className="flex justify-between">
      <div>ProjectOne</div>
      <div className="m-2 p-2 bg-green-500">
        {session.data?.user ? (
          <div
            onClick={() => {
              signOut();
            }}
          >
            {" "}
            SignOut
          </div>
        ) : (
          <div
            onClick={() => {
              signIn();
            }}
          >
            {" "}
            SignIn
          </div>
        )}
      </div>
    </div>
  );
}

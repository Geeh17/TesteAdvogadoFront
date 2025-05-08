import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  if (!autorizado) {
    return null;
  }

  return children;
}

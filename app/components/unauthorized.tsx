import Link from "next/link";

export default function UnauthorizedPage() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>⛔ Accès refusé</h1>
        <p>Vous n&apos;êtes pas autorisé à accéder à cette page.</p>
        <Link href="/">Retour à l&apos;accueil</Link>
      </div>
    );
  }
  
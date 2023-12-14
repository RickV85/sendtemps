import Link from "next/link";

export default function ReturnToLogin() {

    return (
      <main
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <Link href={"/"}>
          <h1 className="site-title">SendTemps</h1>
        </Link>
        <p>
          Please return to the home page and login. This page can only be used
          by logged in users.
        </p>
      </main>
    );

}

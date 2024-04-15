import {
  RegisterLink,
  LoginLink,
  getKindeServerSession,
  LogoutLink
} from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const {getUser, isAuthenticated} = getKindeServerSession();
  const user = await getUser();

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          {await isAuthenticated() ? (
              <div>
                  <p className="mb-8">Well, well, well, it isn&apos;t...</p>
                  <p className="font-medium text-lg">
                      {user.given_name} {user.family_name}
                  </p>
                  <pre className="mt-4 bg-slate-950 text-cyan-200 p-4 font-mono text-sm rounded-sm">
                      {JSON.stringify(user, null, 2)}
                  </pre>
                  <LogoutLink className="inline-block mt-8 underline text-blue-500">
                      Logout
                  </LogoutLink>
              </div>
          ) : (
              <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
                  <LoginLink className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                      <h2 className={`mb-3 text-2xl font-semibold`}>
                          Login{" "}
                          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                              -&gt;
                          </span>
                      </h2>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                          Log into an existing Lumon account.
                      </p>
                  </LoginLink>

                  <RegisterLink className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                      <h2 className={`mb-3 text-2xl font-semibold`}>
                          Register{" "}
                          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                              -&gt;
                          </span>
                      </h2>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                          Create a new Lumon account.
                      </p>
                  </RegisterLink>
              </div>
          )}
      </main>
  );
}
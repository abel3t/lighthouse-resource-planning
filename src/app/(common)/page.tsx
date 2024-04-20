import Image from 'next/image';

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Authenticated
      <Image
        src="https://utfs.io/f/c0688a41-cbf1-4714-90a7-d84fe7e44b22-1xalbv.HEIC"
        alt="UTFS logo"
        width={300}
        height={300}
      />
    </main>
  );
}

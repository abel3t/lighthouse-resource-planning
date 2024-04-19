import Footer from '@/components/custom/footer';
import Sidebar from '@/components/custom/sidebar';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="max-h-screen flex-1 overflow-y-scroll p-1 md:p-3">
        {children}

        <Footer />
      </div>
    </div>
  );
}

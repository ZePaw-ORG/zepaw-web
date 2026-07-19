// import Image from 'next/image';

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-[#FAFBFC] flex items-center justify-center px-6">
//       <div className="max-w-3xl w-full text-center">
//         {/* Logo Placeholder */}
//         <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-dashed border-[#14B8A6] bg-[#EAFBF8]">
//           <span className="text-sm font-medium text-[#14B8A6]"></span>
//         </div>

//         {/* Brand */}
//         <h1 className="text-5xl font-extrabold tracking-tight text-[#153E75]">Zepaw</h1>

//         <p className="mt-3 text-lg font-medium text-[#14B8A6]">
//           Your pet's lifelong digital health companion.
//         </p>

//         {/* Divider */}
//         <div className="mx-auto my-10 h-px w-24 bg-[#14B8A6]/30" />

//         {/* Main Content */}
//         <h2 className="text-4xl font-bold text-[#1F2937]">Coming Soon</h2>

//         <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
//           We're building a smarter way to manage your pet's health records, vaccinations,
//           prescriptions, and veterinary history, all in one secure place.
//         </p>

//         {/* CTA */}
//         <div className="mt-12">
//           <button className="rounded-xl bg-[#153E75] px-8 py-4 font-semibold text-white transition hover:bg-[#0F2F59]">
//             Launching Soon
//           </button>
//         </div>

//         <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="w-full sm:w-80 rounded-xl border border-gray-300 px-4 py-3 focus:border-[#14B8A6] focus:outline-none"
//           />

//           <button className="rounded-xl bg-[#153E75] px-6 py-3 font-semibold text-white hover:bg-[#0F2F59] transition">
//             Notify Me
//           </button>
//         </div>

//         {/* Footer */}
//         <p className="mt-16 text-sm text-gray-500">
//           © {new Date().getFullYear()} Zepaw. Built with ❤️ for healthier pets.
//         </p>
//       </div>
//     </main>
//   );
// }
import LandingPage from '@/components/structure/LandingPage';

// ---------- Root ----------
async function App() {
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <LandingPage />
    </main>
  );
}

export default App;

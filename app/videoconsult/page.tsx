// "use client";
// import React, { useEffect, useRef, useState } from 'react';

// declare global {
//   interface Window {
//     JitsiMeetExternalAPI: any;
//   }
// }

// const Consultation: React.FC = () => {
//   const jitsiContainerRef = useRef<HTMLDivElement>(null);
//   const [api, setApi] = useState<any>(null);

//   useEffect(() => {
//     // 1. Load the Jitsi script dynamically
//     const script = document.createElement('script');
//     script.src = "https://meet.jit.si/external_api.js";
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       if (jitsiContainerRef.current) {
//         const domain = "meet.jit.si";
//         const options = {
//           roomName: "MRS-Co-Private-Session-" + Math.random().toString(36).substring(7),
//           width: "100%",
//           height: 700,
//           parentNode: jitsiContainerRef.current,
//           configOverwrite: {
//             startWithAudioMuted: true,
//             disableThirdPartyRequests: true,
//           },
//           interfaceConfigOverwrite: {
//             TOOLBAR_BUTTONS: [
//               'microphone', 'camera', 'desktop', 'chat', 'raisehand',
//               'settings', 'videoquality', 'tileview', 'hangup'
//             ],
//           },
//           userInfo: {
//             displayName: 'Guest Client' // You can pass dynamic user data here
//           }
//         };

//         const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
//         setApi(jitsiApi);
//       }
//     };

//     return () => {
//       if (api) api.dispose();
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//       <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
//         <div className="p-6 bg-slate-800 text-white flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Secure Video Consultation</h1>
//             <p className="text-sm text-slate-300">MRS & Co. | Encrypted Meeting Room</p>
//           </div>
//           <div className="hidden md:block">
//             <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
//               LIVE SESSION
//             </span>
//           </div>
//         </div>

//         {/* This is where the Jitsi Video appears */}
//         <div 
//           ref={jitsiContainerRef} 
//           className="w-full bg-black aspect-video md:aspect-auto md:h-[700px]"
//         />

//         <div className="p-4 bg-gray-100 text-center text-xs text-gray-500 italic">
//           Your privacy is important. This meeting is protected by end-to-end encryption.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Consultation;
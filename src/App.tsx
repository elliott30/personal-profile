/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Linkedin, Calendar, MessageCircle } from "lucide-react";

declare global {
  interface Window {
    hsConversationsOnReady?: Array<() => void>;
    HubSpotConversations?: {
      widget: {
        load: (options?: { widgetOpen: boolean }) => void;
        open: () => void;
        status: () => { loaded: boolean; status: string };
      };
      on: (eventName: string, callback: () => void) => void;
    };
  }
}

export default function App() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "45min" });
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#00F5FF" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  const handleChatClick = () => {
    const openWidget = () => {
      if (window.HubSpotConversations && window.HubSpotConversations.widget) {
        const status = window.HubSpotConversations.widget.status();
        if (status.loaded) {
          window.HubSpotConversations.widget.open();
        } else {
          // Listen for the widget to finish loading, then open it immediately
          window.HubSpotConversations.on('widgetLoaded', () => {
            window.HubSpotConversations?.widget.open();
          });
          window.HubSpotConversations.widget.load({ widgetOpen: true });
        }
      }
    };

    if (window.HubSpotConversations) {
      openWidget();
    } else {
      // If the script hasn't fully initialized yet, queue it up
      window.hsConversationsOnReady = window.hsConversationsOnReady || [];
      window.hsConversationsOnReady.push(openWidget);

      // Fallback alert if it takes too long (e.g. blocked)
      setTimeout(() => {
        if (!window.HubSpotConversations) {
          console.warn("HubSpot Conversations widget is not available yet.");
          alert("The chat widget is still loading or might be blocked by an adblocker. Please disable adblockers and try again.");
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-gray-900">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-[#00F5FF] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            E
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Elliott</h1>
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col space-y-4">
          <a
            href="https://www.linkedin.com/in/elliottchapman/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 transition-colors">
                <Linkedin className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">LinkedIn</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <button
            data-cal-namespace="45min"
            data-cal-link="elliott-chapman/45min"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            className="group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 transition-colors">
                <Calendar className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">Book time with me</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={handleChatClick}
            className="group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 transition-colors">
                <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">Chat with me</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

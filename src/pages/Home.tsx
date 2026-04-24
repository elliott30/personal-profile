import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Linkedin, Calendar, MessageCircle, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  useEffect(() => {
    const resetThemeAndRemove = () => {
      // Reset theme color to white
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute("content", "#FFFFFF");
      } else {
        const meta = document.createElement('meta');
        meta.name = "theme-color";
        meta.content = "#FFFFFF";
        document.head.appendChild(meta);
      }
      // Remove the widget (hides the small circle)
      if (window.HubSpotConversations && window.HubSpotConversations.widget) {
        window.HubSpotConversations.widget.remove();
      }
    };

    const setupHubSpotListeners = () => {
      if (window.HubSpotConversations) {
        window.HubSpotConversations.on('conversationClosed', resetThemeAndRemove);
        // Some versions of the widget use this undocumented event
        window.HubSpotConversations.on('widgetClosed', resetThemeAndRemove);
      }
    };

    if (window.HubSpotConversations) {
      setupHubSpotListeners();
    } else {
      window.hsConversationsOnReady = window.hsConversationsOnReady || [];
      window.hsConversationsOnReady.push(setupHubSpotListeners);
    }

    // Fallback: MutationObserver to detect when the widget is minimized by the user
    // Since HubSpot doesn't reliably fire an event when the UI is just minimized
    let isWidgetOpen = false;
    const observer = new MutationObserver(() => {
      const container = document.getElementById('hubspot-messages-iframe-container');
      if (container) {
        const height = container.clientHeight;
        const width = container.clientWidth;
        
        // If it's large, it's open
        if (height > 200 && width > 200) {
          isWidgetOpen = true;
        } 
        // If it's small (launcher size) but was previously open, it was closed by the user
        else if (isWidgetOpen && height >= 0 && height < 150 && width >= 0 && width < 150) {
          isWidgetOpen = false;
          resetThemeAndRemove();
        }
      } else {
        // Container doesn't exist. If it was open, it's now closed
        if (isWidgetOpen) {
          isWidgetOpen = false;
          resetThemeAndRemove();
        }
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "45min" });
      cal("init", { origin: "https://cal.eu" });
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#00F5FF" } },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
      // Prerender the booking page in the background for instant loading on click
      cal("prerender", {
        calLink: "elliott-chapman/45min",
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
          if (!window.hsWidgetLoadedListenerAdded) {
            window.HubSpotConversations.on('widgetLoaded', () => {
              window.HubSpotConversations?.widget.open();
            });
            window.hsWidgetLoadedListenerAdded = true;
          }
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
    <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-6 font-sans text-gray-900">
      <div className="w-full max-w-md flex flex-col items-center space-y-6 sm:space-y-8">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          <img
            src={`https://${import.meta.env.VITE_HUBSPOT_PORTAL_ID}.fs1.hubspotusercontent-na1.net/hubfs/${import.meta.env.VITE_HUBSPOT_PORTAL_ID}/elliott.jpeg`}
            alt="Elliott Chapman"
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#00F5FF] shadow-lg"
          />
          <h1 className="text-4xl font-bold tracking-tight">Elliott</h1>
        </div>

        {/* Links Section */}
        <div className="w-full flex flex-col space-y-4">
          <a
            href="https://www.linkedin.com/in/elliottchapman/"
            target="_blank"
            rel="noopener noreferrer"
            className="tactile-btn group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] active:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 group-active:bg-[#00F5FF]/10 transition-colors">
                <Linkedin className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF] group-active:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">LinkedIn</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] group-active:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-active:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          <Link
            to="/solutions"
            className="tactile-btn group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] active:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 group-active:bg-[#00F5FF]/10 transition-colors">
                <FlaskConical className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF] group-active:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">The Solution Lab</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] group-active:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-active:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <button
            data-cal-namespace="45min"
            data-cal-link="elliott-chapman/45min"
            data-cal-origin="https://cal.eu"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            className="tactile-btn relative overflow-hidden shimmer-btn group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] active:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 group-active:bg-[#00F5FF]/10 transition-colors">
                <Calendar className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF] group-active:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">Book time with me</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] group-active:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-active:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={handleChatClick}
            className="tactile-btn group flex items-center justify-between w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-[#00F5FF] active:border-[#00F5FF] hover:shadow-md transition-all duration-300 bg-white text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-gray-50 group-hover:bg-[#00F5FF]/10 group-active:bg-[#00F5FF]/10 transition-colors">
                <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-[#00F5FF] group-active:text-[#00F5FF]" />
              </div>
              <span className="font-medium text-lg">Chat</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-[#00F5FF] group-active:bg-[#00F5FF] transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white group-active:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}

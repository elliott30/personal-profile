import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

interface SolutionContent {
  title: string;
  description: string;
  videoUrl: string;
}

function parseMD(raw: string): SolutionContent {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: '', description: '', videoUrl: '' };
  
  const attributes: any = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      attributes[key] = val;
    }
  });
  
  return {
    title: attributes.title || '',
    description: attributes.description || '',
    videoUrl: attributes.videoUrl || '',
  };
}

function getEmbedUrl(url: string) {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('loom.com/share/')) {
      const videoId = url.split('loom.com/share/')[1].split('?')[0];
      return `https://www.loom.com/embed/${videoId}`;
    }
    if (url.includes('gumlet.io/watch/')) {
      const videoId = url.split('gumlet.io/watch/')[1].split('?')[0];
      return `https://video.gumlet.io/embed/${videoId}`;
    }
    return url;
  } catch (e) {
    return url;
  }
}

export default function SolutionLab() {
  const [solutions, setSolutions] = useState<SolutionContent[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      // Import all markdown files from the content directory
      const modules = import.meta.glob('../content/*.md', { query: '?raw', import: 'default' });
      const loadedSolutions: SolutionContent[] = [];
      
      for (const path in modules) {
        const rawContent = await modules[path]() as string;
        loadedSolutions.push(parseMD(rawContent));
      }
      
      setSolutions(loadedSolutions);
    };
    
    loadContent();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col font-sans text-gray-900">
      
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        
        <div className="flex items-center space-x-3">
          <img
            src="https://3967898.fs1.hubspotusercontent-na1.net/hubfs/3967898/elliott.jpeg"
            alt="Elliott Chapman"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border-2 border-[#00F5FF]"
          />
          <span className="font-bold text-lg tracking-tight">Elliott</span>
        </div>
        
        <div className="w-9" /> {/* Spacer to balance the back button */}
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex flex-col py-6 space-y-6 sm:space-y-8 px-0 sm:px-6">
        <div className="px-4 sm:px-0 mb-2">
          <h2 className="text-2xl font-bold">The Solution Lab</h2>
          <p className="text-gray-500 mt-1">Showcase of technical demos and integrations.</p>
        </div>

        <div className="flex flex-col space-y-8 sm:space-y-10">
          {solutions.map((solution, index) => {
            const embedUrl = getEmbedUrl(solution.videoUrl);
            
            return (
              <div key={index} className="flex flex-col sm:rounded-2xl sm:border-2 sm:border-gray-100 sm:overflow-hidden bg-white sm:hover:border-[#00F5FF] transition-colors duration-300">
                
                {/* Video Container (16:9 Aspect Ratio) */}
                <div className="relative w-full pt-[56.25%] bg-gray-100 group">
                  <iframe
                    src={embedUrl}
                    title={solution.title}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  
                  {/* Desktop Overlay to intercept clicks for Modal */}
                  <div 
                    className="hidden sm:block absolute inset-0 cursor-pointer z-10"
                    onClick={() => setSelectedVideo(embedUrl)}
                  />
                </div>

                {/* Text Content */}
                <div className="p-4 sm:p-5 flex flex-col">
                  <h3 className="text-lg font-bold leading-tight">{solution.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{solution.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Desktop Video Modal */}
      {selectedVideo && (
        <div className="hidden sm:flex fixed inset-0 z-50 bg-black/80 backdrop-blur-sm items-center justify-center p-8">
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={`${selectedVideo}${selectedVideo.includes('?') ? '&' : '?'}autoplay=1`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

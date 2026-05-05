"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, Calendar, Clock } from "lucide-react";

interface Session {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  type: string;
}

interface SessionSidebarProps {
  featureType: string;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
}

export function SessionSidebar({ featureType, onSessionSelect, onNewSession }: SessionSidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      name: `${featureType} Project 1`,
      createdAt: "2024-01-15",
      lastModified: "2 hours ago",
      type: featureType
    },
    {
      id: "2", 
      name: `${featureType} Project 2`,
      createdAt: "2024-01-14",
      lastModified: "1 day ago",
      type: featureType
    },
    {
      id: "3",
      name: `${featureType} Project 3`,
      createdAt: "2024-01-13", 
      lastModified: "3 days ago",
      type: featureType
    }
  ]);

  const [selectedSession, setSelectedSession] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSessionClick = (sessionId: string) => {
    setSelectedSession(sessionId);
    onSessionSelect?.(sessionId);
  };

  const handleNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      name: `New ${featureType} Project`,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: "just now",
      type: featureType
    };
    setSessions([newSession, ...sessions]);
    setSelectedSession(newSession.id);
    onNewSession?.();
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
          <button
            onClick={handleNewSession}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="New Session"
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No sessions found
          </div>
        ) : (
          <div className="p-2">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session.id)}
                className={`p-3 rounded-lg cursor-pointer mb-2 group transition-colors ${
                  selectedSession === session.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      selectedSession === session.id ? "text-primary" : "text-gray-900"
                    }`}>
                      {session.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{session.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{session.lastModified}</span>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
        </div>
      </div>
    </div>
  );
} 
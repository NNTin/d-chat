import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Database, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { ApiService } from '../services/api';
import { EmbeddingStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<EmbeddingStats | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await ApiService.getStats();
    setStats(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      setUploadStatus('idle');
      try {
        const success = await ApiService.uploadDocument(e.target.files[0]);
        setUploadStatus(success ? 'success' : 'error');
        if (success) loadStats();
      } catch {
        setUploadStatus('error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure? This will delete all conversation history.")) {
      setResetting(true);
      await ApiService.resetDatabase();
      setResetting(false);
      loadStats();
    }
  };

  // Prepare chart data
  const chartData = stats ? [
    { name: 'Docs', value: stats.totalDocuments },
    { name: 'Chunks', value: stats.totalChunks },
    { name: 'MB Used', value: stats.diskUsageMB },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage ChromaDB knowledge base and settings.</p>
        </div>
        <div className="text-right">
             <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">
                Backend: {ApiService.getBaseUrl()}
             </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Knowledge Upload Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <Database size={24} />
            <h3 className="text-xl font-semibold text-slate-800">Knowledge Base</h3>
          </div>
          <p className="text-slate-600 mb-6 text-sm">
            Upload text files, PDFs, or Markdown to update the RAG embeddings. 
            This knowledge will be available to all chat users immediately.
          </p>
          
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".txt,.md,.pdf"
            />
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : (
                 <Upload size={32} className="text-slate-400" />
              )}
              <span className="text-sm font-medium text-slate-600">
                {uploading ? "Processing Embeddings..." : "Drop files here or click to upload"}
              </span>
            </div>
          </div>

          {uploadStatus === 'success' && (
            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm bg-green-50 p-2 rounded">
              <CheckCircle size={16} /> Successfully added to knowledge base.
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
              <AlertTriangle size={16} /> Failed to upload. Check backend logs.
            </div>
          )}
        </div>

        {/* System Health / Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-3 mb-4 text-emerald-600">
            <FileText size={24} />
            <h3 className="text-xl font-semibold text-slate-800">Vector Stats</h3>
          </div>
          
          <div className="flex-1 min-h-[200px]">
             {stats ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis hide />
                   <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                     cursor={{fill: 'transparent'}}
                   />
                   <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#10b981'][index % 3]} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-slate-400">Loading stats...</div>
             )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm text-slate-500">
             <span>Last Updated: {stats ? new Date(stats.lastUpdated).toLocaleDateString() : '-'}</span>
             <span>Status: Online</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
        <div className="flex items-center justify-between">
            <p className="text-red-600 text-sm">
                Resetting the database will wipe all long-term conversational memory from ChromaDB. 
                Knowledge embeddings will be preserved.
            </p>
            <Button variant="danger" onClick={handleReset} isLoading={resetting}>
                <Trash2 size={16} className="mr-2" />
                Reset Memory
            </Button>
        </div>
      </div>
    </div>
  );
};
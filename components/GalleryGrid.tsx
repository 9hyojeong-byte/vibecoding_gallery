
import React from 'react';
import { WebApp } from '../types';
import AppCard from './AppCard';

interface GalleryGridProps {
  apps: WebApp[];
  onRefresh: () => void;
  onOpenDetails: (app: WebApp) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ apps, onRefresh, onOpenDetails }) => {
  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg">등록된 앱이 없습니다.</p>
        <p className="text-sm">첫 번째 앱의 주인공이 되어보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {apps.map((app) => (
        <AppCard 
          key={app.id} 
          app={app} 
          onRefresh={onRefresh} 
          onOpenDetails={() => onOpenDetails(app)}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;

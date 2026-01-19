
import React from 'react';
import { WebApp } from '../types';

interface DetailsDrawerProps {
  app: WebApp | null;
  onClose: () => void;
}

const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Overlay Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 ${app ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl pointer-events-auto transition-transform duration-300 transform ${app ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{app.name} 상세 정보</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            {/* Info Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                  {app.author.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">제작자</p>
                  <p className="text-lg font-bold text-gray-900">{app.author}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 font-medium mb-1">앱 설명</p>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {app.description || '작성된 설명이 없습니다.'}
                </p>
              </div>

              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>서비스 바로가기</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Screenshots Gallery */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-l-4 border-blue-600 pl-3">미리보기 스크린샷</h3>
              <div className="space-y-4">
                {app.images && app.images.length > 0 ? (
                  app.images.map((imgUrl, index) => (
                    <div key={index} className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                      <img 
                        src={imgUrl} 
                        alt={`${app.name} preview ${index + 1}`} 
                        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-xl text-gray-400 border-2 border-dashed border-gray-200">
                    <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>등록된 스크린샷이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>등록일: {new Date(app.timestamp).toLocaleDateString()}</span>
            <span>ID: {app.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsDrawer;

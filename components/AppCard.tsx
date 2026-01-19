
import React, { useState } from 'react';
import { WebApp } from '../types';
import { GAS_WEBAPP_URL } from '../constants';
import PasswordModal from './PasswordModal';
import EditModal from './EditModal';

interface AppCardProps {
  app: WebApp;
  onRefresh: () => void;
  onOpenDetails: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onRefresh, onOpenDetails }) => {
  const [showDeleteAuth, setShowDeleteAuth] = useState(false);
  const [showEditAuth, setShowEditAuth] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (password: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deleteApp',
          id: app.id,
          password: password
        })
      });
      const text = await response.text();
      const result = JSON.parse(text);
      
      if (result.success) {
        onRefresh();
      } else {
        alert(result.message || '삭제에 실패했습니다. 비밀번호를 확인해주세요.');
      }
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다. 서버 연결을 확인하세요.');
    } finally {
      setIsDeleting(false);
      setShowDeleteAuth(false);
    }
  };

  const thumbnail = app.images && app.images.length > 0 
    ? app.images[0] 
    : 'https://picsum.photos/400/225';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div 
        className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
        onClick={onOpenDetails}
      >
        <img 
          src={thumbnail} 
          alt={app.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
           <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-opacity">상세보기</span>
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-2 flex justify-between items-start">
          <h3 
            className="text-lg font-bold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={onOpenDetails}
          >
            {app.name}
          </h3>
          <span className="text-xs text-gray-400 font-medium">#{app.id.slice(0, 4)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{app.author}</span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
          {app.description || '간단한 소개가 없습니다.'}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex gap-2">
            <button
              onClick={onOpenDetails}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg border border-gray-200 transition-colors text-sm"
            >
              상세보기
            </button>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-sm shadow-blue-100 transition-colors text-sm flex items-center justify-center space-x-1"
            >
              <span>열기</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="flex justify-end space-x-2 border-t border-gray-50 pt-3">
            <button 
              onClick={() => setShowEditAuth(true)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="수정"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowDeleteAuth(true)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="삭제"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="w-5 h-5 border-2 border-gray-200 border-t-red-500 animate-spin rounded-full" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {showDeleteAuth && (
        <PasswordModal 
          title="게시물 삭제"
          description="이 게시물을 올릴 때 설정했던 개인 비밀번호를 입력하세요."
          onSuccess={handleDelete}
          onClose={() => setShowDeleteAuth(false)}
          isActionModal={true}
        />
      )}

      {showEditAuth && (
        <PasswordModal 
          title="게시물 수정"
          description="이 게시물을 올릴 때 설정했던 개인 비밀번호를 입력하세요."
          onSuccess={() => {
            setShowEditAuth(false);
            setShowEditModal(true);
          }}
          onClose={() => setShowEditAuth(false)}
          verifyAction={async (pw) => {
            try {
              const resp = await fetch(GAS_WEBAPP_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                  body: JSON.stringify({ action: 'verifyPassword', id: app.id, password: pw })
              });
              const text = await resp.text();
              const res = JSON.parse(text);
              return res.success;
            } catch (e) {
              console.error(e);
              return false;
            }
          }}
        />
      )}

      {showEditModal && (
        <EditModal 
          app={app} 
          onClose={() => setShowEditModal(false)} 
          onSuccess={() => {
            setShowEditModal(false);
            onRefresh();
          }} 
        />
      )}
    </div>
  );
};

export default AppCard;

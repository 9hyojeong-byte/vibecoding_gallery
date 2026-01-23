
import React, { useState, useEffect, useCallback } from 'react';
import { WebApp } from './types';
import { GAS_WEBAPP_URL, GLOBAL_PASSWORD } from './constants';
import Header from './components/Header';
import GalleryGrid from './components/GalleryGrid';
import RegistrationModal from './components/RegistrationModal';
import PasswordModal from './components/PasswordModal';
import DetailsDrawer from './components/DetailsDrawer';

const App: React.FC = () => {
  const [apps, setApps] = useState<WebApp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [globalAuthModal, setGlobalAuthModal] = useState<boolean>(false);
  const [selectedApp, setSelectedApp] = useState<WebApp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${GAS_WEBAPP_URL}?action=fetchApps`);
      const result = await response.json();
      if (result.success) {
        // "쿠효정" 제작자의 게시글을 제외하고 필터링하여 상태에 저장
        const filteredApps = (result.data as WebApp[]).filter(app => app.author !== "쿠효정");
        setApps(filteredApps);
      } else {
        setError('앱 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenRegister = () => {
    setGlobalAuthModal(true);
  };

  const onGlobalAuthSuccess = () => {
    setGlobalAuthModal(false);
    setIsRegisterOpen(true);
  };

  const handleOpenDetails = (app: WebApp) => {
    setSelectedApp(app);
  };

  const handleCloseDetails = () => {
    setSelectedApp(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header onRegisterClick={handleOpenRegister} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">갤러리를 불러오고 있습니다...</p>
          </div>
        ) : (
          <GalleryGrid 
            apps={apps} 
            onRefresh={fetchApps} 
            onOpenDetails={handleOpenDetails}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Web App Gallery Hub. Built with Google Apps Script & React.
        </div>
      </footer>

      {/* Global Password Check */}
      {globalAuthModal && (
        <PasswordModal 
          title="공통 비밀번호 확인"
          description="갤러리에 앱을 등록하려면 공통 비밀번호를 입력해야 합니다."
          correctPassword={GLOBAL_PASSWORD}
          onSuccess={onGlobalAuthSuccess}
          onClose={() => setGlobalAuthModal(false)}
        />
      )}

      {/* Registration Form Modal */}
      {isRegisterOpen && (
        <RegistrationModal 
          onClose={() => setIsRegisterOpen(false)} 
          onSuccess={() => {
            setIsRegisterOpen(false);
            fetchApps();
          }}
        />
      )}

      {/* Details Drawer */}
      <DetailsDrawer 
        app={selectedApp} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
};

export default App;


import React, { useState } from 'react';

interface PasswordModalProps {
  title: string;
  description: string;
  onSuccess: (password: string) => void;
  onClose: () => void;
  correctPassword?: string;
  isActionModal?: boolean;
  verifyAction?: (pw: string) => Promise<boolean>;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ 
  title, 
  description, 
  onSuccess, 
  onClose, 
  correctPassword,
  verifyAction
}) => {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setIsError(false);

    if (correctPassword) {
      if (password === correctPassword) {
        onSuccess(password);
      } else {
        setIsError(true);
        setIsVerifying(false);
      }
    } else if (verifyAction) {
        const isValid = await verifyAction(password);
        if (isValid) {
            onSuccess(password);
        } else {
            setIsError(true);
            setIsVerifying(false);
        }
    } else {
        // For simple delete action passing password back
        onSuccess(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-8v4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 text-sm mb-6">{description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                autoFocus
                className={`w-full px-4 py-3 bg-gray-50 border ${isError ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-200'} rounded-xl focus:outline-none focus:ring-4 transition-all`}
              />
              {isError && <p className="text-xs text-red-500 mt-1 ml-1">비밀번호가 일치하지 않습니다.</p>}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isVerifying ? '확인 중...' : '확인'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;

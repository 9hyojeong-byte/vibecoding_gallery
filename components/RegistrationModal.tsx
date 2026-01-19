
import React, { useState } from 'react';
import { GAS_WEBAPP_URL } from '../constants';

interface RegistrationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    author: '',
    name: '',
    description: '',
    url: '',
    password: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(selectedFiles);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); 
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 중복 클릭 방지

    console.log("등록 프로세스 시작...");
    
    if (files.length === 0) {
      alert('최소 하나 이상의 이미지를 업로드해주세요.');
      return;
    }

    setIsSubmitting(true);
    setProgress('이미지 변환 중...');

    try {
      console.log("이미지 Base64 변환 중...");
      const imagePayloads = await Promise.all(
        files.map(async (file) => ({
          base64: await fileToBase64(file),
          name: file.name,
          type: file.type
        }))
      );

      setProgress('데이터 전송 중...');
      
      /**
       * 핵심 수정: 중복 등록 방지를 위해 단일 fetch 요청만 수행합니다.
       * 'Content-Type': 'text/plain'을 사용하면 브라우저가 Preflight(OPTIONS) 요청을 생략하며,
       * GAS 서버에서는 e.postData.contents를 통해 JSON을 성공적으로 파싱할 수 있습니다.
       */
      console.log("GAS 서버로 단일 요청 전송:", GAS_WEBAPP_URL);
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'registerApp',
          ...formData,
          images: imagePayloads
        }),
        redirect: 'follow'
      });

      const text = await response.text();
      console.log("서버 응답 수신:", text);
      
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        throw new Error("서버 응답 형식이 올바르지 않습니다.");
      }

      if (result.success) {
        alert('성공적으로 등록되었습니다!');
        onSuccess();
      } else {
        alert('등록 실패: ' + result.message);
      }
    } catch (err: any) {
      console.error("에러 발생:", err);
      alert('오류가 발생했습니다: ' + err.message);
    } finally {
      setIsSubmitting(false);
      setProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">새 앱 등록하기</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors" 
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">등록자 이름</label>
              <input
                required
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="예: 홍길동"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">서비스 이름</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="예: 나만의 플래너"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">간단한 소개</label>
            <textarea
              required
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="앱에 대해 간단히 설명해주세요."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">접속 URL</label>
            <input
              required
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">스크린샷 (최대 3장)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-blue-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>파일 업로드</span>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" disabled={isSubmitting} />
                  </label>
                  <p className="pl-1">또는 드래그 앤 드롭</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (장당 최대 5MB 권장)</p>
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <p key={i} className="text-sm font-medium text-blue-600">✓ {f.name}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">수정/삭제용 비밀번호</label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="나중에 수정/삭제할 때 사용됩니다."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 grow-[2] px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2" />
                  <span>{progress}</span>
                </>
              ) : '갤러리에 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;

'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Modal } from 'antd'; // Import Modal bình thường
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@/lib/features/ui/uiSlice'; 

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  // 👇 Quản lý bằng State, không dùng modal.warning()
  const [isExpiredOpen, setIsExpiredOpen] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Nếu token hết hạn -> Bật State = true để mở Modal
    if (status === 'authenticated' && (session as any)?.isExpired) {
      setIsExpiredOpen(true);
    }
  }, [session, status]);

  const handleReLogin = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setIsExpiredOpen(false); // Đóng modal
    dispatch(openLoginModal()); // Mở form đăng nhập ở Header
  };

  return (
    <>
      {children}

      {/* 👇 Dùng thẻ <Modal> vẽ trực tiếp ở đây */}
      <Modal
        open={isExpiredOpen}
        closable={false}
        keyboard={false}
        maskClosable={false}
        footer={null}
        centered
      >
        <div className="text-center p-4">
           <h2 className="text-xl font-bold mb-4">Phiên đăng nhập hết hạn</h2>
           <p className="mb-6">Vui lòng đăng nhập lại để tiếp tục.</p>
           <button onClick={handleReLogin} className="bg-[#C19D56] text-white px-6 py-2 rounded">
             Đăng Nhập Lại
           </button>
        </div>
      </Modal>
    </>
  );
}
import { useEffect, useState } from 'react';
import styles from './styles/modal.module.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info';
}

function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  type = 'warning'
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : styles.closing}`}>
      <div className={`${styles.modal} ${styles[type]}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          {onCancel && (
            <button className={styles.closeButton} onClick={onCancel}>
              <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
              </svg>
            </button>
          )}
        </div>
        <div className={styles.modalContent}>
          {type === 'warning' && (
            <div className={styles.warningIcon}>
              <svg className="w-8 h-8" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z"/>
              </svg>
            </div>
          )}
          <p className={styles.modalMessage}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          {onCancel && (
            <button className={styles.cancelButton} onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
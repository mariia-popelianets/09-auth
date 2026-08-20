"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import css from "./Modal.module.css";

interface ModalProps {
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Modal = ({ children, isOpen = true, onClose }: ModalProps) => {
  const router = useRouter();

  const closeModal = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.modal} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};

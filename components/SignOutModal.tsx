type SignOutModalProps = {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
};

function SignOutModal({ isOpen, userId, onClose }: SignOutModalProps) {
  return <div>SignOutModal</div>;
}

export default SignOutModal;

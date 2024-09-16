import { useState } from 'react';

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);
  return [isOpen, toggleDropdown];
};

export default useDropdown;

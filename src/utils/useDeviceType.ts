import { useState, useEffect } from 'react';

interface DeviceType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    // Initial check
    updateDeviceType();

    // Add event listener for window resize
    window.addEventListener('resize', updateDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return deviceType;
};

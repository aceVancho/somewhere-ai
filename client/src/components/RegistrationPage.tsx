import React, { useEffect } from 'react';
import RegistrationForm from './RegistrationForm';
import { useLogo } from './Logo';

const RegistrationPage: React.FC = () => {

    // This is stupid and tailwind-elements looks far, far better than it runs.
    useEffect(() => {
      const init = async () => {
        const { Input, Ripple, Modal, initTE } = await import("tw-elements");
        initTE({ Input, Ripple, Modal }, { allowReinits: true });
      };
      init();
    }, []);

  return (
      <div className="flex justify-center mt-14">
            <div
              className="block lg:w-2/4 w-2/4 md:w-3/4 rounded-lg shadow-lg">
              <div className="w-full">
                {/* <!-- Left column container--> */}
                <div className="pt-5">
                  <div className="p-12 w-full">
                    {/* <!--Logo--> */}
                    <div className="text-center">
                      <img
                        className="mx-auto w-48"
                        src={useLogo()}
                        alt="logo" />
                      <h4 className="mb-12 mt-2 pb-1 text-linen text-xl font-semibold">
                        Sound as smart as your computer
                      </h4>
                    </div>
                    <RegistrationForm />
                  </div>
                </div>
              </div>
            </div>
      </div>
  );
};

export default RegistrationPage;

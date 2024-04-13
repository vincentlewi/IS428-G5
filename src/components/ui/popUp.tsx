import { Button } from '@/components/ui/button';
import logoFull from '/logoFull.png';
import part1 from '/userGuide/part1.gif';
import part2 from '/userGuide/part2.gif';
import part3 from '/userGuide/part3.gif';
import part4 from '/userGuide/part4.gif';
import { TbX } from 'react-icons/tb';
import { forwardRef } from 'react'; 

interface SessionStartPopupProps {
  onStartSession: () => void;
}

const PopUp = forwardRef<HTMLDivElement, SessionStartPopupProps>(
  ({ onStartSession }, ref) => {

    const handleStartSession = () => {
      onStartSession();
    };

    const handleClose = () => {
      onStartSession();
    };
    return (
      <div
        ref={ref}
        data-testid='popup-container'
        className='fixed inset-0 z-50 flex items-center justify-center px-5 md:px-12'
      >
        <div className='relative mx-auto w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg'>
          <button
            data-testid='close-button'
            onClick={handleClose}
            className='absolute right-5 top-5 text-2xl'
          >
            <TbX />
          </button>

          <div className='flex items-center justify-center space-x-2'>
            <p className='text-lg'>Welcome to</p>
            <img
              src={logoFull}
              alt='Logo'
              width={120}
              height={80}
              data-testid='logo-image'
            />
          </div>

          <p className='mt-2 text-center text-md'>
            A visual analytics project dedicated to help young adults make smarter real estate decisions.
          </p>

          <div className='mt-4 grid grid-cols-1 gap-4 rounded-xl bg-gray-100 p-4 sm:grid-cols-4'>
            {/* Step 1 */}
            <div className='flex flex-col items-center'>
              <img
                src={part1}
                alt='Image 1'
                width={300}
                height={300}
                className='p-2'
                data-testid='image1'
              />
              <p className='text-center text-sm'>
                1. Delve into the visualizations to learn about Singapore's housing market
              </p>
            </div>
            {/* Step 2 */}
            <div className='flex flex-col items-center'>
              <img
                src={part2}
                alt='Image 2'
                width={300}
                height={300}
                className='p-2'
                data-testid='image2'
              />
              <p className='text-center text-sm'>
                2. Gain more insights by configuring the filters
              </p>
            </div>
            {/* Step 3 */}
            <div className='flex flex-col items-center'>
              <img
                src={part3}
                alt='Image 3'
                width={300}
                height={300}
                className='p-2'
                data-testid='image3'
              />
              <p className='text-center text-sm'>
                3. Explore the housing options in the dashboard page
              </p>
            </div>
            {/* Step 4 */}
            <div className='flex flex-col items-center'>
              <img
                src={part4}
                alt='Image 4'
                width={300}
                height={300}
                className='p-2'
                data-testid='image4'
              />
              <p className='text-center text-sm'>
                4. Find the best house that suits you best!
              </p>
            </div>
          </div>

          <p className='mt-6 text-center text-md font-semibold'>
            Ready to Start?
          </p>
          <p className='text-center text-sm'>
            Simply close this window and begin to find your dream home!
          </p>

          <div className='mt-6 flex justify-center'>
            <Button
              onClick={handleStartSession}
              data-testid='dont-show-again-button'
            >
              Don't Show This Guide Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

export default PopUp;
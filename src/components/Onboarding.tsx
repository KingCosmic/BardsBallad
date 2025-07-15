import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLiveRect } from '@hooks/useLiveRect';
import { useNavigate } from 'react-router';

function getTooltipPosition(targetRect: DOMRect | null, position: string) {
  if (!targetRect || position === 'center') {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    };
  }

  const spacing = 12;

  switch (position) {
    case 'top':
      return {
        top: `${targetRect.top - spacing}px`,
        left: `${targetRect.left}px`,
        transform: 'translate(0, -100%)', // top aligned left
      };

    case 'bottom':
      return {
        top: `${targetRect.bottom + spacing}px`,
        left: `${targetRect.left}px`,
        transform: 'translate(0, 0)', // bottom aligned left
      };

    case 'left':
      return {
        top: `${targetRect.top}px`,
        left: `${targetRect.left - spacing}px`,
        transform: 'translate(-100%, 0)', // left aligned top
      };

    case 'right':
      return {
        top: `${targetRect.top}px`,
        left: `${targetRect.right + spacing}px`,
        transform: 'translate(0, 0)', // right aligned top
      };

    default:
      return {
        top: `${targetRect.bottom + spacing}px`,
        left: `${targetRect.left}px`,
        transform: 'translate(0, 0)',
      };
  }
}

export const Onboarding = ({ steps, onFinish }: {
  steps: any[];
  onFinish: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const targetRect = useLiveRect(steps[currentStep].selector, true);

  const navigate = useNavigate()

  const step = steps[currentStep];

  const next = () => {
    if (step.navTo) {
      navigate(step.navTo);
    }
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  if (!targetRect) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 pointer-events-auto" />

      {/* Highlight */}
      <div
        className="fixed border-2 border-yellow-400 pointer-events-auto z-50 rounded-lg transition-all duration-300"
        style={{
          top: targetRect.top + window.scrollY,
          left: targetRect.left + window.scrollX,
          width: targetRect.width,
          height: targetRect.height,
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 p-4 bg-white text-black rounded shadow-xl max-w-xs"
        style={getTooltipPosition(targetRect, step.position || 'bottom')}
      >
        <p className="mb-2">{step.content}</p>
        {!step.waitForClick && (
          <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={next}>
            {currentStep + 1 < steps.length ? 'Next' : 'Finish'}
          </button>
        )}
      </div>
    </>,
    document.body
  );
};


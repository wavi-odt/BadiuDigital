import { ThemeProvider } from '@/context/ThemeContext';
import { MotionProvider } from '@/app/providers/MotionProvider';
import { IntroProvider } from '@/app/providers/IntroProvider';
import { TransitionProvider } from '@/app/providers/TransitionProvider';
import AppRouter from '@/app/router';

export default function App() {
  return (
    <ThemeProvider>
      <MotionProvider>
        <IntroProvider>
          <TransitionProvider>
            <AppRouter />
          </TransitionProvider>
        </IntroProvider>
      </MotionProvider>
    </ThemeProvider>
  );
}

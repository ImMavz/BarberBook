import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { Text } from 'react-native';
import { useAuthViewModel } from '../viewmodel/authViewModel';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function TestComponent() {
  const { login } = useAuthViewModel();
  const [status, setStatus] = React.useState('idle');

  // call once on mount — avoid using `login` in deps to prevent repeated calls
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await login('a@b.com', 'pass');
        if (mounted) setStatus(res.success ? 'ok' : 'fail');
      } catch (e) {
        if (mounted) setStatus('fail');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return <Text testID="status">{status}</Text>;
}

describe('useAuthViewModel.login (mock axios)', () => {
  it('resuelve correctamente cuando axios responde OK', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { access_token: 'abc123', usuario: { rol: 'cliente' } },
    } as any);
    const { getByTestId } = render(<TestComponent />);

    await waitFor(() => expect(getByTestId('status').props.children).toBe('ok'), { timeout: 5000 });
  });

  it('devuelve fallo cuando axios lanza error', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message: 'bad' } } });

    const { getByTestId } = render(<TestComponent />);

    await waitFor(() => expect(getByTestId('status').props.children).toBe('fail'), { timeout: 5000 });
  });
});

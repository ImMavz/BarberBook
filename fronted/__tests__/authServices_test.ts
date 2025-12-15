describe('authServices.login (inline implementation)', () => {
  // local implementation matching the example in the docs
  async function login(email: string, password: string) {
    const res = await fetch('https://api.example.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Network error');
    return res.json();
  }

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('devuelve los datos cuando la respuesta es OK', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'abc123' }),
    });

    const data = await login('a@b.com', 'pass');
    expect(data).toEqual({ token: 'abc123' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('lanza error cuando la respuesta no es OK', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    await expect(login('a@b.com', 'pass')).rejects.toThrow('Network error');
  });
});
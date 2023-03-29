export async function sendRequest<T = any>(
  method: 'POST' | 'GET' | 'PUT' | 'DELETE',
  routeName: string,
  data?: any,
  mockData?: {res: Response, data: T}
): Promise<{res: Response, data: T}> {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
    credentials: 'include' as RequestCredentials,
  };

  if (process.env.development && mockData) {
    return mockData;
  }

  const res = await fetch(`http://${window.location.hostname}:3000/${routeName}`, options);

  const respData = await res.json();
  return {res, data: respData};

}

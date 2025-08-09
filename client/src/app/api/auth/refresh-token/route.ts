import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken');

  if (!refreshToken) {
    return NextResponse.json(
      { error: 'No refresh token found' },
      { status: 401 }
    );
  }

  try {
    const authServiceUrl = process.env.AUTH_SERVICE_URL!;

    const response = await fetch(`${authServiceUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refreshToken=${refreshToken.value}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      (await cookies()).delete('token');
      (await cookies()).delete('refreshToken');
      return NextResponse.json(errorData, { status: response.status });
    }

    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json({ success: true });

    setCookieHeaders.forEach((cookie) => {
      nextResponse.headers.append('Set-Cookie', cookie);
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

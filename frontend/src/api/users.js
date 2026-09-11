// src/api/users.js

const API_URL = '';

export async function registerUser({ username, email, password, wallet }) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, wallet }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

export async function updateUser({ username, avatarFile }) {
  let avatar;
  if (avatarFile) {
    avatar = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // base64 data URL
      reader.onerror = reject;
      reader.readAsDataURL(avatarFile);
    });
  }

  console.log('[stub] updateUser payload:', { username, avatar });
  await new Promise((r) => setTimeout(r, 400));
  return { username, ...(avatar && { avatar }) };
}

// STUB — swap the body for a real fetch() once your teammate exposes
// something like PATCH /users/me/password for password changes.
export async function changePassword({ currentPassword, newPassword }) {
  console.log('[stub] changePassword payload:', { currentPassword, newPassword });
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };

  // Once the real endpoint exists:
  // const response = await fetch(`${API_URL}/users/me/password`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ currentPassword, newPassword }),
  // });
  //
  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message || 'Password change failed');
  // }
  //
  // return response.json();
}
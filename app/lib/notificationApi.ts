export async function fetchLastNotification(candidatId: string) {
  try {
    const res = await fetch(`http://localhost:4005/api/notification?candidatId=${candidatId}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.message;
  } catch (e) {
    console.error('Erreur lors de la récupération de la notification:', e);
    return null; } }
    
export async function fetchNotifications(candidatId: string) {
  const res = await fetch(`http://localhost:4005/api/notifications?candidatId=${candidatId}`);
  if (!res.ok) return [];
  return await res.json();
}

export async function fetchUnreadNotificationCount(candidatId: string) {
  const res = await fetch(`http://localhost:4005/api/notifications/unread/count?candidatId=${candidatId}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.unreadCount;
}

export async function markAllNotificationsAsRead(candidatId: string) {
  await fetch(`http://localhost:4005/api/notifications/mark-all-read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidatId }),
  });
}
export function timeAgo(createdAt: number | string): string {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 1000 / 60);

    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 min ago";
    if (diffMins < 60) return `${diffMins} mins ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
}


export function isRecentPost(dateString: string): boolean {
  try {
    const [day, , month, , yearAndAfter] = dateString.split(" ");
    const year = Number(yearAndAfter);
    const monthsList = [
      "janeiro","fevereiro","março","abril","maio","junho",
      "julho","agosto","setembro","outubro","novembro","dezembro"
    ];
    let monthIdx = -1;
    for (let i = 0; i < monthsList.length; ++i) {
      if (monthsList[i] === month.toLowerCase()) {
        monthIdx = i;
        break;
      }
    }
    if (monthIdx === -1) return false;

    const hourMinMatch = dateString.match(/(\d{2}):(\d{2})$/);
    let hour = 0, min = 0;
    if (hourMinMatch) {
      hour = parseInt(hourMinMatch[1], 10);
      min = parseInt(hourMinMatch[2], 10);
    }
    const postDate = new Date(Number(year), monthIdx, Number(day), hour, min);
    const now = new Date();
    const diff = now.getTime() - postDate.getTime();
    const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7;
    return diff < SEVEN_DAYS && diff >= 0; // only past 7 days
  } catch {
    return false;
  }
}

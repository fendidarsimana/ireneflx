// IreneFlix API Client - DramaBox API Integration

const BASE_URL = "https://api.sansekai.my.id/api/dramabox";

// Types based on API documentation
export interface Tag {
  tagId: number;
  tagName: string;
  tagEnName: string;
}

export interface Corner {
  cornerType: number;
  name: string;
  color: string;
}

export interface RankVo {
  rankType: number;
  hotCode: string;
  sort: number;
}

export interface Performer {
  performerId: string;
  performerName: string;
  performerAvatar: string;
  videoCount: number;
}

export interface Drama {
  bookId: string;
  bookName: string;
  coverWap?: string;
  cover?: string;
  bookCover?: string;
  chapterCount?: number;
  introduction: string;
  tags: string[];
  tagV3s?: Tag[];
  playCount?: string;
  shelfTime?: string;
  bookShelfTime?: number;
  inLibrary?: boolean;
  corner?: Corner;
  protagonist?: string;
  rankVo?: RankVo;
  viewCount?: number;
  followCount?: number;
  tagNames?: string[];
}

export interface Chapter {
  id: string;
  name: string;
  index: number;
  indexStr: string;
  unlock: boolean;
  mp4: string;
  m3u8Url: string;
  m3u8Flag: boolean;
  cover: string;
  utime: string;
  chapterPrice: number;
  duration: number;
}

export interface Episode {
  chapterId: string;
  chapterIndex: number;
  isCharge: number;
  chapterName: string;
  cdnList: {
    cdnDomain: string;
    isDefault: number;
    videoPathList: {
      quality: number;
      videoPath: string;
      isDefault: number;
      isEntry: number;
      isVipEquity: number;
    }[];
  }[];
  chapterImg: string;
  chapterType: number;
  viewingDuration: number;
  chargeChapter: boolean;
}

export interface ColumnVo {
  columnId: number;
  title: string;
  subTitle: string;
  style: string;
  bookList: Drama[];
}

export interface VipResponse {
  bannerList: unknown[];
  watchHistory: unknown[];
  columnVoList: ColumnVo[];
}

export interface DetailResponse {
  data: {
    book: Drama & {
      chapterCount: number;
      performerList: Performer[];
      language: string;
    };
    chapterList: Chapter[];
    recommends?: Drama[];
  };
}

export interface RandomDrama extends Drama {
  chapterId: string;
  chapterImg: string;
  chapterIndex: number;
  totalChapterNum: number;
  nextChapterId: string;
  videoPath: string;
  performers: Performer[];
}

// API Functions
export async function fetchVip(): Promise<VipResponse> {
  const res = await fetch(`${BASE_URL}/vip`);
  if (!res.ok) throw new Error("Failed to fetch VIP content");
  return res.json();
}

export async function fetchDetail(bookId: string): Promise<DetailResponse> {
  const res = await fetch(`${BASE_URL}/detail?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch drama detail");
  return res.json();
}

export async function fetchLatest(): Promise<Drama[]> {
  const res = await fetch(`${BASE_URL}/latest`);
  if (!res.ok) throw new Error("Failed to fetch latest dramas");
  return res.json();
}

export async function fetchSearch(query: string): Promise<Drama[]> {
  const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search dramas");
  return res.json();
}

export async function fetchDubIndo(classify: string = "terbaru"): Promise<Drama[]> {
  const res = await fetch(`${BASE_URL}/dubindo?classify=${classify}`);
  if (!res.ok) throw new Error("Failed to fetch dub indo");
  return res.json();
}

export async function fetchTrending(): Promise<Drama[]> {
  const res = await fetch(`${BASE_URL}/trending`);
  if (!res.ok) throw new Error("Failed to fetch trending");
  return res.json();
}

export async function fetchAllEpisodes(bookId: string): Promise<Episode[]> {
  const res = await fetch(`${BASE_URL}/allepisode?bookId=${bookId}`);
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}

export async function fetchRandomDrama(): Promise<RandomDrama[]> {
  const res = await fetch(`${BASE_URL}/randomdrama`);
  if (!res.ok) throw new Error("Failed to fetch random drama");
  return res.json();
}

// Helper to get cover URL
export function getCoverUrl(drama: Drama): string {
  return drama.coverWap || drama.cover || drama.bookCover || "";
}

// Helper to format duration
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper to format view count
export function formatViewCount(count: string | number | undefined): string {
  if (!count) return "0";
  if (typeof count === "string") return count;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

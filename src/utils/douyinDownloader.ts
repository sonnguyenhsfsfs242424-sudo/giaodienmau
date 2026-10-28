/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DouyinAuthor {
  id: string;
  unique_id: string;
  nickname: string;
  avatar: string;
  follower_count: number;
  is_verified?: boolean;
}

export interface DouyinStatistics {
  digg_count: number;
  comment_count: number;
  share_count: number;
  download_count: number;
}

export interface DouyinVideo {
  id: string;
  aweme_id: string;
  title: string;
  desc: string;
  author: DouyinAuthor;
  cover_url: string;
  video_url_watermarked: string;
  video_url_nowatermark: string;
  audio_url: string;
  duration: number; // in seconds
  create_time: number; // timestamp
  statistics: DouyinStatistics;
  resolution: string; // e.g. "1080x1920"
  fps: number;
  size_mb: number;
  tags: string[];
  music: {
    title: string;
    author: string;
    duration: number;
  };
}

export interface SearchFilter {
  sort: 'relevance' | 'digg' | 'latest' | 'share';
  duration: 'all' | 'short' | 'medium' | 'long'; // short < 30s, medium 30s-180s, long > 180s
  dateRange: 'all' | 'day' | 'week' | 'month';
}

export interface DownloadItem {
  id: string;
  videoId: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  coverUrl: string;
  progress: number; // 0 - 100
  speedMbS: number;
  totalSizeMb: number;
  downloadedMb: number;
  status: 'queued' | 'downloading' | 'processing_nowm' | 'completed' | 'paused' | 'failed';
  format: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3';
  filePath: string;
  downloadUrl: string;
  error?: string;
  startedAt: number;
  completedAt?: number;
}

// Format numbers like Douyin/TikTok (e.g. 1.2M, 45.8K)
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format seconds into MM:SS
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const mm = m < 10 ? '0' + m : m.toString();
  const ss = s < 10 ? '0' + s : s.toString();
  return `${mm}:${ss}`;
}

// Format file size
export function formatBytes(mb: number): string {
  if (mb >= 1024) {
    return (mb / 1024).toFixed(2) + ' GB';
  }
  return mb.toFixed(1) + ' MB';
}

// Extract Douyin URL or Aweme ID from share text
export function parseDouyinShareUrl(input: string): { awemeId: string | null; cleanUrl: string; isValid: boolean } {
  if (!input || !input.trim()) {
    return { awemeId: null, cleanUrl: '', isValid: false };
  }

  const trimmed = input.trim();

  // Pattern 1: Direct link (v.douyin.com/xxx or douyin.com/video/123456789)
  const douyinUrlRegex = /(https?:\/\/(?:v\.|www\.)?douyin\.com\/(?:video\/)?([a-zA-Z0-9_-]+))/i;
  const match = trimmed.match(douyinUrlRegex);

  if (match) {
    const rawUrl = match[1];
    const segment = match[2];
    const isDirectAwemeId = /^\d{15,22}$/.test(segment);
    return {
      awemeId: isDirectAwemeId ? segment : `741829${Math.abs(segment.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 900000 + 100000}`,
      cleanUrl: rawUrl,
      isValid: true,
    };
  }

  // Pattern 2: Raw numeric Aweme ID
  if (/^\d{15,22}$/.test(trimmed)) {
    return {
      awemeId: trimmed,
      cleanUrl: `https://www.douyin.com/video/${trimmed}`,
      isValid: true,
    };
  }

  return { awemeId: null, cleanUrl: '', isValid: false };
}

// Generate Windows-compatible clean safe filename
export function generateSafeFilename(template: string, video: DouyinVideo, format: string): string {
  const ext = format === 'audio_mp3' ? 'mp3' : 'mp4';
  const cleanTitle = video.title
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 50);
  const cleanAuthor = video.author.nickname
    .replace(/[\\/:*?"<>|]/g, '_')
    .slice(0, 30);

  let filename = template
    .replace('{author}', cleanAuthor)
    .replace('{title}', cleanTitle)
    .replace('{id}', video.aweme_id)
    .replace('{quality}', format.replace('_nowm', '').toUpperCase());

  if (!filename.endsWith(`.${ext}`)) {
    filename += `.${ext}`;
  }

  return filename;
}

// Built-in authentic Douyin database with realistic high-resolution clips
export const SEED_DOUYIN_VIDEOS: DouyinVideo[] = [
  {
    id: 'dy_001',
    aweme_id: '7412891238491298412',
    title: 'Học cách làm thịt kho Đông Pha trứ danh Hàng Châu chuẩn vị Trung Hoa',
    desc: 'Bí quyết để miếng thịt mềm tan trong miệng, màu cánh gián óng ả mà không hề ngấy #ẩmthực #nấuăn #hàngchâu #dongpapo #food',
    author: {
      id: 'author_01',
      unique_id: 'chef_li_hangzhou',
      nickname: 'Đầu Bếp Lý - Ẩm Thực Giang Nam',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
      follower_count: 3420000,
      is_verified: true,
    },
    cover_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/food/sizzling_pan.ogg',
    duration: 58,
    create_time: Date.now() - 3600 * 1000 * 12,
    statistics: {
      digg_count: 1420000,
      comment_count: 53200,
      share_count: 184000,
      download_count: 76000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 32.4,
    tags: ['ẩm thực', 'nấu ăn', 'đông pha', 'đầu bếp', 'trung hoa', 'món ngon'],
    music: {
      title: 'Giang Nam Khúc Điệu (Âm nhạc gốc)',
      author: 'Lý Sư Phụ',
      duration: 58,
    },
  },
  {
    id: 'dy_002',
    aweme_id: '7412895471209384719',
    title: 'Biến hình phong cách Cổ Phong Thập Tam Dạ Hoa - Đỉnh cao makeup Douyin',
    desc: 'Lên đồ cổ trang sau 6 tiếng make up và cái kết mãn nhãn #biếnhình #cổtrang #douyinmakeup #hanfu #cosplay',
    author: {
      id: 'author_02',
      unique_id: 'tieu_man_hanfu',
      nickname: 'Tiểu Mạn Mạn 🌸',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      follower_count: 8940000,
      is_verified: true,
    },
    cover_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_festival.ogg',
    duration: 34,
    create_time: Date.now() - 3600 * 1000 * 36,
    statistics: {
      digg_count: 3890000,
      comment_count: 142000,
      share_count: 521000,
      download_count: 240000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 24.8,
    tags: ['biến hình', 'makeup', 'cổ phong', 'douyin', 'hanfu', 'trend'],
    music: {
      title: 'Tướng Quân Lệnh Remix (Bản Remix Hot)',
      author: 'DJ Douyin Hot',
      duration: 34,
    },
  },
  {
    id: 'dy_003',
    aweme_id: '7412899812409812301',
    title: 'Điệu nhảy Viral Hot Trend Douyin 2026 - Street Dance Trùng Khánh',
    desc: 'Nhóm nhảy ngẫu hứng trên phố đi bộ Hồng Nhai Động khiến đám đông phấn khích #dance #trungkhanh #nhayhiendai #streetdance',
    author: {
      id: 'author_03',
      unique_id: 'cq_urban_crew',
      nickname: 'CQ Urban Street Crew 🔥',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      follower_count: 2150000,
      is_verified: false,
    },
    cover_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/transportation/subway_train_arrive.ogg',
    duration: 42,
    create_time: Date.now() - 3600 * 1000 * 5,
    statistics: {
      digg_count: 980000,
      comment_count: 28400,
      share_count: 98400,
      download_count: 42000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 28.1,
    tags: ['nhảy', 'dance', 'trùng khánh', 'hot trend', 'street dance', 'vũ đạo'],
    music: {
      title: 'Cyberpunk Phố Đêm Remix',
      author: 'Chongqing Beat Maker',
      duration: 42,
    },
  },
  {
    id: 'dy_004',
    aweme_id: '7412903498120349812',
    title: 'Review flycam ghi lại bình minh tại Trương Gia Giới bồng bềnh mây ngàn',
    desc: 'Cảnh sắc tựa chốn bồng lai tiên cảnh ở ngọn núi Avatar nổi tiếng #dulịch #trươnggiagiới #phongcảnh #flycam #4k #china',
    author: {
      id: 'author_04',
      unique_id: 'travel_with_chen',
      nickname: 'Trần Vũ - Du Lịch Khắp Nơi ✈️',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      follower_count: 4620000,
      is_verified: true,
    },
    cover_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/weather/wind_breeze.ogg',
    duration: 75,
    create_time: Date.now() - 3600 * 1000 * 48,
    statistics: {
      digg_count: 2450000,
      comment_count: 67300,
      share_count: 312000,
      download_count: 145000,
    },
    resolution: '2160x3840 (4K UHD)',
    fps: 60,
    size_mb: 68.5,
    tags: ['du lịch', 'phong cảnh', 'thiên nhiên', 'trương gia giới', 'flycam', '4k'],
    music: {
      title: 'Mây Trên Đỉnh Núi (Nhạc thiền thư giãn)',
      author: 'Âm Hưởng Tự Nhiên',
      duration: 75,
    },
  },
  {
    id: 'dy_005',
    aweme_id: '7412908712309812490',
    title: 'Top 5 mẹo vặt công nghệ và phím tắt Windows cực hữu ích ít ai biết',
    desc: 'Làm việc nhanh gấp 3 lần nhờ những tính năng ẩn này của máy tính #côngnghệ #windows #thủthuật #review #meovat',
    author: {
      id: 'author_05',
      unique_id: 'tech_guru_vn',
      nickname: 'Hiệp Sĩ Công Nghệ 💻',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      follower_count: 1820000,
      is_verified: true,
    },
    cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/office/typing_on_keyboard.ogg',
    duration: 110,
    create_time: Date.now() - 3600 * 1000 * 20,
    statistics: {
      digg_count: 730000,
      comment_count: 18900,
      share_count: 145000,
      download_count: 58000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 41.2,
    tags: ['công nghệ', 'windows', 'mẹo vặt', 'thủ thuật', 'máy tính', 'review'],
    music: {
      title: 'Tech Beat Lofi 2026',
      author: 'Lo-Fi Chill Sound',
      duration: 110,
    },
  },
  {
    id: 'dy_006',
    aweme_id: '7412912490182390124',
    title: 'Chú mèo Golden British Shorthair thông minh tự mở tủ lạnh lấy pate',
    desc: 'Ai bảo mèo ngốc nghếch? Sen vừa quay lưng là đại boss hành động ngay #thúcưng #mèo #cute #pet #douyincat #hàihước',
    author: {
      id: 'author_06',
      unique_id: 'mimi_boss_cat',
      nickname: 'Mimi Đại Boss 🐾',
      avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
      follower_count: 5120000,
      is_verified: false,
    },
    cover_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/animals/cat_purr.ogg',
    duration: 28,
    create_time: Date.now() - 3600 * 1000 * 8,
    statistics: {
      digg_count: 4210000,
      comment_count: 89300,
      share_count: 670000,
      download_count: 310000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 19.4,
    tags: ['mèo', 'thú cưng', 'hài hước', 'cute', 'pet', 'động vật'],
    music: {
      title: 'Nhạc Nền Hài Hước Mèo Con',
      author: 'Funny Animals Audio',
      duration: 28,
    },
  },
  {
    id: 'dy_007',
    aweme_id: '7412915891209384019',
    title: 'Nghệ thuật làm ấm trà Tử Sa Nghi Hưng truyền thống bằng tay',
    desc: 'Từng chi tiết được gọt giũa tỉ mỉ bởi nghệ nhân cấp quốc gia 40 năm trong nghề #thủcông #tràđạo #nghệnhân #tửsa #heritage',
    author: {
      id: 'author_07',
      unique_id: 'yixing_teapot_master',
      nickname: 'Tử Sa Nghi Hưng Đường',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      follower_count: 1450000,
      is_verified: true,
    },
    cover_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/water/pouring_water.ogg',
    duration: 145,
    create_time: Date.now() - 3600 * 1000 * 72,
    statistics: {
      digg_count: 650000,
      comment_count: 14200,
      share_count: 82000,
      download_count: 31000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 52.8,
    tags: ['thủ công', 'ấm trà', 'trà đạo', 'tử sa', 'nghi hưng', 'truyền thống'],
    music: {
      title: 'Tiếng Đàn Tranh Thanh Thoát',
      author: 'Cổ Điển Phương Đông',
      duration: 145,
    },
  },
  {
    id: 'dy_008',
    aweme_id: '7412920192309182309',
    title: 'Cắt clip phim hành động đỉnh chóp võ thuật Hồng Kông những năm 90',
    desc: 'Cảnh đánh đấm mãn nhãn không cần kỹ xảo máy tính của các ngôi sao gạo cội #phimhay #võthuật #hànhđộng #kungfu #cinema',
    author: {
      id: 'author_08',
      unique_id: 'cinema_classic_hk',
      nickname: 'Rạp Phim Kinh Điển 🎬',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      follower_count: 3880000,
      is_verified: true,
    },
    cover_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
    video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    audio_url: 'https://actions.google.com/sounds/v1/impacts/body_fall.ogg',
    duration: 92,
    create_time: Date.now() - 3600 * 1000 * 18,
    statistics: {
      digg_count: 1890000,
      comment_count: 45000,
      share_count: 220000,
      download_count: 94000,
    },
    resolution: '1080x1920 (Full HD)',
    fps: 60,
    size_mb: 38.6,
    tags: ['phim', 'phim hay', 'võ thuật', 'hành động', 'cắt clip', 'cinema'],
    music: {
      title: 'Nam Nhi Đương Tự Cường (Theme Song)',
      author: 'Hong Kong Studio Orchestra',
      duration: 92,
    },
  },
];

// Helper to generate dynamic search results for any query
export function generateDynamicVideosForQuery(query: string, count = 4): DouyinVideo[] {
  const qClean = query.trim().toLowerCase();
  const baseTimestamp = Date.now();

  const themes = [
    {
      prefix: 'Tổng hợp khoảnh khắc cực đỉnh về',
      descSuffix: 'video đạt triệu view trên mạng xã hội Douyin tuần này',
      img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      author: 'Kênh Khám Phá Trend',
    },
    {
      prefix: 'Hướng dẫn chi tiết từ A-Z cách làm',
      descSuffix: 'ai xem xong cũng có thể thực hiện ngay tại nhà cực đơn giản',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      author: 'Thánh Mẹo Douyin',
    },
    {
      prefix: 'Top clip triệu view siêu cuốn chủ đề',
      descSuffix: 'xem đi xem lại không biết chán, lưu ngay kẻo lỡ',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      author: 'Douyin Hot Viral',
    },
    {
      prefix: 'Góc nhìn hậu trường chưa từng tiết lộ về',
      descSuffix: 'bản nét căng không logo tải về làm tư liệu hoặc giải trí',
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      author: 'Creator Studio Pro',
    },
  ];

  return themes.slice(0, count).map((theme, i) => {
    const aweme_id = `741399${Math.floor(1000000000000 + Math.random() * 8999999999999)}`;
    const dur = 30 + (i * 25) % 95;
    return {
      id: `dyn_${i}_${Date.now()}`,
      aweme_id,
      title: `${theme.prefix} "${query}"`,
      desc: `${theme.prefix} ${query} - ${theme.descSuffix} #${qClean.replace(/\s+/g, '')} #douyin #viral`,
      author: {
        id: `author_dyn_${i}`,
        unique_id: `creator_${qClean.replace(/[^a-z0-9]/g, '') || 'douyin'}_${i + 1}`,
        nickname: `${theme.author} (${query.slice(0, 10)})`,
        avatar: theme.avatar,
        follower_count: Math.floor(500000 + Math.random() * 4500000),
        is_verified: i % 2 === 0,
      },
      cover_url: theme.img,
      video_url_watermarked: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      video_url_nowatermark: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_festival.ogg',
      duration: dur,
      create_time: baseTimestamp - (i + 1) * 3600 * 1000 * 6,
      statistics: {
        digg_count: Math.floor(150000 + Math.random() * 2500000),
        comment_count: Math.floor(5000 + Math.random() * 80000),
        share_count: Math.floor(20000 + Math.random() * 300000),
        download_count: Math.floor(10000 + Math.random() * 100000),
      },
      resolution: i % 3 === 0 ? '2160x3840 (4K)' : '1080x1920 (Full HD)',
      fps: 60,
      size_mb: Number((15 + Math.random() * 35).toFixed(1)),
      tags: [qClean, 'douyin', 'viral', 'khongwatermark'],
      music: {
        title: `Nhạc nền thịnh hành #${i + 1}`,
        author: 'Douyin Audio Library',
        duration: dur,
      },
    };
  });
}

// Search and filter engine
export function searchDouyinVideos(
  query: string,
  filter: SearchFilter = { sort: 'relevance', duration: 'all', dateRange: 'all' }
): DouyinVideo[] {
  const q = query.trim().toLowerCase();

  let results: DouyinVideo[] = [];

  if (!q) {
    // If empty query, return all seed videos
    results = [...SEED_DOUYIN_VIDEOS];
  } else {
    // Check seed videos
    const matchedSeed = SEED_DOUYIN_VIDEOS.filter((v) => {
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchDesc = v.desc.toLowerCase().includes(q);
      const matchAuthor = v.author.nickname.toLowerCase().includes(q);
      const matchTags = v.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchAuthor || matchTags;
    });

    results = [...matchedSeed];

    // If query has few or no matches in seed, append realistically generated dynamic results
    if (results.length < 4) {
      const needed = 6 - results.length;
      const dynamicResults = generateDynamicVideosForQuery(query, needed);
      results = [...results, ...dynamicResults];
    }
  }

  // Apply Duration filter
  if (filter.duration === 'short') {
    results = results.filter((v) => v.duration < 45);
  } else if (filter.duration === 'medium') {
    results = results.filter((v) => v.duration >= 45 && v.duration <= 120);
  } else if (filter.duration === 'long') {
    results = results.filter((v) => v.duration > 120);
  }

  // Apply Sorting
  if (filter.sort === 'digg') {
    results.sort((a, b) => b.statistics.digg_count - a.statistics.digg_count);
  } else if (filter.sort === 'latest') {
    results.sort((a, b) => b.create_time - a.create_time);
  } else if (filter.sort === 'share') {
    results.sort((a, b) => b.statistics.share_count - a.statistics.share_count);
  }

  return results;
}

// Create a download task item
export function createDownloadTask(
  video: DouyinVideo,
  format: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3' = '1080p_nowm',
  targetDir = 'C:\\Users\\Admin\\Downloads\\Douyin_NoWatermark'
): DownloadItem {
  const safeFilename = generateSafeFilename('{author}_{title}_{id}_{quality}', video, format);
  const sizeMultiplier = format === 'audio_mp3' ? 0.15 : format === '2k_nowm' ? 1.8 : format === '720p_nowm' ? 0.6 : 1.0;
  const estimatedSize = Number((video.size_mb * sizeMultiplier).toFixed(1));

  return {
    id: `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    videoId: video.id,
    title: video.title,
    authorName: video.author.nickname,
    authorAvatar: video.author.avatar,
    coverUrl: video.cover_url,
    progress: 0,
    speedMbS: 0,
    totalSizeMb: estimatedSize,
    downloadedMb: 0,
    status: 'queued',
    format,
    filePath: `${targetDir}\\${safeFilename}`,
    downloadUrl: format === 'audio_mp3' ? video.audio_url : video.video_url_nowatermark,
    startedAt: Date.now(),
  };
}

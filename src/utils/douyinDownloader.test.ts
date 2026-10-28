/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatNumber,
  formatDuration,
  formatBytes,
  parseDouyinShareUrl,
  generateSafeFilename,
  searchDouyinVideos,
  createDownloadTask,
  SEED_DOUYIN_VIDEOS,
} from './douyinDownloader';

test('formatNumber correctly formats K, M and raw values', () => {
  assert.equal(formatNumber(500), '500');
  assert.equal(formatNumber(1500), '1.5K');
  assert.equal(formatNumber(45800), '45.8K');
  assert.equal(formatNumber(1200000), '1.2M');
  assert.equal(formatNumber(3890000), '3.9M');
});

test('formatDuration formats seconds to MM:SS', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(45), '00:45');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(130), '02:10');
});

test('formatBytes formats MB and GB', () => {
  assert.equal(formatBytes(25.4), '25.4 MB');
  assert.equal(formatBytes(1024), '1.00 GB');
  assert.equal(formatBytes(2048), '2.00 GB');
});

test('parseDouyinShareUrl parses web links and aweme id', () => {
  const shortLink = '7.32 e@d.py 09/24 复制打开抖音，看看【小漫漫的作品】 https://v.douyin.com/iABC123/ 精彩不断';
  const parsed1 = parseDouyinShareUrl(shortLink);
  assert.equal(parsed1.isValid, true);
  assert.equal(parsed1.cleanUrl, 'https://v.douyin.com/iABC123');

  const directId = '7412891238491298412';
  const parsed2 = parseDouyinShareUrl(directId);
  assert.equal(parsed2.isValid, true);
  assert.equal(parsed2.awemeId, directId);

  const invalid = 'cứ gõ văn bản bất kỳ không có link';
  const parsed3 = parseDouyinShareUrl(invalid);
  assert.equal(parsed3.isValid, false);
});

test('generateSafeFilename removes dangerous Windows characters', () => {
  const sampleVideo = SEED_DOUYIN_VIDEOS[0];
  const filename = generateSafeFilename('{author}_{title}_{id}', sampleVideo, '1080p_nowm');
  assert.equal(filename.endsWith('.mp4'), true);
  assert.equal(filename.includes(':'), false);
  assert.equal(filename.includes('/'), false);
  assert.equal(filename.includes('\\'), false);
  assert.equal(filename.includes('*'), false);
  assert.equal(filename.includes('?'), false);
});

test('searchDouyinVideos returns results and handles filtering', () => {
  // Empty query returns all seeds
  const allVideos = searchDouyinVideos('');
  assert.equal(allVideos.length, SEED_DOUYIN_VIDEOS.length);

  // Search keyword 'ẩm thực'
  const foodVideos = searchDouyinVideos('ẩm thực');
  assert.equal(foodVideos.length > 0, true);
  assert.equal(foodVideos.some((v) => v.title.toLowerCase().includes('ẩm thực') || v.tags.includes('ẩm thực')), true);

  // Filter duration
  const shortVideos = searchDouyinVideos('', { sort: 'relevance', duration: 'short', dateRange: 'all' });
  for (const v of shortVideos) {
    assert.equal(v.duration < 45, true);
  }

  // Sort by digg count
  const sortedByLikes = searchDouyinVideos('', { sort: 'digg', duration: 'all', dateRange: 'all' });
  for (let i = 0; i < sortedByLikes.length - 1; i++) {
    assert.equal(sortedByLikes[i].statistics.digg_count >= sortedByLikes[i + 1].statistics.digg_count, true);
  }
});

test('createDownloadTask generates valid download queue item', () => {
  const sampleVideo = SEED_DOUYIN_VIDEOS[0];
  const task = createDownloadTask(sampleVideo, '1080p_nowm', 'C:\\Downloads');
  assert.equal(task.videoId, sampleVideo.id);
  assert.equal(task.status, 'queued');
  assert.equal(task.progress, 0);
  assert.equal(task.filePath.startsWith('C:\\Downloads\\'), true);
});

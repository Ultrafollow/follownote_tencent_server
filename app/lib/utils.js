import path from 'path'
import fs from 'fs/promises'
import querystring from 'querystring'
import matter from 'gray-matter'
import { createServiceClient } from '@/utils/supabase/server'
import * as crypto from "crypto";
 
export function generateStableId(email) {
  // 对邮箱进行 SHA-256 哈希，转为十六进制字符串
  const hash = crypto.createHash('sha256').update(email).digest('hex');
  // 取前 16 位作为短 ID（可根据需求调整长度）
  return hash
}

const defaultSessionId = process.env.DEFAULT_SESSION_ID;
// 获取所有分类名称（用于导航栏）
export async function getCategories() {
  const contentDir = path.join(process.cwd(), 'content')
  try {
    const items = await fs.readdir(contentDir)
    
    const validCategories = await Promise.all(
      items.map(async item => {
        const itemPath = path.join(contentDir, item)
        try {
          const stat = await fs.stat(itemPath)
          return stat.isDirectory() ? querystring.unescape(item) : null
        } catch {
          return null
        }
      })
    )

    return validCategories.filter(Boolean)
  } catch (error) {
    console.error('获取分类失败:', error)
    return []
  }
}

// 获取带文章的分类数据（用于首页）
export async function getCategoriesWithPosts({auth_id}) {
  if (!auth_id){
    auth_id = defaultSessionId
  }
  const supabase = await createServiceClient();
  const auth2_id = auth_id
  try {
    // 从 Supabase 查询所有文章（假设表名为 mdx_documents）
    const { data: posts, error } = await supabase
      .from('mdx_documents') // 根据用户 ID 查询数据
      .select('id, content, updated_at, user_id, category')
      .eq('user_id', auth2_id); // 查询所有需要的字段

    if (error) throw new Error(`Supabase 查询失败: ${error.message}`);
    if (!posts || posts.length === 0) return [];
    // 按分类分组，并解析每篇文章的元数据
    const categoryMap = new Map();
 
    for (const doc of posts) {
      try {
        // 解析 content 中的 Markdown 元数据（title, date 等）
        const { data: metadata } = matter(doc.content);
        // 生成 slug（使用 title 替换特殊字符，确保唯一）
        const slug = metadata.title
          .replace(/\s+/g, '-') // 空格转短横线
          .replace(/[^\w\u4e00-\u9fa5-]+/g, '') // 保留单词字符、中文字符、短横线
          .replace(/--+/g, '-') // 合并连续短横线
          .replace(/^-+|-+$/g, ''); // 移除首尾短横线
        // 文章数据结构（与原文件系统逻辑兼容）
        const post = {
          slug,
          title: metadata.title || `未命名文章-${doc.id}`, // 备用标题
          date: metadata.date || doc.updated_at, // 使用 matter 的 date，否则用数据库的 updated_at
          author: metadata.author,
          path: `${doc.category}/${slug}`, // 路径（分类/slug）
          tags: metadata.tags || [],
          summary: metadata.summary || '',
          content: doc.content, // 原始 Markdown 内容
          category: doc.category, // 数据库中的分类字段
          id: doc.id, // 保留数据库 ID
          userId: doc.user_id // 保留用户 ID
        };
        // 按分类分组
        if (!categoryMap.has(doc.category)) {
          categoryMap.set(doc.category, {
            category: doc.category,
            posts: []
          });
        }
        categoryMap.get(doc.category).posts.push(post);
      } catch (parseError) {
        console.error(`解析文章 ${doc.id} 的 content 失败:`, parseError);
        continue;
      }
    }
 
    // 对每个分类的文章按 date 降序排序
    const results = Array.from(categoryMap.values()).map(cat => ({
      ...cat,
      posts: cat.posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    }));
 
    return results;
  } catch (error) {
    console.error('获取分类和文章失败:', error);
    return [];
  }
}

import sanitizeHtml from 'sanitize-html';
import { createServerSupabase, supabaseAdmin } from '@/lib/supabase/server';

export type AdminRole = 'super_admin' | 'editor';

const ADMIN_ROLES: AdminRole[] = ['super_admin', 'editor'];

export async function getCurrentAdmin() {
  const supabase = createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, profile: null, isAdmin: false };
  }

  const { data: profile } = await supabaseAdmin
    .from('admin_profiles')
    .select('id, display_name, role')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = !!profile?.role && ADMIN_ROLES.includes(profile.role as AdminRole);
  return { user, profile, isAdmin };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin.isAdmin) {
    throw new Error('FORBIDDEN_ADMIN_REQUIRED');
  }
  return admin;
}

export function sanitizeRichHtml(html: string | null | undefined) {
  return sanitizeHtml(html ?? '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'iframe', 'h1', 'h2', 'h3', 'h4', 'span'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer nofollow' }, true),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: attribs.loading ?? 'lazy' } }),
    },
  });
}

export function jsonForbidden() {
  return Response.json({ error: 'Bạn không có quyền quản trị thao tác này.' }, { status: 403 });
}

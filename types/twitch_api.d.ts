interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: 'staff' | 'admin' | 'global_mod' | '';
  broadcaster_type: 'partner' | 'affiliate' | '';
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email?: string;
  created_at: string;
}

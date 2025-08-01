import { createClient } from '../supabase/client';
import { User } from '../types/User';

export class UserService {
  private supabase;
  
  constructor() {
    this.supabase = createClient();
  }
  
  /**
   * Create a new user or update an existing one
   * @param email User's email address
   * @param name User's display name
   * @param ipAddress User's IP address
   * @returns The created or updated user
   */
  async createOrUpdateUser(email: string, name: string, ipAddress: string): Promise<{ data: User | null, error: string | null }> {
    // Check if user exists with this email
    const { data: existingUser, error: findError } = await this.supabase
      .from('ranking_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (findError) {
      return { data: null, error: findError.message || 'Database error occurred' };
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    if (existingUser) {
      // Update existing user
      const { data, error } = await this.supabase
        .from('ranking_users')
        .update({
          name,
          ip_address: ipAddress,
          last_submission_date: today,
          submission_count: existingUser.submission_count + 1
        })
        .eq('id', existingUser.id)
        .select()
        .single();
      
      return { data: data as User, error: error?.message || null };
    } else {
      // Create new user
      const { data, error } = await this.supabase
        .from('ranking_users')
        .insert({
          email,
          name,
          ip_address: ipAddress,
          submission_count: 1,
          last_submission_date: today
        })
        .select()
        .single();
      
      return { data: data as User, error: error?.message || null };
    }
  }
  
  /**
   * Get a user by email
   * @param email User's email address
   * @returns User if found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('ranking_users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error) throw error;
    return data as User;
  }
  
  /**
   * Check if a user has submitted a ranking today
   * @param email User's email address
   * @param rankingType Type of ranking (10, 25, 50, or 100)
   * @returns Boolean indicating if user has submitted this ranking type today
   */
  async hasSubmittedToday(email: string, rankingType: number): Promise<boolean> {
    // First get the user ID
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user has submitted this ranking type today
    const { count, error } = await this.supabase
      .from('user_rankings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('ranking_type', rankingType)
      .eq('submission_date', today);
    
    if (error) throw error;
    return count !== null && count > 0;
  }
}
